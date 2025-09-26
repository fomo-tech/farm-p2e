import authentication from "../../auth/authentication";
import ticketController from "../../controller/ticket.controller";
import express from "express";

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get("/", ticketController.getTickets);

router.get("/order/:id", ticketController.getOrderDetail);

router.post("/", ticketController.buyTicket);

router.post("/harvest", ticketController.harvestTicket);

router.get("/orders", ticketController.getOrders);

router.get("/order-reward", ticketController.getOrderReward);

router.post("/gift-duck", ticketController.postGiftTicket);

router.post("/cancel", ticketController.cancelFarmOrder);

router.post("/unlock-land", ticketController.unlockFarm);

export default router;
