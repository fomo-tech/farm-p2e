import { ProtectedRequest, PublicRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import { UserModel } from "../database/model/User";
import {
  BadRequestResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { Types } from "mongoose";
import { UserTransactionModel } from "../database/model/UserTransaction";

import {
  TRANSACTION_STATUS_CANCEL,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_BUY_TICKET,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_REWARD_TICKET,
  TRANSACTION_TYPE_WITHDRAW,
} from "../constants/define";

import { TRANSACTION_STATUS_FINISH } from "../constants/define";
import { add, subtract } from "../helpers/Decimal";
import { NFTTicketModel } from "../database/model/Tickets";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import { ConfigModel } from "../database/model/Config";
import _ from "lodash";
import { getIO } from "../socket";
import { farmVip } from "./config.controller";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import { sendMessageToGroup } from "../helpers/telegramBot";
import { EventModel } from "../database/model/Event";
import { users } from "../socket/socket-server";
import { WalletModel } from "../database/model/Wallet";
import { ChatModel } from "../database/model/Chat";

export async function getUserVipLevel(
  userId: string,
  newTransactionValue: number
) {
  const totalDepositTrans = await UserTransactionModel.find({
    transaction_status: TRANSACTION_STATUS_FINISH,
    transaction_type: TRANSACTION_TYPE_DEPOSIT,
    user: userId,
  });

  const totalDep =
    totalDepositTrans.reduce((sum, tx) => sum + tx.value, 0) +
    newTransactionValue;

  // Tìm cấp VIP cao nhất phù hợp với tổng tiền nạp
  let vipLevel = 0;

  for (const [levelStr, data] of Object.entries(farmVip)) {
    const level = Number(levelStr);
    if (totalDep >= data.totalDep && level > vipLevel) {
      vipLevel = level;
    }
  }

  return vipLevel; // trả về cấp VIP (0 nếu chưa đạt cấp nào)
}
export default {
  getWallets: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;

    const [wallets, total] = await Promise.all([
      WalletModel.find()
      .populate('assignedToUser','phone userId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage),
      WalletModel.countDocuments(),
    ]);

    return new SuccessResponse('ok', {
      wallets,
      total,
    }).send(res);
  }),

  // Thêm ví mới
  addWallet: asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const { address } = req.body;

      // Kiểm tra trùng địa chỉ ví
      const existing = await WalletModel.findOne({ address });
      if (existing) {
        return res.status(400).json({ error: 'Địa chỉ ví đã tồn tại' });
      }

      const newWallet = new WalletModel(req.body);
      const savedWallet = await newWallet.save();

      res.status(201).json(savedWallet);
    } catch (err) {
      res.status(400).json({ error: 'Tạo ví thất bại', details: err });
    }
  }),

  // Cập nhật ví
  updateWallet: asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const updatedWallet = await WalletModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedWallet) {
        return res.status(404).json({ error: 'Không tìm thấy ví' });
      }

      res.json(updatedWallet);
    } catch (err) {
      res.status(400).json({ error: 'Chỉnh sửa ví thất bại', details: err });
    }
  }),

  // Xoá ví
  deleteWallet: asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const deleted = await WalletModel.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Không tìm thấy ví' });
      }
      res.json({ message: 'Xóa ví thành công' });
    } catch (err) {
      res.status(400).json({ error: 'Xóa ví thất bại', details: err });
    }
  }),

  getEvents: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;

    const [events, total] = await Promise.all([
      EventModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage),
      EventModel.countDocuments(),
    ]);

    return new SuccessResponse("ok", {
      events,
      total,
    }).send(res);
  }),

  addEvent: asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const { event_type } = req.body;

      // Kiểm tra trùng loại sự kiện
      const existing = await EventModel.findOne({ event_type });
      if (existing) {
        return res.status(400).json({ error: "Loại sự kiện đã tồn tại" });
      }

      const newEvent = new EventModel(req.body);
      const savedEvent = await newEvent.save();
  
      
      res.status(201).json(savedEvent);
    } catch (err) {
      res.status(400).json({ error: "Tạo event thất bại", details: err });
    }
  }),

  updateEvent: asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const updatedEvent = await EventModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ error: "Không tìm thấy event" });
      }
      const io = getIO();

      if (io) {
        io.emit("getConfig");
      }
      
      res.json(updatedEvent);
    } catch (err) {
      res.status(400).json({ error: "Chỉnh sửa thất bại", details: err });
    }
  }),

  deleteEvent: asyncHandler(async (req: ProtectedRequest, res) => {
    try {
      const deleted = await EventModel.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Không tìm thấy event" });
      }
      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(400).json({ error: "Xóa thất bại", details: err });
    }
  }),

  sendBotGroupMessage: asyncHandler(async (req: ProtectedRequest, res) => {
    const { message, imageUrl } = req.body;
    const botId = new Types.ObjectId("000000000000000000000001");
              const botMessageRaw = await ChatModel.create({
                sender: botId,
                content: message,
                readBy: [botId],
                status: true,
              });
      
              const botMessage = {
                ...botMessageRaw.toObject(),
                sender: null
              };
              const io = getIO();

            if (io) {
              users.forEach(async ({ socketId, userId }) => {

                io.to(socketId).emit("newMessage", botMessage);
      
                const countUnreadBot = await ChatModel.countDocuments({
                  readBy: { $ne: userId },
                });
      
                io.to(socketId).emit("unreadCount", countUnreadBot);
              });
              const countUnreadBotSender = await ChatModel.countDocuments();
              io.emit("unreadCount", countUnreadBotSender);
            }
        res.status(200)
          .json({ success: true, message: "Message sent to group successfully" });
  }),

  getTickets: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;

    const [tickets, total] = await Promise.all([
      NFTTicketModel.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage),
      NFTTicketModel.countDocuments(),
    ]);

    return new SuccessResponse("ok", {
      tickets,
      total,
    }).send(res);
  }),

  createNFTTicket: asyncHandler(async (req: ProtectedRequest, res) => {
    const data = req.body;
    const newTicket = new NFTTicketModel(data);

    await newTicket.save();

    return new SuccessResponse("ok", newTicket).send(res);
  }),

  updateNFTTicket: asyncHandler(async (req: ProtectedRequest, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTicket = await NFTTicketModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // trả về document mới cập nhật
    );
    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "NFTTicket not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "NFTTicket updated successfully",
      data: updatedTicket,
    });
  }),
  getDataDashboard: asyncHandler(async (req: ProtectedRequest, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const totalUser = await UserModel.countDocuments();
    const totalUserToday = await UserModel.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    const totalDeposit = await UserTransactionModel.countDocuments({
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    const totalDepositToday = await UserTransactionModel.countDocuments({
      createdAt: { $gte: startOfToday },
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    const totalWithdraw = await UserTransactionModel.countDocuments({
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    const totalWithDrawToday = await UserTransactionModel.countDocuments({
      createdAt: { $gte: startOfToday },
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    const totalInvest = await TicketTransactionModel.countDocuments({
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status: {
        $in: [TRANSACTION_STATUS_FINISH, TRANSACTION_STATUS_PROCESSING],
      },
    });

    const totalInvestToday = await TicketTransactionModel.countDocuments({
      createdAt: { $gte: startOfToday },
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status: {
        $in: [TRANSACTION_STATUS_FINISH, TRANSACTION_STATUS_PROCESSING],
      },
    });

    // Lấy 10 giao dịch user mới nhất
    const latestUserTransactions = await UserTransactionModel.find()
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Lấy 10 giao dịch ticket mới nhất
    const latestTicketTransactions = await TicketTransactionModel.find()
      .populate("user ticket")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return new SuccessResponse("OK", {
      totalUser,
      totalUserToday,
      totalDeposit,
      totalDepositToday,
      totalWithdraw,
      totalWithDrawToday,
      totalInvest,
      totalInvestToday,
      latestUserTransactions,
      latestTicketTransactions,
    }).send(res);
  }),

  updateDataUser: asyncHandler(async (req: ProtectedRequest, res) => {
    const {
      password,
      payment_password,
      inviteCode,
      updateType,
      userId,
      value,
      content,
      isBlock,
      isAccountForAdmin,
      isLockChat,
    } = req.body;

    const user = await UserModel.findById(userId);
    if (!user)
      return new BadRequestResponse("Không tìm thấy người dùng").send(res);

    if (updateType === "deposit") {
      user.realBalance += parseFloat(value);
      await UserTransactionModel.create({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_DEPOSIT,
        value,
        fiat_amount: value,
        currentBalanceUser: req.user.realBalance,
        user: user._id,
        paymentMethod: "banking",
        note: "Admin: " + content,
        status: false,
      });
    }

    if (updateType === "withdraw") {
      user.realBalance =
        parseFloat(value) > user.realBalance
          ? 0
          : user.realBalance - parseFloat(value);
      await UserTransactionModel.create({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_WITHDRAW,
        value,
        fiat_amount: value,
        currentBalanceUser: req.user.realBalance,
        user: user._id,
        note: "Admin: " + content,
        status: false,
      });
    }

    if (updateType === "info") {
      user.password = password || user.password;
      user.payment_password = payment_password || user.payment_password;

      if (inviteCode) {
        const referrer = await UserModel.findOne({ refCode: inviteCode });
        if (!referrer) {
          return new BadRequestResponse("Mã giới thiệu không đúng").send(res);
        }

        const updatedInviteUser = Array.isArray(referrer.inviteUser)
          ? [...referrer.inviteUser, user._id]
          : [user._id];

        await UserModel.findByIdAndUpdate(referrer._id, {
          $set: { inviteUser: updatedInviteUser },
        });
        user.inviteCode = inviteCode || user.inviteCode;
      }
    }

    if (updateType === "delete") {
      await UserModel.findByIdAndDelete(userId);
    }

    if (updateType === "blockUser") {
      user.status = isBlock;
      if (isBlock === false) {
        await KeystoreRepo.remove(user._id);
      }
    }

    if (updateType === "change_tester") {

      user.isAccountForAdmin = isAccountForAdmin;
    }
    if (updateType === "lock_chat") {
      user.isLockChat = isLockChat;
    }
    await user.save();

    return new SuccessMsgResponse("ok").send(res);
  }),
  getUserDetail: asyncHandler(async (req: ProtectedRequest, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user)
      return new BadRequestResponse("Không tìm thấy người dùng").send(res);
    const profile = user?.toObject();

    const totalWithdrawTransactions = await UserTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      user: user._id,
    });

    const totalWithdrawValue = totalWithdrawTransactions.reduce(
      (sum, tx) => sum + tx.value,
      0
    );

    const totalTicketTransactions = await TicketTransactionModel.find({
      transaction_status: {
        $in: [TRANSACTION_STATUS_FINISH, TRANSACTION_STATUS_PROCESSING],
      },
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      user: user._id,
    });

    const totalTicketTransactionsValue = totalTicketTransactions.reduce(
      (sum, tx) => sum + tx.value,
      0
    );

    const totalTicketTransactionsProfit = await TicketTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_REWARD_TICKET,

      user: user._id,
    });
    const totalTicketProfitValue = totalTicketTransactionsProfit.reduce(
      (sum, tx) => sum + tx.value,
      0
    );

    const totalDepositTrans = await UserTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      user: user._id,
    });

    const totalDepositValue = totalDepositTrans.reduce(
      (sum, tx) => sum + tx.value,
      0
    );

    return new SuccessResponse(
      "OK",
      _.omit({
        ...profile,
        totalTicketTransactionsProfit: totalTicketTransactionsProfit.length,
        totalDepositTrans: totalDepositTrans.length,
        totalTicketTransactions: totalTicketTransactions.length,
        totalWithdrawTransactions: totalWithdrawTransactions.length,
        totalDepositValue,
        totalTicketTransactionsValue,
        totalWithdrawValue,
        totalTicketProfitValue,
        ticketTransactions: totalTicketTransactions,
      })
    ).send(res);
  }),
  getConfig: asyncHandler(async (req: ProtectedRequest, res) => {
    const configsCurrent = await ConfigModel.find();

    const configData = _.mapValues(_.keyBy(configsCurrent, "key"), "value");

    return new SuccessResponse("ok", configData).send(res);
  }),
  updateConfig: asyncHandler(async (req: ProtectedRequest, res) => {
    const { key, value } = req.body;
    const config = await ConfigModel.findOne({ key });

    if (!config) return new BadRequestResponse("Lỗi").send(res);

    config.value = value;

    const io = getIO();

    if (io) {
      io.emit("getConfig");
    }

    await config.save();

    return new SuccessMsgResponse("ok").send(res);
  }),
  getAdmin: asyncHandler(async (req: ProtectedRequest, res) => {
    return new SuccessResponse("ok", req.user).send(res);
  }),

  getUsers: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    const search = (req.query.search as string) || "";
    const vip = req.query.vip as string;
    const realBalance = req.query.realBalance as string;

    const searchQuery: any = {};

    if (search) {
      const orConditions: any[] = [
        { phone: { $regex: search, $options: "i" } },
        { uuid: { $regex: search, $options: "i" } },
      ];

      const parsedUserId = Number(search);
      if (!isNaN(parsedUserId)) {
        orConditions.push({ userId: parsedUserId });
      }
      searchQuery.$or = orConditions;
    }

    if (vip !== undefined) {
      // Nếu vip được truyền vào, lọc thêm theo trường vip
      searchQuery.vip = vip;
    }
    if (realBalance !== undefined) {
      // Nếu vip được truyền vào, lọc thêm theo trường vip
      searchQuery.realBalance = { $gte: realBalance };
    }

    const [users, total] = await Promise.all([
      UserModel.find(searchQuery)
        .populate("roles")
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage),
      UserModel.countDocuments(searchQuery),
    ]);

    return new SuccessResponse("ok", {
      users,
      total,
    }).send(res);
  }),

  getUserTransaction: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    const search = (req.query.search as string)?.trim() || "";
    const transaction_type = (req.query.transaction_type as string) || "";
    const transaction_status = (req.query.transaction_status as string) || "";

    const status = (req.query.status as string) || "";

    let userFilterIds: string[] = [];

    if (search) {
      const userSearchConditions: any[] = [
        { phone: { $regex: search, $options: "i" } },
        { registerIp: { $regex: search, $options: "i" } },
      ];

      const parsedUserId = Number(search);
      if (!isNaN(parsedUserId)) {
        userSearchConditions.push({ userId: parsedUserId });
      }

      // Tìm user phù hợp
      const matchedUsers = await UserModel.find({
        $or: userSearchConditions,
      }).select("_id");

      userFilterIds = matchedUsers.map((user) => user._id.toString());
    }
    const query: any = {};

    if (status) query.status = !!status;

    if (transaction_type) {
      const typeArray = Array.isArray(transaction_type)
        ? transaction_type
        : [transaction_type]; // phòng trường hợp chỉ có 1 giá trị

      query.transaction_type = { $in: typeArray };
    }

    if (transaction_status) {
      const typeArray = Array.isArray(transaction_status)
        ? transaction_status
        : [transaction_status]; // phòng trường hợp chỉ có 1 giá trị

      query.transaction_status = { $in: typeArray };
    }

    if (userFilterIds.length > 0) query.user = { $in: userFilterIds };

    const [trasactions, total] = await Promise.all([
      UserTransactionModel.find(query)
        .populate("user")
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage),
      UserTransactionModel.countDocuments(query),
    ]);

    return new SuccessResponse("ok", {
      trasactions,
      total,
    }).send(res);
  }),

  handleTransaction: asyncHandler(async (req: ProtectedRequest, res) => {
    const { transaction_id, typeResolve,reason } = req.body;

    const transaction = await UserTransactionModel.findById(
      transaction_id
    ).populate("user");

    if (!transaction)
      return new BadRequestResponse("Không tìm thấy giao dịch này").send(res);

    const user = transaction.user as any;

    if (transaction.transaction_type === TRANSACTION_TYPE_DEPOSIT) {

      if (typeResolve === "finish") {
        const depositFirst = await UserTransactionModel.find({
          transaction_type:TRANSACTION_TYPE_DEPOSIT,
          transaction_status:TRANSACTION_STATUS_FINISH,
          user:user._id
        })
        transaction.transaction_status = TRANSACTION_STATUS_FINISH;
        transaction.status = false;
        user.realBalance = add(user.realBalance, transaction.value);
        const spinPerFiveDollars = Math.floor(transaction.value / 5);

        let farmVip = await getUserVipLevel(user?._id, transaction.value);

        if (spinPerFiveDollars > 0) {
          user.drawNum = (user?.drawNum || 0) + spinPerFiveDollars;
          user.mineNum = (user?.drawNum || 0) + spinPerFiveDollars;
        }
        user.farmVip = farmVip;
        if(!depositFirst.length){
          user.currentUnlockedIndex +=1
        }
        const io = getIO();

      if (io) {
        const userSocket = users.find(
          (u) => u.userId === user._id.toString()
        );
        if (userSocket) {
          io.to(userSocket.socketId).emit("depositSuccess", {
            isCheck: true,
          });
        }
      }
      
      }
      if (typeResolve === "cancel") {
        transaction.transaction_status = TRANSACTION_STATUS_CANCEL;
        transaction.status = false;
      }
      if (typeResolve === "done") {
        transaction.status = false;
      }
    }

    if (transaction.transaction_type === TRANSACTION_TYPE_WITHDRAW) {
      if (typeResolve === "finish") {
        transaction.transaction_status = TRANSACTION_STATUS_FINISH;
        transaction.status = false;
      }
      if (typeResolve === "cancel") {
        transaction.transaction_status = TRANSACTION_STATUS_CANCEL;
        user.realBalance = add(user.realBalance, -transaction.value);
        transaction.status = false;
        transaction.reason=reason
      }
      if (typeResolve === "done") {
        transaction.status = false;
      }
    }

    await UserModel.findOneAndUpdate(user._id, { ...user });
    await transaction.save();

    return new SuccessMsgResponse("ok").send(res);
  }),

  getTicketTransaction: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 10;
    const search = (req.query.search as string)?.trim() || "";
    const transaction_type = (req.query.transaction_type as string) || "";
    const transaction_status = (req.query.transaction_status as string) || "";

    let userFilterIds: string[] = [];

    if (search) {
      const userSearchConditions: any[] = [
        { phone: { $regex: search, $options: "i" } },
      ];

      const parsedUserId = Number(search);
      if (!isNaN(parsedUserId)) {
        userSearchConditions.push({ userId: parsedUserId });
      }

      // Tìm user phù hợp
      const matchedUsers = await UserModel.find({
        $or: userSearchConditions,
      }).select("_id");

      userFilterIds = matchedUsers.map((user) => user._id.toString());
    }
    const query: any = {};
    if (transaction_type) {
      const typeArray = Array.isArray(transaction_type)
        ? transaction_type
        : [transaction_type]; // phòng trường hợp chỉ có 1 giá trị

      query.transaction_type = { $in: typeArray };
    }

    if (transaction_status) {
      const typeArray = Array.isArray(transaction_status)
        ? transaction_status
        : [transaction_status]; // phòng trường hợp chỉ có 1 giá trị

      query.transaction_status = { $in: typeArray };
    }

    if (userFilterIds.length > 0) query.user = { $in: userFilterIds };

    const [trasactions, total] = await Promise.all([
      TicketTransactionModel.find(query)
        .populate("user ticket")
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage),
      TicketTransactionModel.countDocuments(query),
    ]);

    return new SuccessResponse("ok", {
      trasactions,
      total,
    }).send(res);
  }),

  getDataUserHistory: asyncHandler(async (req: ProtectedRequest, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalTranDepositToday = await UserTransactionModel.aggregate([
      {
        $match: {
          transaction_status: TRANSACTION_STATUS_FINISH,
          transaction_type: TRANSACTION_TYPE_DEPOSIT,
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$value" }, // Giả sử trường tiền là `amount`
        },
      },
    ]);

    const countDepositToday = await UserTransactionModel.countDocuments({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const totalTranWithdrawToday = await UserTransactionModel.aggregate([
      {
        $match: {
          transaction_status: TRANSACTION_STATUS_FINISH,
          transaction_type: TRANSACTION_TYPE_WITHDRAW,
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$value" }, // Giả sử trường tiền là `amount`
        },
      },
    ]);
    const countWithdrawToday = await UserTransactionModel.countDocuments({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    const totalTranDepositAllTime = await UserTransactionModel.aggregate([
      {
        $match: {
          transaction_status: TRANSACTION_STATUS_FINISH,
          transaction_type: TRANSACTION_TYPE_DEPOSIT,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$value" },
          totalFiat: { $sum: "$fiat_amount" },
        },
      },
    ]);
    const countWithdrawAllTime = await UserTransactionModel.countDocuments({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_WITHDRAW,
    });
    const totalTranWithdrawAllTime = await UserTransactionModel.aggregate([
      {
        $match: {
          transaction_status: TRANSACTION_STATUS_FINISH,
          transaction_type: TRANSACTION_TYPE_WITHDRAW,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$value" },
        },
      },
    ]);
    const countDepositAllTime = await UserTransactionModel.countDocuments({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
    });
    const totalDepositAllTime = totalTranDepositAllTime[0]?.total || 0;

    const totalDeposiFiatAllTime = totalTranDepositAllTime[0]?.totalFiat || 0;
    const totalWithdrawAllTime = totalTranWithdrawAllTime[0]?.total || 0;
    const totalDepositToday = totalTranDepositToday[0]?.total || 0;
    const totalDeposiFiatAToday = totalTranDepositToday[0]?.totalFiat || 0;
    const totalWithdrawToday = totalTranWithdrawToday[0]?.total || 0;

    return new SuccessResponse("ok", {
      totalWithdrawAllTime,
      totalDepositAllTime,
      totalDepositToday,
      totalWithdrawToday,
      totalDeposiFiatAllTime,
      totalDeposiFiatAToday,
      countDepositAllTime,
      countWithdrawAllTime,
      countDepositToday,
      countWithdrawToday,
    }).send(res);
  }),

  getDataTicketHistory: asyncHandler(async (req: ProtectedRequest, res) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const countTicketProgress = await TicketTransactionModel.countDocuments({
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status: TRANSACTION_STATUS_PROCESSING,
    });

    const countTicketFinish = await TicketTransactionModel.countDocuments({
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    const countTicketFinishToday = await TicketTransactionModel.countDocuments({
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status: TRANSACTION_STATUS_FINISH,
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    const resultEarnToday = await TicketTransactionModel.aggregate([
      {
        $match: {
          transaction_type: TRANSACTION_TYPE_REWARD_TICKET,
          transaction_status: TRANSACTION_STATUS_FINISH,
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
        },
      },
    ]);

    const totalEarnToday =
      resultEarnToday.length > 0 ? resultEarnToday[0].totalValue : 0;

    return new SuccessResponse("ok", {
      countTicketProgress,
      countTicketFinish,
      countTicketFinishToday,
      totalEarnToday,
    }).send(res);
  }),
};
