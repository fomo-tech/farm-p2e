// load env

import dotenv from "dotenv";
dotenv.config()


import express  from "express";
import cors from "cors";

// initialize database
import "./database"; 

import initCron from "./cron";

import routes from "./routes";

import { Server } from "http";
import { Socket } from "socket.io";
import { SocketServer } from "./socket/socket-server";
import path from "path";
import { initSocket } from "./socket";
const app = express();

app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

const uploadDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/v1", routes);

// Socket
const httpServer: Server = require("http").createServer(app);
const io = initSocket(httpServer);

io.on("connection", (socket) => {
  SocketServer(socket);
});
 
initCron()



export default httpServer;
