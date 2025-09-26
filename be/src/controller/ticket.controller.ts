import {
  BadRequestResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { NFTTicketModel } from "../database/model/Tickets";
import asyncHandler from "../helpers/asyncHandler";
import { ProtectedRequest } from "../types/app-request";
import message from "../messages/ticket";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import {
  TRANSACTION_STATUS_FINISH,
  TRANSACTION_STATUS_LOCKING,
  TRANSACTION_STATUS_PENDING,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_BUY_TICKET,
  TRANSACTION_TYPE_DRAW_REWARD,
  TRANSACTION_TYPE_REFUND_TICKET,
  TRANSACTION_TYPE_REWARD_REFFERAL,
  TRANSACTION_TYPE_REWARD_TICKET,
  TRANSACTION_TYPE_UNLOCK_LAND,
} from "../constants/define";
import User, { UserModel } from "../database/model/User";
import {
  blackBlist,
  commissionRate,
  configVip,
  farmVip,
} from "./config.controller";
import { UserTransactionModel } from "../database/model/UserTransaction";
import { sendMessageToMe } from "../helpers/telegramBot";
import { subtract } from "../helpers/Decimal";
import { sendTranslatedError } from "../helpers/response";

import { add } from "lodash";
import ticket from "../messages/ticket";
import { verifyRecaptcha } from "./auth.controller";
type LangType = "en" | "vi";

export const calculateReferralEarnings = async (
  user: User,
  investmentAmount: number
) => {
  const commissionRates = configVip.vipReward;
  let currentReferrer = user.inviteCode;
  let level = 1;

  //// k cho level đươi nhận

  while (currentReferrer && level <= 3) {
    let referrerUser = await UserModel.findOne({ refCode: currentReferrer });
    if (referrerUser) {
      const rate =
        level === 1
          ? commissionRates.reward_a
          : level === 2
          ? commissionRates.reward_b
          : commissionRates.reward_c;

      const commission = (investmentAmount * rate) / 100;
      if (!blackBlist.includes(referrerUser.userId)) {
        const updatedRealBalance = (referrerUser.realBalance || 0) + commission;

        await UserModel.findByIdAndUpdate(referrerUser, {
          $set: { realBalance: updatedRealBalance },
        });

        await UserTransactionModel.create({
          transaction_status: TRANSACTION_STATUS_FINISH,
          transaction_type: TRANSACTION_TYPE_REWARD_REFFERAL,
          value: commission,
          fiat_amount: 0,
          currentBalanceUser: updatedRealBalance,
          user: referrerUser._id,
          note: "reward refferal",
        });
      }

      currentReferrer = referrerUser.inviteCode || "";
      level++;
    }
  }
};

export function calculateTicketIncome({
  now = Date.now(),
  startTime,
  rewardTime,
  endTime,
  incomePerDay,
}: {
  now?: number;
  startTime: number;
  rewardTime: number;
  endTime: number;
  incomePerDay: number;
}) {
  const oneDay = 24 * 60 * 60 * 1000;

  if (now >= endTime) {
    return (incomePerDay * (endTime - startTime)) / oneDay;
  } else if (Math.abs(now - rewardTime) < 1000) {
    return incomePerDay;
  } else if (now < rewardTime) {
    return (incomePerDay * (now - startTime)) / oneDay;
  } else if (now > rewardTime && now <= endTime) {
    return incomePerDay;
  }

  return 0;
}

export default {
  getTickets: asyncHandler(async (req: ProtectedRequest, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt về 00:00:00 hôm nay

    const tickets = await NFTTicketModel.find({
      status: true,
    }).sort({
      price: 1,
      vip: 1,
    });
    return new SuccessResponse("Loaded", tickets).send(res);
  }),

  buyTicket: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";

    const { ticketId } = req.body;

    const user = req.user;

    const now = new Date();

    const day = now.getDay(); // 0 (Sun) -> 6 (Sat)
    const diffToMonday = day === 0 ? -6 : 1 - day; // Nếu Chủ nhật thì quay về thứ 2 trước đó

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0); // reset về 00:00:00

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const ticket = await NFTTicketModel.findOne({
      _id: ticketId,
    });

    if (!ticket) return new BadRequestResponse("Ticket not found !!").send(res);
    const animalCount = await TicketTransactionModel.countDocuments({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      transaction_status:TRANSACTION_STATUS_PROCESSING
    });

    if (animalCount >= user.currentUnlockedIndex) {
      return new BadRequestResponse("Vui lòng mở khoá thêm chuồng để có thể mua thêm vật nuôi").send(res);
    }

    const purchaseCount = await TicketTransactionModel.countDocuments({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
      ticket: ticketId,
    });

    if (purchaseCount >= 3) {
      return new BadRequestResponse(message[lang].msg3).send(res);
    }

    if (ticket.price > user.realBalance)
      return new BadRequestResponse(message[lang].msg1).send(res);

    user.realBalance = subtract(user.realBalance, ticket.price);

    ticket.order = ticket.order + 1;

    const transaction = await TicketTransactionModel.create({
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
      user: user._id,
      value: -ticket.price,
      currentBalanceUser: user.realBalance.toFixed(2),
      fiat_amount: ticket.price,
      ticket: ticketId,
      transaction_status: TRANSACTION_STATUS_PROCESSING,
      startTime: Date.now(),
      rewardTime: new Date().getTime() + 1000 * 60 * 60 * 24,
      endTime: Date.now() + ticket.earningDay * 1000 * 60 * 60 * 24,
    });

    await ticket.save();

    await UserModel.findByIdAndUpdate(user._id, { ...user });

    await calculateReferralEarnings(user, ticket.price);

    if (user.inviteUser && user.inviteUser.length > 0) {
      for (const inviterId of user.inviteUser) {
        const inviter = await UserModel.findById(inviterId);
        if (inviter) {
          const commission = Number((ticket.price * commissionRate).toFixed(2));

          inviter.realBalance = add(inviter.realBalance, commission);

          await UserTransactionModel.create({
            user: inviter._id,
            transaction_type: TRANSACTION_TYPE_REWARD_REFFERAL,
            transaction_status: TRANSACTION_STATUS_FINISH,
            value: commission,
            currentBalanceUser: inviter.realBalance,
            note: `Receive 1%  (${user.phone}) ticket purchase.`,
          });

          await inviter.save();
        }
      }
    }

    await sendMessageToMe(`
------------ 🛒 Mua TICKET ------------

📱 Phone: ${user.phone}
💸 Price: ${ticket.price}
💳 Current Balance User: ${user.realBalance}
🎫 Ticket Name: ${ticket.name}
`);

    return new SuccessResponse(message[lang].msg2, transaction).send(res);
  }),

  postGiftTicket: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";

    const user = req.user;

    const ticket = await NFTTicketModel.findOne({
      _id: "6808abe5295ed1f8fec651a2",
    });

    if (!ticket) return new BadRequestResponse("Ticket not found !!").send(res);

    if (!user?.duckSticker || user?.duckSticker < 10)
      return new BadRequestResponse("You are not eligible").send(res);

    const transaction = await TicketTransactionModel.create({
      transaction_type: TRANSACTION_TYPE_REWARD_TICKET,
      user: user._id,
      value: -ticket.price,
      currentBalanceUser: user.realBalance,
      fiat_amount: ticket.price,
      ticket: "6808abe5295ed1f8fec651a2",
      transaction_status: TRANSACTION_STATUS_PROCESSING,
      startTime: Date.now(),
      rewardTime: new Date().getTime() + 1000 * 60 * 60 * 24,
    });
    user.duckSticker = 0;

    await UserModel.findByIdAndUpdate(user._id, { duckSticker: 0 });
    await ticket.save();

    await sendMessageToMe(`
------------ 🛒 Đổi Vịt ------------

📱 Phone: ${user.phone}
💸 Price: ${ticket.price}
💳 Current Balance User: ${user.realBalance}
🎫 Ticket Name: ${ticket.name}
`);

    return new SuccessResponse(message[lang].msg2, transaction).send(res);
  }),

  getOrders: asyncHandler(async (req: ProtectedRequest, res) => {
    const trans = await TicketTransactionModel.find({
      user: req.user._id,
      transaction_status: {
        $in: [TRANSACTION_STATUS_PROCESSING, TRANSACTION_STATUS_LOCKING],
      },
      transaction_type: {
        $in: [TRANSACTION_TYPE_DRAW_REWARD, TRANSACTION_TYPE_BUY_TICKET],
      },
    })
      .populate<{ ticket: any }>("ticket")
      .sort({ createdAt: 1 });
  
    const dataWithIncome = trans.map((tran) => {
      const obj = tran.toObject();
      const ticket = obj.ticket as any;
  
      if (
        !obj.rewardTime ||
        !ticket?.incomePerDay ||
        !obj.startTime ||
        !obj.endTime
      ) {
        return {
          ...obj,
          currentIncome: 0,
          currentIncome5s: 0,
        };
      }
  
      const currentIncome = calculateTicketIncome({
        rewardTime: obj.rewardTime,
        startTime: obj.startTime,
        endTime: obj.endTime,
        incomePerDay: ticket.incomePerDay,
      });
  
      const currentIncome5s = ticket.incomePerDay / 17280;
  
      return {
        ...obj,
        currentIncome,
        currentIncome5s,
      };
    });
  
    return new SuccessResponse("ok", dataWithIncome).send(res);
  }),
  

  getOrderDetail: asyncHandler(async (req: ProtectedRequest, res) => {
    const tran = await TicketTransactionModel.findOne({
      user: req.user._id,
      _id: req.params.id,
      transaction_status: {
        $in: [TRANSACTION_STATUS_PROCESSING, TRANSACTION_STATUS_LOCKING],
      },
      transaction_type: {
        $in: [TRANSACTION_TYPE_DRAW_REWARD, TRANSACTION_TYPE_BUY_TICKET],
      },
    }).populate<{ ticket: any }>("ticket");

    if (!tran) return new BadRequestResponse("Order not found").send(res);

    const ticket = tran.ticket as any;

    if (
      !tran?.rewardTime ||
      !ticket?.incomePerDay ||
      !tran?.startTime ||
      !tran.endTime
    ) {
      return { ...tran.toObject(), currentIncome: 0, currentIncome5s: 0 };
    }

    const { rewardTime, startTime, endTime } = tran;
    const { incomePerDay } = tran.ticket;

    const currentIncome = calculateTicketIncome({
      rewardTime,
      startTime,
      endTime,
      incomePerDay,
    });

    const currentIncome5s = ticket.incomePerDay / 17280;

    return new SuccessResponse("ok", {
      ...tran.toObject(),
      currentIncome,
      currentIncome5s,
    }).send(res);
  }),
  getOrderReward: asyncHandler(async (req: ProtectedRequest, res) => {
    const trans = await TicketTransactionModel.find({
      user: req.user._id,
      transaction_status: {
        $in: [
          TRANSACTION_STATUS_FINISH,
          TRANSACTION_STATUS_PROCESSING,
          TRANSACTION_STATUS_LOCKING,
        ],
      },
      transaction_type: {
        $in: [
          TRANSACTION_TYPE_DRAW_REWARD,
          TRANSACTION_TYPE_REWARD_TICKET,
          TRANSACTION_TYPE_BUY_TICKET,
          TRANSACTION_TYPE_UNLOCK_LAND
        ],
      },
    })
      .populate("ticket")
      .sort({
        createdAt: -1,
      });

    return new SuccessResponse("ok", trans).send(res);
  }),

  harvestTicket: asyncHandler(async (req: ProtectedRequest, res) => {
    const now = Date.now();
    const tran = await TicketTransactionModel.findOne({
      _id: req.body.orderId,
      user: req.user._id,
      transaction_status: TRANSACTION_STATUS_PROCESSING,
      transaction_type: {
        $in: [TRANSACTION_TYPE_DRAW_REWARD, TRANSACTION_TYPE_BUY_TICKET],
      },
      status: true,
    }).populate<{ ticket: any; user: User }>("ticket user");

    // const isValidCaptcha = await verifyRecaptcha(req.body.recaptchaToken);
    // if (!isValidCaptcha) {
    //   return new BadRequestResponse("Invalid CAPTCHA").send(res);
    // }

    if (!tran || !tran.ticket || !tran.user) {
      return new BadRequestResponse(
        "Ticket transaction not found or invalid"
      ).send(res);
    }

    const { ticket, user } = tran;
    const { incomePerDay, earningDay, _id: ticketId } = ticket;

    const ticketStart = new Date(tran.createdAt).getTime();
    const ticketEnd = ticketStart + earningDay * 86400000;
    const rawRewardTime = tran.rewardTime || ticketStart;
    const isExpired = now >= ticketEnd;
    const randomCoin = Math.random() * 0.5;

    // Nếu rewardTime vượt quá ticketEnd thì phải lấy ticketEnd làm giới hạn
    const rewardTime = Math.min(rawRewardTime, ticketEnd);

    // Too early to claim
    if (now < rewardTime && !isExpired) {
      return new BadRequestResponse("Too early to harvest reward").send(res);
    }

    // Tính thu nhập
    const income = calculateTicketIncome({
      rewardTime,
      startTime: tran.startTime || ticketStart,
      endTime: ticketEnd,
      incomePerDay,
    });

    if (income <= 0) {
      return new BadRequestResponse("No income to harvest").send(res);
    }

    const farmVipCurent = farmVip[user.farmVip || 1];

    const rewardValue =
      user.farmVip == 0
        ? income
        : income + (income * farmVipCurent.profitPercent) / 10;

    // Ghi nhận giao dịch thưởng
    await TicketTransactionModel.create({
      transaction_type: TRANSACTION_TYPE_REWARD_TICKET,
      user: user._id,
      currentBalanceUser: user.realBalance + rewardValue,
      value: rewardValue,
      fiat_amount: 0,
      ticket: ticketId,
      transaction_status: TRANSACTION_STATUS_FINISH,
      note: isExpired ? "Final reward (ticket expired)" : "Daily reward",
    });

    // Cập nhật số dư và điểm thưởng
    await UserModel.findByIdAndUpdate(user._id, {
      $inc: {
        realBalance: rewardValue,
        coinBalance: randomCoin,
      },
    });

    // Cập nhật transaction gốc
    tran.totalEarn += rewardValue;

    if (isExpired) {
      tran.transaction_status = TRANSACTION_STATUS_FINISH;
      tran.status = false;
    } else {
      tran.rewardTime = Math.min(now + 86400000, ticketEnd);
      tran.startTime = now;
    }
    await tran.save();

    // await calculateReferralEarnings(user, income);

    return new SuccessResponse(
      isExpired
        ? "Final reward harvested. Ticket expired."
        : "Reward harvested successfully",
      { isExpired }
    ).send(res);
  }),
  unlockFarm:asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";

    const user = req.user

    const MAX_UNLOCK_INDEX = 9;
    const COST = 8;

    if (user.currentUnlockedIndex >= MAX_UNLOCK_INDEX) {
      return new BadRequestResponse(message[lang].msgMaxUnlock).send(res);
    }

    if(user.realBalance < COST) return new BadRequestResponse(message[lang].msg1).send(res)
    
      const updatedUser = await UserModel.findByIdAndUpdate(
        user._id,
        {
          $inc: {
            currentUnlockedIndex: 1,
            realBalance: -COST,
          },
        },
        { new: true }
      ).lean();

      await TicketTransactionModel.create({
        transaction_type: TRANSACTION_TYPE_UNLOCK_LAND,
        user: req.user._id,
        currentBalanceUser:user.realBalance -COST  ,
        value: -COST,
        fiat_amount: 0,
        ticket: "0x0000000000",
        transaction_status: TRANSACTION_STATUS_FINISH,
      });

      return new SuccessMsgResponse("ok").send(res);

  }),
  cancelFarmOrder: asyncHandler(async (req: ProtectedRequest, res) => {
    const { orderId } = req.body;
    const order = await TicketTransactionModel.findById(orderId);
    if (!order || !order.endTime) {
      return new BadRequestResponse("order not found").send(res);
    }
    const now = Date.now();

    if (now >= order.endTime) {
      return new BadRequestResponse("order not found").send(res);
    }
    if (
      order.transaction_status !== TRANSACTION_STATUS_PROCESSING ||
      order.status === false
    ) {
      return new BadRequestResponse("Order is not cancellable").send(res);
    }

    const refundAmount = Math.abs(order.value) * 0.1;

    await UserModel.findByIdAndUpdate(req.user._id, {
      $inc: { realBalance: refundAmount },
    });

    order.transaction_status = TRANSACTION_STATUS_FINISH;
    order.status = false;

    await TicketTransactionModel.create({
      transaction_type: TRANSACTION_TYPE_REFUND_TICKET,
      user: req.user._id,
      currentBalanceUser: req.user.realBalance + refundAmount,
      value: refundAmount,
      fiat_amount: 0,
      ticket: order.ticket,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    await order.save();

    return new SuccessMsgResponse("ok").send(res);
  }),

};
