import {
  TRANSACTION_STATUS_FINISH,
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_BUY_TICKET,
  TRANSACTION_TYPE_CHECKIN,
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_DRAW_REWARD,
  TRANSACTION_TYPE_LIXI_REWARD,
  TRANSACTION_TYPE_MINE_REWARD,
} from "../constants/define";
import {
  BadRequestResponse,
  SuccessMsgResponse,
  SuccessResponse,
} from "../core/ApiResponse";
import { UserModel } from "../database/model/User";
import { UserTransactionModel } from "../database/model/UserTransaction";
import asyncHandler from "../helpers/asyncHandler";
import { ProtectedRequest } from "../types/app-request";
import moment from "moment";
import { checkIn } from "./config.controller";
import translator from "open-google-translator";
import { sendTranslatedError } from "../helpers/response";
import { add, subtract } from "../helpers/Decimal";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import message from "../messages/profile";
import { EventModel } from "../database/model/Event";
const weeklyCheckin = [
  { day: "Monday", amount: 0.1 },
  { day: "Tuesday", amount: 0.1 },
  { day: "Wednesday", amount: 0.3 },
  { day: "Thursday", amount: 0.5 },
  { day: "Friday", amount: 1 },
  { day: "Saturday", amount: 1 },
  { day: "Sunday", amount: 3 },
];

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Sunday = 6, Monday = 0
}

type LangType = "en" | "vi";


export const probabilityNewbie = [
  { reward: "0.05", probability: 0.2 },
  { reward: "0.1", probability: 0.15 },
  { reward: "0.15", probability: 0.13 },
  { reward: "0.2", probability: 0.034 },
  { reward: "0.3", probability: 0.032 },
  { reward: "Robot_Part", probability: 0.15 },
  { reward: "5", probability: 0.004 },
  { reward: "Lucky_Clover", probability: 0.3 }
];

export const probabilityMinies = [
  { reward: "lucky", probability: 0.2 },
  { reward: "0.05", probability: 0.2776085 },
  { reward: "0.2", probability: 0.2 },
  { reward: "0.1", probability: 0.2605815 },
  { reward: "0.5", probability: 0.05891 },
  { reward: "1", probability: 0.0028 },
  { reward: "5", probability: 0.0001 },
];

const getRandomReward = (isNewbie = false): string => {
  const pool = probabilityNewbie;

  const totalProbability = pool.reduce(
    (sum, item) => sum + item.probability,
    0
  );

  let random = Math.random() * totalProbability;

  for (const item of pool) {
    random -= item.probability;
    if (random <= 0) {
      return item.reward;
    }
  }

  // Fallback (should rarely happen due to floating point)
  return pool[pool.length - 1].reward;
};
const getRandomRewardMines = (): string => {
  const pool = probabilityMinies;

  const totalProbability = pool.reduce(
    (sum, item) => sum + item.probability,
    0
  );

  let random = Math.random() * totalProbability;

  for (const item of pool) {
    random -= item.probability;
    if (random <= 0) {
      return item.reward;
    }
  }

  // Fallback (should rarely happen due to floating point)
  return pool[pool.length - 1].reward;
};

