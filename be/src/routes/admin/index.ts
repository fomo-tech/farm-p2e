import express from "express";
import adminController from "../../controller/admin.controller";
import authentication from "../../auth/authentication";
import permission from "../../helpers/permission";
import role from "../../helpers/role";
import { RoleCode } from "../../database/model/Role";
import authorization from "../../auth/authorization";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.get("/", adminController.getAdmin);

router.get("/dashboard", adminController.getDataDashboard);

router.get("/users", adminController.getUsers);

router.get("/user/:userId", adminController.getUserDetail);

router.post("/userData", adminController.updateDataUser);

router.get("/transactions", adminController.getUserTransaction);

router.get("/tickets", adminController.getTicketTransaction);

router.post("/transaction", adminController.handleTransaction);

router.get("/configs", adminController.getConfig);

router.post("/config", adminController.updateConfig);

router.get("/data-users", adminController.getDataUserHistory);

router.get("/data-tickets", adminController.getDataTicketHistory);

router.get("/tickets", adminController.getTicketTransaction);

router.get("/invest-packs", adminController.getTickets);

router.post("/invest-pack", adminController.createNFTTicket);

router.post("/invest-pack/:id", adminController.updateNFTTicket);

router.post("/send-message-bot", adminController.sendBotGroupMessage);

router.get("/events", adminController.getEvents);

router.post("/event", adminController.addEvent);

router.post("/event/:id", adminController.updateEvent);

router.delete("/event/:id", adminController.deleteEvent);

router.get("/wallets", adminController.getWallets);

router.post("/wallet", adminController.addWallet);

router.post("/wallet/:id", adminController.updateWallet);

router.delete("/wallet/:id", adminController.deleteWallet);

export default router;
