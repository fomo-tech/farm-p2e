
import express from "express";
import configController from "../../controller/config.controller";
import rateLimit from "express-rate-limit";
const router = express.Router();

// const registerLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 phút
//   max: 50, // Tối đa 3 lần đăng ký
//   message: "Too many register attempts from this IP, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

router.get("/", configController.getConfig);

export default router;