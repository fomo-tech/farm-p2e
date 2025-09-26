import express from "express";
import hooksController from '../../controller/hooks.controller'

const router = express.Router();

router.post("/check", hooksController.checkDeposit);

export default router;