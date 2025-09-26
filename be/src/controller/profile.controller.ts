import {
  TRANSACTION_STATUS_FINISH,
  TRANSACTION_STATUS_LOCKING,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_BUY_TICKET,
  TRANSACTION_TYPE_CHECKIN,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_REWARD_REFFERAL,
  TRANSACTION_TYPE_REWARD_TICKET,
  TRANSACTION_TYPE_REWARD_VIP,
  TRANSACTION_TYPE_WITHDRAW,
  WITHDRAW_AMOUNT,
} from "../constants/define";
import {
  BadRequestResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { UserTransactionModel } from "../database/model/UserTransaction";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import asyncHandler from "../helpers/asyncHandler";
import _ from "lodash";
import { ProtectedRequest } from "../types/app-request";
import message from "../messages/profile";
import User, { UserModel } from "../database/model/User";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import mongoose from "mongoose";
import { configVip } from "./config.controller";
import { sendTranslatedError } from "../helpers/response";
import { subtract } from "../helpers/Decimal";
import { sendMessageToMe } from "../helpers/telegramBot";
import { ConfigModel } from "../database/model/Config";
import { generateCode } from "../helpers/handle";
import { setTokenSourceMapRange } from "typescript/lib/typescript";
import { verifyRecaptcha } from "./auth.controller";
import { WalletModel } from "../database/model/Wallet";

type LangType = "en" | "vi";

const filterValidInvitees = async (userIds: string[]) => {
  const deposits = await UserTransactionModel.aggregate([
    {
      $match: {
        user: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
        transaction_type: TRANSACTION_TYPE_DEPOSIT,
        transaction_status: TRANSACTION_STATUS_FINISH,
      },
    },
    {
      $group: {
        _id: "$user",
        totalDeposit: { $sum: "$value" },
      },
    },
    {
      $match: {
        totalDeposit: { $gte: 0 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $replaceRoot: { newRoot: "$user" }, // để trả ra chỉ user object
    },
    {
      $project: {
        userName: 1,
        phone: 1,
        userId: 1,
        createdAt: 1,
        inviteUser: 1,
      },
    },
  ]);

  const validUserIds = deposits.map((item) => item);

  return validUserIds;
};

async function assignWalletForUser(userId: mongoose.Types.ObjectId) {
  // 1. Tìm ví đã được gán cho user đó
  const assigned = await WalletModel.findOne({
    type: "receive",
    isActive: true,
    assignedToUser: userId,
  });

  if (assigned) {
    return assigned;
  }

  // 2. Nếu không có, gán ví mới chưa ai dùng
  const unassigned = await WalletModel.findOneAndUpdate(
    {
      type: "receive",
      isActive: true,
      assignedToUser: null,
    },
    {
      assignedToUser: userId,
      lastUsedAt: Date.now(),
    },
    { new: true }
  );

  if (unassigned) return unassigned;

  // 3. Nếu không có ví trống, lấy ví ít dùng nhất
  const leastUsed = await WalletModel.findOne({
    type: "receive",
    isActive: true,
  }).sort({ lastUsedAt: 1 });

  if (!leastUsed) return null;

  if (
    leastUsed.assignedToUser &&
    !leastUsed.assignedToUser.equals(userId)
  ) {
    return null; // đang bị user khác giữ
  }

  return await WalletModel.findByIdAndUpdate(
    leastUsed._id,
    {
      assignedToUser: userId,
      lastUsedAt: Date.now(),
    },
    { new: true }
  );
}


const pickUserFields = (user: any) =>
  _.pick(user, [
    "_id",
    "userId",
    "userName",
    "phone",
    "createdAt",
    "inviteUser",
  ]);

export const getUserTransactionSummary = async (userId: mongoose.Types.ObjectId) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
  
    const [
      withdraws,
      deposits,
      salaries,
      buyTickets,
      rewardTicketsToday,
      checkinToday,
    ] = await Promise.all([
      UserTransactionModel.find({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_WITHDRAW,
        user: userId,
      }),
      UserTransactionModel.find({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_DEPOSIT,
        user: userId,
      }),
      UserTransactionModel.find({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_REWARD_VIP,
        user: userId,
      }),
      TicketTransactionModel.find({
        transaction_status: {
          $in: [
            TRANSACTION_STATUS_FINISH,
            TRANSACTION_STATUS_PROCESSING,
            TRANSACTION_STATUS_LOCKING,
          ],
        },
        transaction_type: TRANSACTION_TYPE_BUY_TICKET,
        user: userId,
      }),
      TicketTransactionModel.find({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_REWARD_TICKET,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        user: userId,
      }),
      UserTransactionModel.findOne({
        transaction_type: TRANSACTION_TYPE_CHECKIN,
        transaction_status: TRANSACTION_STATUS_FINISH,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
        user: userId,
      }),
    ]);
  
    return {
      totalWithdrawValue: -withdraws.reduce((sum, tx) => sum + tx.value, 0),
      totalDep: deposits.reduce((sum, tx) => sum + tx.value, 0),
      totalReceiveSalary: salaries.reduce((sum, tx) => sum + tx.value, 0),
      totalbuyTicket: -buyTickets.reduce((sum, tx) => sum + tx.value, 0),
      totalRewardToday: rewardTicketsToday.reduce((sum, tx) => sum + tx.value, 0),
      isCheckinToday: !!checkinToday,
    };
  };

export default {
  getHistoryUser: asyncHandler(async (req: ProtectedRequest, res) => {
    let { transaction_type } = req.query;
    
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let query: any = {
      user: req.user._id,
      createdAt: { $gte: oneWeekAgo }
    };
  
    if (transaction_type === 'reward') {
      query.transaction_type = {
        $in: ["reward_refferal", "reward_draw", "reward_mine", "LIXI_MOI_NGAY", "reward_vip","checkin"],
      };
    } else if (transaction_type) {
      query.transaction_type = transaction_type;
    }
  
    const data = await UserTransactionModel.find(query).sort({ createdAt: -1 });
  
    return new SuccessResponse("ok", data).send(res);
  }),
  

  updatePassword: asyncHandler(async (req: ProtectedRequest, res) => {
    const { oldPassword, newPassword, type } = req.body;

    const user = await UserModel.findById(req.user._id);

    if (!type) {
      return new BadRequestResponse("password cant change!!!").send(res);
    }

    if (!user) return new BadRequestResponse("user not found").send(res);

    if (type == "pass_login") {
      if (oldPassword !== user?.password)
        return new BadRequestResponse(
          "Old password login is not match!!!"
        ).send(res);

      user.password = newPassword;
    }
    if (type == "pass_payment") {
      if (oldPassword !== user?.payment_password)
        return new BadRequestResponse(
          "Old password payment is not match!!!"
        ).send(res);

      user.payment_password = newPassword;
    }

    await user.save();

    return new SuccessMsgResponse("ok").send(res);
  }),

  getTeamSummary: asyncHandler(async (req: ProtectedRequest, res) => {
    const userId = req.user._id;
    const user = await UserModel.findById(userId).populate("inviteUser");

    if (!user) return res.status(404).json({ message: "User not found" });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // LEVEL A
    const levelAUsers = user.inviteUser || [];
    const levelAIds = levelAUsers.map((u) => u._id.toString());

    // LEVEL B
    const levelBUsersRaw = await UserModel.find({
      _id: { $in: levelAIds },
    })
      .populate("inviteUser")
      .select("userId phone createdAt userName inviteUser");

    const levelBUsers = levelBUsersRaw.flatMap((u) => u.inviteUser || []);
    const levelBIds = levelBUsers.map((u) => u._id.toString());

    // LEVEL C
    const levelCUsersRaw = await UserModel.find({
      _id: { $in: levelBIds },
    }).populate("inviteUser");

    const levelCUsers = levelCUsersRaw.flatMap((u) => u.inviteUser || []);
    const levelCIds = levelCUsers.map((u) => u._id.toString());

    // Apply filtering if needed (can uncomment if using filtering logic)
    // const validLevelAIds = await filterValidInvitees(levelAIds);
    // const validLevelBIds = await filterValidInvitees(levelBIds);
    const validLevelCIds = await filterValidInvitees(levelCIds);

    const totalTeamMembers =
      levelAIds.length + levelBIds.length + levelCIds.length;

    const totalEarningTrans = await UserTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_REWARD_REFFERAL,
      user: userId,
    });

    const totalEarningTransToday = await UserTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_REWARD_REFFERAL,
      user: userId,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const totalEarningValue = totalEarningTrans.reduce(
      (sum, tx) => sum + tx.value,
      0
    );

    const totalEarningValueToday = totalEarningTransToday.reduce(
      (sum, tx) => sum + tx.value,
      0
    );

    return new SuccessResponse("ok", {
      totalTeamMembers,
      levelA: levelAUsers.map(pickUserFields),
      levelB: levelBUsers.map(pickUserFields),
      levelC: levelCUsers.map(pickUserFields),
      totalEarningValue,
      totalEarningValueToday,
    }).send(res);
  }),

  getProfile: asyncHandler(async (req: ProtectedRequest, res) => {
    const user = req.user;

    const stats = await getUserTransactionSummary(user._id);


    if (!user.registerIp) {
      const rawIp =
        req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
        req.socket?.remoteAddress ||
        req.connection?.remoteAddress ||
        "";

      const ip = rawIp.replace(/^::ffff:/, "");

      await UserModel.findByIdAndUpdate(
        user._id,
        { registerIp: ip },
        { new: true }
      ).lean();
    }

    if (!user.uuid) {
      await UserModel.findByIdAndUpdate(
        user._id,
        { uuid: req.headers["deviceid"] },
        { new: true }
      ).lean();
    }


    let updatedProfile = user;

    return new SuccessResponse(
      "Loaded",
      _.omit(
        {
          ...updatedProfile,
          ...stats
        },
        ["password", "payment_password"]
      )
    ).send(res);
  }),

  logOut: asyncHandler(async (req: ProtectedRequest, res) => {
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse("Logout success").send(res);
  }),

  deposit: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const { amount, fiatAmount, paymentMethod, recaptchaToken } = req.body;
  
    // #region Check Maintenance Mode
    const [
      isMaintance,
      isMaintanceBanking,
      isMaintanceCrypto
    ] = await Promise.all([
      ConfigModel.findOne({ key: "PAYMENT_MAINTENANCE_DEPOSIT" }),
      ConfigModel.findOne({ key: "PAYMENT_MAINTENANCE_DEPOSIT_BANKING" }),
      ConfigModel.findOne({ key: "PAYMENT_MAINTENANCE_DEPOSIT_CRYPTO" })
    ]);
  
    if (isMaintance?.value === "1") {
      return new BadRequestResponse(message[lang].msg_2).send(res);
    }
  
    if (paymentMethod === "banking" && isMaintanceBanking?.value === "1") {
      return new BadRequestResponse(message[lang].msg_2).send(res);
    }
  
    if (paymentMethod === "crypto" && isMaintanceCrypto?.value === "1") {
      return new BadRequestResponse(message[lang].msg_2).send(res);
    }
    // #endregion
  
    // #region Validate amount
    if (amount < 5) {
      return new BadRequestResponse(message[lang].enough_amout).send(res);
    }
  
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentDeposits = await UserTransactionModel.countDocuments({
      user: req.user._id,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      transaction_status: TRANSACTION_STATUS_PENDING,
      createdAt: { $gte: fiveMinutesAgo },
    });
  
    if (recentDeposits >= 2) {
      return new BadRequestResponse(message[lang].msg_1).send(res);
    }
    // #endregion
  
    // #region Generate unique note
    const note = await (async function generateUniqueNote(length = 5) {
      let code;
      let isUnique = false;
      while (!isUnique) {
        code = generateCode(length);
        const existing = await UserTransactionModel.findOne({ note: "DF" + code });
        if (!existing) isUnique = true;
      }
      return "DF" + code;
    })();
    // #endregion
  
    // #region Assign wallet for crypto
    let assignedWallet = null as any;
  
    if (paymentMethod === "crypto") {
      assignedWallet = await assignWalletForUser(req.user._id);
      if (!assignedWallet) {
        return new BadRequestResponse("Hệ thống đang quá tải bạn có thể thử lại sau 5 phút nữa").send(res);
      }
    }
  
    // #endregion
  
    // #region Create deposit transaction
    const newDeposit = await UserTransactionModel.create({
      transaction_status: TRANSACTION_STATUS_PENDING,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      value: amount,
      fiat_amount: fiatAmount,
      currentBalanceUser: req.user.realBalance,
      user: req.user._id,
      walletDeposit: assignedWallet?.address,
      paymentMethod,
      note,
    });
  
    if (assignedWallet?._id) {
      await WalletModel.findByIdAndUpdate(assignedWallet._id, {
        assignedOrderId: newDeposit._id.toString(),
      });
    }
    // #endregion
  
    // #region Send notification
    await sendMessageToMe(`
  -----------🛒 DEPOSIT ------------
  ID NẠP : ${newDeposit._id}
  📱 Phone: ${req.user.phone}
  💳 ID USER : ${req.user._id}
  💳 Cổng : ${paymentMethod}
  💸 Value: ${amount}
  💸 Fiat Amount: ${fiatAmount}
  💳 Current Balance User: ${req.user.realBalance}
  📅 Ngày Nạp: ${new Date().toLocaleString()},
  `);
    // #endregion
  
    return new SuccessResponse("ok", newDeposit).send(res);
  }),
  

  withdraw: asyncHandler(async (req: ProtectedRequest, res) => {
    const isMaintance = await ConfigModel.findOne({
      key: "PAYMENT_MAINTENANCE_WITHDRAW",
    });

    if (isMaintance?.value === "1") {
      return new BadRequestResponse("Withdraw Maintance!!!").send(res);
    }

    const lang: LangType = (req.headers["lang"] as LangType) || "vi";

    const user = await UserModel.findById(req.user._id);

    if (!user) return new BadRequestResponse("User not found").send(res);

    const { amount, fiatAmount, paymentMethod, note, paymentPassword } =
      req.body;

    // Kiểm tra lệnh rút đang chờ
    const pendingWithdraw = await UserTransactionModel.findOne({
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      transaction_status: TRANSACTION_STATUS_PENDING,
      user: user._id,
    });

    if (pendingWithdraw)
      return new BadRequestResponse(message[lang].withdraw_msg1).send(res);

    // Kiểm tra mật khẩu thanh toán
    if (user.payment_password !== paymentPassword)
      return new BadRequestResponse(message[lang].msg_8).send(res);

    // Kiểm tra số tiền rút tối thiểu
    if (amount < WITHDRAW_AMOUNT)
      return new BadRequestResponse(message[lang].enough_amout_2).send(res);

    // Kiểm tra số dư
    if (user.realBalance < amount)
      return new BadRequestResponse(message[lang].enough_amout_2).send(res);
    const now = new Date();

    const startOfTodayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfTodayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const withdrawToday = await UserTransactionModel.findOne({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      transaction_status: TRANSACTION_STATUS_FINISH,
      createdAt: { $gte: startOfTodayUTC, $lt: endOfTodayUTC },
    });

    if (withdrawToday)
      return new BadRequestResponse(message[lang].msg_7).send(res);

    // Xác định thời điểm đầu tuần hiện tại

    // Lấy thứ Hai tuần này
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setHours(0, 0, 0, 0);
    startOfThisWeek.setDate(now.getDate() - now.getDay() + 1);

    // Lấy thứ Hai tuần trước
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Kiểm tra đã mua ticket trong tuần
    const ticketCurrent = await TicketTransactionModel.findOne({
      user: user._id,
      transaction_type: {
        $in: [TRANSACTION_TYPE_BUY_TICKET],
      },
      createdAt: { $gte: startOfLastWeek },
    });

    if (!ticketCurrent)
      return new BadRequestResponse(message[lang].msg_10).send(res);

    const latestWithdraw = await UserTransactionModel.findOne({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      transaction_status: TRANSACTION_STATUS_FINISH,
    }).sort({ updatedAt: -1 });

    if (latestWithdraw) {
      const depositAfterWithdraw = await UserTransactionModel.findOne({
        user: user._id,
        transaction_type: TRANSACTION_TYPE_DEPOSIT,
        transaction_status: TRANSACTION_STATUS_FINISH,
        createdAt: { $gt: latestWithdraw.updatedAt },
      }).sort({ createdAt: 1 });

      if (depositAfterWithdraw) {
        const ticketAfterDeposit = await TicketTransactionModel.findOne({
          user: user._id,
          transaction_type: TRANSACTION_TYPE_BUY_TICKET,
          createdAt: { $gt: depositAfterWithdraw.updatedAt },
        });

        if (!ticketAfterDeposit)
          return new BadRequestResponse(message[lang].msg_6).send(res);
      }
    }

    // Cập nhật số dư
    user.realBalance = subtract(user.realBalance, amount);

    const newWithdraw = await UserTransactionModel.create({
      transaction_status: TRANSACTION_STATUS_PENDING,
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      value: -amount,
      fiat_amount: fiatAmount,
      currentBalanceUser: user.realBalance,
      user: req.user._id,
      paymentMethod,
      note: note || "",
    });

    await UserModel.findByIdAndUpdate(user._id, {
      realBalance: user.realBalance,
    });

    // Gửi thông báo admin
    const bankInfo = JSON.parse(paymentMethod);
    await sendMessageToMe(`
-----------🛒 WITHDRAW ------------

ID RÚT :${newWithdraw._id}

📱 Phone: ${user.phone}
💳 ID USER : ${req.user._id}
💸 Value: ${amount}
💸 Fiat Amount: ${fiatAmount}
💳 Current Balance User: ${user.realBalance}
📅 Ngày Rút: ${new Date().toLocaleString()}

🏦 BANK INFO

🏛 Bank Name: ${bankInfo.nameBank}
👤 Holder Name: ${bankInfo.holderName}
💳 Account Number: ${bankInfo.numberBank}
  `);

    return new SuccessResponse("ok", newWithdraw).send(res);
  }),

  addMethodPayment: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const { holderName, nameBank, numberBank } = req.body;
    const user = req.user;

    // Kiểm tra xem số tài khoản và ngân hàng đã tồn tại ở user khác chưa
    const isUsedByAnotherUser = await UserModel.findOne({
      _id: { $ne: user._id }, // Loại trừ chính user hiện tại
      bankList: {
        $elemMatch: {
          nameBank,
          numberBank,
        },
      },
    });

    if (isUsedByAnotherUser) {
      return new BadRequestResponse(message[lang].bankUsedByOtherUser).send(
        res
      );
    }

    // Kiểm tra trùng trong chính user hiện tại
    if (user.bankList && user.bankList.length > 0) {
      const isDuplicate = user.bankList.some(
        (bank) => bank.numberBank === numberBank && bank.nameBank === nameBank
      );

      if (isDuplicate) {
        return new BadRequestResponse(message[lang].isDuplicate).send(res);
      }

      user.bankList.push({ holderName, nameBank, numberBank });
    } else {
      user.bankList = [{ holderName, nameBank, numberBank }];
    }

    await UserModel.findByIdAndUpdate(user._id, {
      ...user,
    });

    return new SuccessMsgResponse("ok").send(res);
  }),

  deleteMethodPayment: asyncHandler(async (req: ProtectedRequest, res) => {
    const { numberBank, nameBank } = req.body;
    const user = req.user;

    if (!user.bankList || user.bankList.length <= 0) {
      return res.status(400).json({ message: "Not found payment method" });
    }

    const newBankList = user.bankList.filter(
      (bank) => !(bank.numberBank === numberBank && bank.nameBank === nameBank)
    ) as any;

    if (newBankList.length === user.bankList.length) {
      return res.status(400).json({ message: "Not found payment method" });
    }

    user.bankList = newBankList;

    await UserModel.findByIdAndUpdate(user._id, {
      ...user,
    });
    return new SuccessMsgResponse("ok").send(res);
  }),

  getVipCurrent: asyncHandler(async (req: ProtectedRequest, res) => {
    const user = req.user;

    let ids = user.inviteUser || [];

    const vipList = configVip.vipList;

    const vipInfo = vipList.find((i) => i.lv == user.vip);

    const vipLevelUp = vipList.find(
      (i) => i.lv == (user.vip == 8 ? 8 : (user.vip || 0) + 1)
    );

    const result = await TicketTransactionModel.aggregate([
      {
        $match: {
          user: {
            $in: ids.map((id) => new mongoose.Types.ObjectId(id)),
          },
          transaction_type: TRANSACTION_TYPE_BUY_TICKET,
        },
      },
      {
        $group: {
          _id: "$user",
        },
      },
    ]);

    return new SuccessResponse("ok", {
      progress: result.length,
      vipInfo: vipInfo || null,
      vipLevelUp,
    }).send(res);
  }),
  receiveSalary: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const user = req.user;
    const vipList = configVip.vipList;
  
    let totalReward = 0;
    let currentAgencyLv = user.agencyReward || 0;
    const targetVipLv = user.vip || 0;
  
    if (targetVipLv <= currentAgencyLv) {
      return sendTranslatedError(res, "Your account is not eligible", lang);
    }
  
    // Lặp qua từng VIP mốc mà user chưa nhận
    for (let lv = currentAgencyLv + 1; lv <= targetVipLv; lv++) {
      const vipInfo = vipList.find((i) => i.lv === lv);
      if (!vipInfo) continue;
  
      const alreadyReceived = await UserTransactionModel.exists({
        user: user._id,
        transaction_type: TRANSACTION_TYPE_REWARD_VIP,
        note: "salary_vip" + lv,
      });
  
      if (alreadyReceived) continue;
  
      totalReward += vipInfo.wage;
  
      // Tạo transaction
      await UserTransactionModel.create({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_REWARD_VIP,
        value: vipInfo.wage,
        fiat_amount: 0,
        currentBalanceUser: user.realBalance + totalReward,
        user: user._id,
        note: "salary_vip" + lv,
      });
  
      currentAgencyLv = lv;
    }
  
    if (totalReward === 0) {
      return sendTranslatedError(res, "Your account has received the reward", lang);
    }
  
    // Cập nhật số dư và agencyReward mới
    user.realBalance += totalReward;
    user.agencyReward = currentAgencyLv;
  
    await UserModel.findByIdAndUpdate(user._id, {
      realBalance: user.realBalance,
      agencyReward: currentAgencyLv,
    });
  
    return new SuccessMsgResponse("Success").send(res);
  }),
  
};
