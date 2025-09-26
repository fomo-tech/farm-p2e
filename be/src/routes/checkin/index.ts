import authentication from "../../auth/authentication";
import checkinController from "../../controller/checkin.controller";
import express from "express";
import rateLimit from "express-rate-limit";




const router = express.Router();

const checkinRateLimiter = rateLimit({
  windowMs: 60 * 1000 * 15, // 1 phút
  max: 100, // tối đa 5 lần trong 1 phút
  message: {
    success: false,
    message: "Too many check-in attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.post("/",checkinRateLimiter, checkinController.postCheckin);

router.post("/draw",checkinRateLimiter, checkinController.postLuckyDraw);

router.post("/mine", checkinController.postMines);

router.post("/lucky-money",checkinRateLimiter, checkinController.postLuckyMomey);

router.get(
  "/get-events",
  checkinController.getEvents,
);

export default router;