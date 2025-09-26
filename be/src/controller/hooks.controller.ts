import { PublicRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import { UserTransactionModel } from "../database/model/UserTransaction";
import User, { UserModel } from "../database/model/User";
import {
  TRANSACTION_STATUS_FINISH,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_DEPOSIT,
} from "../constants/define";
import { users } from "../socket/socket-server";
import { getIO } from "../socket";
import { getUserVipLevel } from "./admin.controller";

export default {
  checkDeposit: asyncHandler(async (req: PublicRequest, res) => {
    const { transferAmount, content } = req.body;
    const amount = Number(transferAmount);
    const MARGIN = 100;

    console.log("Checking deposit:", amount, content);

    // Lấy mã FTxxxxx từ content
    const match = content.match(/DF\d+/);
    if (!match) {
      console.warn("Không tìm thấy mã giao dịch FTxxxxx trong content");
      return res.sendStatus(400);
    }

    const ftCode = match[0]; // ví dụ: FT25134366060331

    // Tìm transaction với note chứa mã này
    const trans = await UserTransactionModel.findOneAndUpdate(
      {
        note: { $regex: ftCode, $options: "i" }, // tìm trong note chứa mã FTxxxx
        transaction_status: TRANSACTION_STATUS_PENDING,
        transaction_type: TRANSACTION_TYPE_DEPOSIT,
      },
      {
        $set: { transaction_status: TRANSACTION_STATUS_PROCESSING },
      },
      {
        new: true,
      }
    ).populate<{ user: User }>("user");

    if (!trans || !trans.fiat_amount || !trans.user) {
      console.log("====================================");
      console.log("Không tìm thấy nè");
      console.log("====================================");
      return res.sendStatus(400);
    }

    // So sánh số tiền cho phép sai số
    if (Math.abs(trans.fiat_amount - amount) > MARGIN) {
      console.log("====================================");
      console.log("Số tiền k đúng");
      console.log("====================================");

      trans.transaction_status = TRANSACTION_STATUS_PENDING;
      await trans.save();
      return res.sendStatus(400);
    }

    try {
      let farmVip = await getUserVipLevel(
        trans.user?._id.toString(),
        trans.value
      );

      trans.transaction_status = TRANSACTION_STATUS_FINISH;
      trans.currentBalanceUser=Number(trans.value + trans.user.realBalance)
      trans.status = false;

      const spinPerFiveDollars = Math.floor(trans.value / 5);

      await UserModel.findByIdAndUpdate(trans.user._id, {
        $inc: {
          realBalance: trans.value,
          drawNum: spinPerFiveDollars,
          mineNum: spinPerFiveDollars,
        },
        $set: {
          farmVip, // đảm bảo farmVip cập nhật đúng kiểu (số hoặc object)
        },
      });

      await trans.save();

      //socket
      const io = getIO();

      if (io) {
        const userSocket = users.find(
          (u) => u.userId === trans.user._id.toString()
        );
        if (userSocket) {
          io.to(userSocket.socketId).emit("depositSuccess", {
            isCheck: true,
          });
        }
      }

      return res.sendStatus(200);
    } catch (err) {
      console.error("Deposit error:", err);
      trans.transaction_status = TRANSACTION_STATUS_PENDING;
      await trans.save();
      return res.status(500).json({ message: "Lỗi xử lý giao dịch" });
    }
  }),
};
