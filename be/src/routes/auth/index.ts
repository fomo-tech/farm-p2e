import rateLimit from "express-rate-limit";
import authController from "../../controller/auth.controller";
import express from "express";

const router = express.Router();

// Giới hạn 3 request mỗi 15 phút cho IP gọi /register
const registerLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 15 phút
  max: 10, // Tối đa 3 lần đăng ký
  message: "Too many register attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Các route auth
router.post("/register", registerLimiter, authController.register);
router.post("/login",registerLimiter, authController.login); // có thể tạo limiter riêng nếu cần
router.post("/admin",registerLimiter, authController.loginAdmin); // tương tự

export default router;
