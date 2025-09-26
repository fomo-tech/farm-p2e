import authentication from "../../auth/authentication";
import profileController from "../../controller/profile.controller";
import express from "express";

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/


router.get('/',profileController.getProfile)

router.delete("/", profileController.logOut);

router.post("/deposit", profileController.deposit);

router.post("/withdraw", profileController.withdraw);

router.post("/method-payment", profileController.addMethodPayment);

router.delete("/method-payment", profileController.deleteMethodPayment);


router.get("/vip-info", profileController.getVipCurrent);

router.post("/receive-salary", profileController.receiveSalary);

router.get("/summary-team", profileController.getTeamSummary);

router.post("/update-password", profileController.updatePassword);

router.get("/history-user", profileController.getHistoryUser);

export default router;