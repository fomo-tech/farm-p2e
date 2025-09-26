import { configVip, farmVip } from "../controller/config.controller";
import {
  TRANSACTION_STATUS_CANCEL,
  TRANSACTION_STATUS_FINISH,
  TRANSACTION_STATUS_LOCKING,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_BUY_TICKET,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_DRAW_REWARD,
  TRANSACTION_TYPE_REFUND_TICKET,
  TRANSACTION_TYPE_REWARD_TICKET,
} from "../constants/define";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import User, { UserModel } from "../database/model/User";
import { UserTransactionModel } from "../database/model/UserTransaction";
import cron from "node-cron";
import mongoose, { Types } from "mongoose";
import { sendMessageToGroup } from "../helpers/telegramBot";
import { WalletModel } from "../database/model/Wallet";
import axios from "axios";
import { USDT_CONTRACT } from "../config";
// import Web3 from 'web3'
import { getUserVipLevel } from "../controller/admin.controller";
import { getIO } from "../socket";
import { users } from "../socket/socket-server";

const USDT_DECIMALS = 18;


async function processWallet(wallet: any) {
  const address = wallet.address.toLowerCase();
  const userId = wallet.assignedToUser;
  const assignedOrderId = wallet.assignedOrderId;
  const startBlock = Number(wallet.lastBlockNumber || 0);

  const apiKey = process.env.BSCSCAN_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing BSCSCAN_API_KEY env var");
    return;
  }

  const url = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&contractaddress=${USDT_CONTRACT}&startblock=${startBlock}&endblock=99999999&sort=desc&apikey=${apiKey}`;

  const response = await axios.get(url);
  const txs = response.data?.result || [];

  if (response.data.status !== "1" || txs.length === 0) return;

  const existingTx = await UserTransactionModel.findOne({
    _id: assignedOrderId,
    walletDeposit: wallet.address,
    transaction_type: TRANSACTION_TYPE_DEPOSIT,
    transaction_status: TRANSACTION_STATUS_PENDING,
    user: userId,
  });

  if (!existingTx) return;

  const createdAt = new Date(existingTx.createdAt);
  const matchedTx = txs.find((tx: any) =>
    tx.to.toLowerCase() === address &&
    tx.contractAddress.toLowerCase() === USDT_CONTRACT.toLowerCase() &&
    Number(tx.value) > 0 &&
    Number(tx.blockNumber) > startBlock &&
    Number(tx.timeStamp) * 1000 >= createdAt.getTime()
  );

  if (!matchedTx) return;

  const txHash = matchedTx.hash;
  const hashExists = await UserTransactionModel.exists({ hash: txHash });
  if (hashExists) return;

  const decimals = Number(matchedTx.tokenDecimal || USDT_DECIMALS);
  const tokenAmount = Number(matchedTx.value) / Math.pow(10, decimals);

  if (tokenAmount < existingTx.value) return;

  const user = await UserModel.findById(userId);
  if (!user) return;

  const depositFirst = await UserTransactionModel.find({
    transaction_type: TRANSACTION_TYPE_DEPOSIT,
    transaction_status: TRANSACTION_STATUS_FINISH,
    user: user._id,
  });

  const farmVip = await getUserVipLevel(user._id.toString(), tokenAmount);
  const spin = Math.floor(tokenAmount / 5);

  user.realBalance += tokenAmount;
  user.drawNum = (user.drawNum || 0) + spin;
  user.mineNum = (user.mineNum || 0) + spin;
  user.farmVip = farmVip;

  if (!depositFirst.length) {
    user.currentUnlockedIndex += 1;
  }

  await user.save();

  existingTx.transaction_status = TRANSACTION_STATUS_FINISH;
  existingTx.hash = txHash;
  existingTx.currentBalanceUser = user.realBalance;
  existingTx.status = false;
  await existingTx.save();

  await WalletModel.findByIdAndUpdate(wallet._id, {
    assignedToUser: null,
    assignedOrderId: null,
    lastUsedAt: Number(matchedTx.timeStamp) * 1000,
    lastBlockNumber: Number(matchedTx.blockNumber),
  });

  const io = getIO();
  const userSocket = users.find((u) => u.userId === user._id.toString());
  if (io && userSocket) {
    io.to(userSocket.socketId).emit("depositSuccess", { isCheck: true });
  }

  console.log(`✅ Deposit for user ${user._id} with tx ${txHash}`);
}


async function checkWalletDeposits() {
  const wallets = await WalletModel.find({
    isActive: true,
    assignedToUser: { $ne: null },
    assignedOrderId: { $ne: null },
  });

  if (wallets.length === 0) return;

  await Promise.allSettled(wallets.map(wallet => processWallet(wallet)));
}




let isRunning = false;

const initCron = () => {
    // Cron quét ví nạp
    
    cron.schedule('*/5 * * * * *', async () => {
      if (isRunning) return;
      isRunning = true;
      try {
        await checkWalletDeposits();
      } catch (err) {
        console.error('Deposit check error:', err);
      } finally {
        isRunning = false;
      }
    });

  // cron reset drawNum

  cron.schedule("0 0 * * *", async () => {
    console.log("Start daily reset drawNum + reset/calculate mineNum at", new Date());
  
    try {
      const users = await UserModel.find();
  
      const bulkOps = users.map((user) => {
        const levelVip = user?.farmVip || 0;
        const activityPlus = farmVip[levelVip]?.activityPlus ?? 1;
  
        const newDrawNum = activityPlus;
        const newMineNum = levelVip >= 1 ? activityPlus : 0;
  
        return {
          updateOne: {
            filter: { _id: user._id },
            update: {
              $set: {
                drawNum: newDrawNum,
                mineNum: newMineNum,
              },
            },
          },
        };
      });
  
      if (bulkOps.length > 0) {
        const bulkResult = await UserModel.bulkWrite(bulkOps);
        console.log(
          `Reset drawNum and mineNum for ${bulkResult.modifiedCount} users based on VIP level`
        );
      } else {
        console.log("No users found for daily reset");
      }
    } catch (error) {
      console.error("Lỗi reset drawNum + mineNum:", error);
    }
  });
  

  cron.schedule("*/10 * * * *", async () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
    try {
      const result = await UserTransactionModel.updateMany(
        {
          transaction_type: TRANSACTION_TYPE_DEPOSIT,
          transaction_status: TRANSACTION_STATUS_CANCEL,
          status: true,
          createdAt: { $lt: fiveHoursAgo },
        },
        {
          $set: { status: false },
        }
      );

      console.log(
        `Updated ${result.modifiedCount} expired deposit transactions.`
      );
    } catch (err) {
      console.error("Error updating expired deposit transactions:", err);
    }
  });

  //cron VIP

  cron.schedule("*/1 * * * *", async () => {
    console.log(`[VIP CRON] Start at ${new Date().toISOString()}`);

    try {
      const users = await UserModel.find().populate("inviteUser").lean();

      for (const user of users) {
        try {
          // Kiểu khai báo cho inviteUser
          let inviteUsersRaw = Array.isArray(user.inviteUser)
            ? user.inviteUser
            : [user.inviteUser];

          const inviteUserIds: Types.ObjectId[] = inviteUsersRaw
            .filter(Boolean)
            .map((u: any) => {
              const id = u && u._id ? u._id : u;
              return mongoose.isValidObjectId(id)
                ? new mongoose.Types.ObjectId(id)
                : null;
            })
            .filter((id): id is Types.ObjectId => id !== null);

          if (inviteUserIds.length === 0) continue;

          const result = await TicketTransactionModel.aggregate([
            {
              $match: {
                user: { $in: inviteUserIds },
                transaction_type: { $in: [TRANSACTION_TYPE_BUY_TICKET] },
              },
            },
            {
              $group: { _id: "$user" },
            },
          ]);

          const successfulInviteCount = result.length;

          let matchedVip = null;
          for (let i = configVip.vipList.length - 1; i >= 0; i--) {
            const vip = configVip.vipList[i];
            if (successfulInviteCount >= vip.invite_num) {
              matchedVip = vip;
              break;
            }
          }

          if (matchedVip && user.vip !== matchedVip.lv) {
            await UserModel.updateOne(
              { _id: user._id },
              { $set: { vip: matchedVip.lv } }
            );
            console.log(
              `✅ User ${user._id} được nâng VIP level ${matchedVip.lv}`
            );
          }
        } catch (userError: any) {
          console.error(
            `❌ Lỗi xử lý user ${user._id}:`,
            userError?.message || userError
          );
        }
      }
    } catch (error: any) {
      console.error("❌ VIP Cron job error:", error?.message || error);
    }
  });
  //cron refund ticket

  cron.schedule("*/1 * * * *", async () => {
    const transactions = await TicketTransactionModel.find({
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status: {
        $in: [TRANSACTION_STATUS_LOCKING, TRANSACTION_STATUS_PROCESSING],
      },
    }).populate<{ ticket: any; user: User }>("ticket user");

    const now = Date.now();

    for (const tran of transactions) {
      if (!tran.ticket || !tran.user) continue;
      const createdAt = new Date(tran.createdAt).getTime();
      const earningDuration = tran.ticket.earningDay * 24 * 60 * 60 * 1000;
      const earningEndTime = createdAt + earningDuration + 60 * 60 * 1000;
      if (now >= earningEndTime) {
        await TicketTransactionModel.create({
          transaction_type: TRANSACTION_TYPE_REFUND_TICKET,
          user: tran.user._id,
          currentBalanceUser: tran.user.realBalance,
          value: 0,
          fiat_amount: 0,
          ticket: tran.ticket._id,
          transaction_status: TRANSACTION_STATUS_FINISH,
        });

        tran.transaction_status = TRANSACTION_STATUS_FINISH;

        await tran.save();
      }
    }
  });

  //cron transaction deposit

  cron.schedule("*/1 * * * *", async () => {
    const deposits = await UserTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_PENDING,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
    });
    for (const tran of deposits) {
      if (new Date(tran.createdAt).getTime() + 1000 * 60 * 10 <= Date.now()) {
        tran.transaction_status = TRANSACTION_STATUS_CANCEL;
        tran.note = "Expire time";
        await tran.save();
      }
    }
  });

  //cron reset checkin
  cron.schedule("0 0 * * 1", async () => {
    try {
      console.log("Running cron job to reset checkInToday to 0 for all users.");

      // Reset checkInToday về 0 cho tất cả người dùng
      await UserModel.updateMany(
        { checkInToday: { $exists: true } }, // Chỉ cập nhật những người có trường checkInToday
        { $set: { checkInToday: 0 } } // Thiết lập checkInToday = 0
      );
    } catch (error) {
      console.error("Error while resetting checkInToday for all users:", error);
    }
  });

 // Cron  Quét ví assigned nhưng user ko còn lệnh pending -> reset

cron.schedule('*/1 * * * *', async () => {
  console.log('Running cron job to check pending deposits and orphan wallets');
  const wallets = await WalletModel.find({ assignedToUser: { $ne: null } });

  const now = Date.now();

  for (const w of wallets) {
    const countPending = await UserTransactionModel.countDocuments({
      walletDeposit: w._id,
      transaction_status: TRANSACTION_STATUS_PENDING,
    });

    const lastUsedAt = Number(w.lastUsedAt || 0);
    const expired = lastUsedAt + 10 * 60 * 1000 < now; // quá 10 phút

    if (countPending === 0 && expired) {
      console.log(`Resetting orphan wallet ${w.address} (inactive for 10+ mins)`);
      await WalletModel.findByIdAndUpdate(w._id, {
        assignedToUser: null,
        assignedOrderId: null,
      });
    }
  }

});

 
};
export default initCron;
