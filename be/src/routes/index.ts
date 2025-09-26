import express from "express";
import auth from "./auth";
import profile from "./profile";
import ticket from "./ticket";
import checkin from "./checkin";
import hooks from './hooks'
import config from "./config";
import admin from "./admin";
import { UserModel } from "../database/model/User";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import {
  TRANSACTION_STATUS_PROCESSING,
  TRANSACTION_TYPE_BUY_TICKET,
} from "../constants/define";
import uploadCloud from "../helpers/upload";
import uploadService from "../services/upload.service";

const router = express.Router();

router.use("/auth", auth);

router.use("/profile", profile);

router.use("/tickets", ticket);

router.use("/checkin", checkin);

router.use("/config", config);

router.use("/admin", admin);

router.use("/hooks", hooks);

router.post("/upload", uploadCloud, uploadService);

router.get("/reset-draw-admin", async (req, res) => {
  try {
    const result = await UserModel.updateMany({}, { $set: { drawNum: 1 } });
    res.json({
      message: "All users updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error resetting drawNum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/reset-mine-admin", async (req, res) => {
  try {
    const transactions = await TicketTransactionModel.find({
      transaction_status: TRANSACTION_STATUS_PROCESSING,
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
    });

    const userIds = transactions.map((transaction) => transaction.user);

    const result = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $inc: { mineNum: 1 } } // Tăng drawNum của người dùng lên 1
    );

    res.json({
      message: "Users with processing transactions updated successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error resetting drawNum:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