export default {
  getEvents: asyncHandler(async (req: ProtectedRequest, res) => {
    const events = await EventModel.find().select("-maxValue -minValue");
    return new SuccessResponse("ok", events).send(res);
  }),
  postCheckin: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const user = req.user;

    if (!user) {
      return new BadRequestResponse("User not found!").send(res);
    }

    const now = new Date();
    const startOfTodayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
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

    if (
      now.getUTCDay() === 1 &&
      typeof user.checkInToday !== "undefined" &&
      user.checkInToday > 1
    ) {
      return new BadRequestResponse(message[lang]?.msg_3).send(res);
    }

    // Tính tổng nạp
    // const totalDepositTrans = await UserTransactionModel.find({
    //   user: user._id,
    //   transaction_type: TRANSACTION_TYPE_DEPOSIT,
    //   transaction_status: TRANSACTION_STATUS_FINISH,
    // });

    // const totalEarningValue = totalDepositTrans.reduce(
    //   (sum, tx) => sum + tx.value,
    //   0
    // );

    // const ticketEarning = await TicketTransactionModel.find({
    //   user: user._id,
    //   transaction_type: TRANSACTION_TYPE_BUY_TICKET,
    //   transaction_status: TRANSACTION_STATUS_PROCESSING,
    // });

    // Kiểm tra đã check-in hôm nay chưa
    const isCheckinToday = await UserTransactionModel.findOne({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_CHECKIN,
      transaction_status: TRANSACTION_STATUS_FINISH,
      createdAt: {
        $gte: startOfTodayUTC,
        $lt: endOfTodayUTC,
      },
    });

    if (isCheckinToday) {
      return new BadRequestResponse(message[lang]?.msg_4);
    }

    if (typeof user.checkInToday !== "undefined") {
      const index = user.checkInToday + 1;

      // if (totalEarningValue < 10 && index >= 4) {
      //   return new BadRequestResponse(message[lang]?.msg_3).send(res);
      // }

      // if (!ticketEarning.length && index >= 4)
      //   return new BadRequestResponse(message[lang]?.msg_3).send(res);

      const reward = checkIn[index - 1] || 0;

      await UserTransactionModel.create({
        transaction_status: TRANSACTION_STATUS_FINISH,
        transaction_type: TRANSACTION_TYPE_CHECKIN,
        value: reward,
        fiat_amount: 0,
        currentBalanceUser: add(user.realBalance, reward),
        user: user._id,
        note: index,
      });

      await UserModel.findByIdAndUpdate(user._id, {
        $inc: {
          realBalance: reward,
          checkInToday: 1,
        },
      });
    }

    return res.sendStatus(200);
  }),

  postLuckyDraw: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const user = req.user;

    // Trường hợp người dùng muốn mua lượt quay bằng tiền
    if (Number(user.drawNum || 0) <= 0) {
      if (user.realBalance < 0.2)
        return new BadRequestResponse(message[lang]?.msg_5).send(res);
      user.drawNum = Number(user.drawNum || 0) + 1;
      user.realBalance = subtract(user.realBalance, 0.2);
    }

    // Kiểm tra lượt quay hợp lệ
    if (user.drawNum < 1)
      return sendTranslatedError(res, "You have no spins left", lang);

    const depositUser = await UserTransactionModel.find({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_DEPOSIT,
      transaction_status: TRANSACTION_STATUS_FINISH,
    });

    const ticketUser = await TicketTransactionModel.find({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
    });

    const checkNewbie =
      !depositUser.length && !ticketUser.length && user.realBalance <= 1;

    const reward = getRandomReward(checkNewbie);

    // Xử lý phần thưởng

    let rewardValue = 0;

    switch (reward) {
  case "0.05":
    rewardValue = 0.05;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.1":
    rewardValue = 0.1;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.15":
    rewardValue = 0.15;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.2":
    rewardValue = 0.2;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.3":
    rewardValue = 0.3;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "5":
    rewardValue = 5;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "Robot_Part":
    user.drawNum += 2;
    break;
}

    user.drawNum -= 1;

    // Cập nhật user
    await UserModel.findByIdAndUpdate(user._id, {
      realBalance: user.realBalance,
      drawNum: user.drawNum,
    });

    // Ghi lại transaction
    await UserTransactionModel.create({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_DRAW_REWARD,
      value: rewardValue,
      fiat_amount: 0,
      currentBalanceUser: user.realBalance,
      user: user._id,
      note: reward,
    });

    return new SuccessResponse("ok", reward).send(res);
  }),

  postMines: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const user = await UserModel.findById(req.user._id);

    if (!user) return new BadRequestResponse("User not found").send(res);

    if (Number(user.mineNum || 0) <= 0) {
      if (user.realBalance < 0.2)
        return new BadRequestResponse(message[lang]?.msg_5).send(res);
      user.mineNum = Number(user.mineNum || 0) + 1;
      user.realBalance = subtract(user.realBalance, 0.2);
    }

    if (user.mineNum < 1)
      return sendTranslatedError(res, "You have no turn left", lang);

    const reward = getRandomRewardMines();

    // Xử lý phần thưởng

    let rewardValue = 0;

   switch (reward) {
  case "5":
    rewardValue = 5;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "1":
    rewardValue = 1;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.1":
    rewardValue = 0.1;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.05":
    rewardValue = 0.05;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.2":
    rewardValue = 0.2;
    user.realBalance = add(user.realBalance, rewardValue);
    break;
  case "0.5":
    rewardValue = 0.5;
    user.realBalance = add(user.realBalance, rewardValue);
 
    break;
}

    user.mineNum -= 1;

    // Cập nhật user
    await UserModel.findByIdAndUpdate(user._id, {
      realBalance: user.realBalance,
      mineNum: user.mineNum,
      duckSticker: user.duckSticker,
    });

    // Ghi lại transaction
    await UserTransactionModel.create({
      transaction_status: TRANSACTION_STATUS_FINISH,
      transaction_type: TRANSACTION_TYPE_MINE_REWARD,
      value:  rewardValue ,
      fiat_amount: 0,
      currentBalanceUser: user.realBalance,
      user: user._id,
      note: reward,
    });

    return new SuccessResponse("ok", reward).send(res);
  }),

  postLuckyMomey: asyncHandler(async (req: ProtectedRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";

    const userId = req.user?._id;
    const now = Date.now();

    const event = await EventModel.findOne({
      event_type: TRANSACTION_TYPE_LIXI_REWARD,
      status: true,
      timeStart: { $lte: now },
      timeEnd: { $gte: now }
    });

    if (!event) {
      return new BadRequestResponse(message[lang]?.msg11).send(res);
    }


    if (event.quantity <= 0)
      return new BadRequestResponse(message[lang]?.msg12).send(res);

    // If the event is for farm users, check for valid ticket
    if (event.isFarm) {
      const ticketTrans = await TicketTransactionModel.findOne({
        user: userId,
        transaction_type: TRANSACTION_TYPE_BUY_TICKET,
        transaction_status: TRANSACTION_STATUS_PROCESSING,
      });

      if (!ticketTrans) {
        return new BadRequestResponse(message[lang]?.msg13).send(res);
      }
    }

    // Check if user has already opened lucky money
    const existedTransaction = await UserTransactionModel.findOne({
      user: userId,
      transaction_type: TRANSACTION_TYPE_LIXI_REWARD,
      createdAt: {
        $gte: event.timeStart,
        $lte: event.timeEnd,
      },
    });

    if (existedTransaction) {
      return new BadRequestResponse(message[lang]?.msg14).send(res);
    }

    // Determine lucky money value
    let rewardValue = event.value;
    if (rewardValue === 0) {
      if (
        typeof event.minValue !== "number" ||
        typeof event.maxValue !== "number" ||
        event.minValue > event.maxValue
      ) {
        return new BadRequestResponse(
          "Invalid min/max value configuration for this event."
        ).send(res);
      }

      rewardValue =
        Math.round(
          (Math.random() * (event.maxValue - event.minValue) + event.minValue) *
            10
        ) / 10;
    }

    // Create user transaction
    await UserTransactionModel.create({
      user: userId,
      transaction_type: TRANSACTION_TYPE_LIXI_REWARD,
      value: rewardValue,
      currentBalanceUser: (req.user.realBalance || 0) + rewardValue,
      transaction_status: TRANSACTION_STATUS_FINISH,
      fiat_amount: 0,
      note: "LIXI " + rewardValue,
    });

    await UserModel.findByIdAndUpdate(userId, {
      $inc: { realBalance: rewardValue },
    });
    // Decrease event quantity
    const updatedEvent = await EventModel.findOneAndUpdate(
      { _id: event._id, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res
        .status(400)
        .json({
          error: "Sorry, lucky money has just run out.",
        })
        .send(res);
    }
    return new SuccessResponse("You have received lucky money!", {
      value: rewardValue,
    }).send(res);
  }),
};
