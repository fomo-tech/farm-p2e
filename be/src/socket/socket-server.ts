import { Socket } from "socket.io";
import {
  TRANSACTION_TYPE_DRAW_REWARD,
  TRANSACTION_TYPE_BUY_TICKET,
  TRANSACTION_STATUS_LOCKING,
  TRANSACTION_STATUS_PROCESSING,
} from "../constants/define";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import { calculateTicketIncome } from "../controller/ticket.controller";
import { ChatModel } from "../database/model/Chat";
import { Types } from "mongoose";
import { getReply } from "../helpers/telegramBot";

interface IUserSocket {
  userId: string;
  socketId: string;
}

const users: IUserSocket[] = [];
const messageCooldown: Record<string, number> = {};

const BOT_ID = "bot";

const SocketServer = (socket: Socket) => {
  // Khi user join app
  socket.on("joinApp", (userId: string) => {
    const existingUserIndex = users.findIndex((u) => u.userId === userId);

    if (existingUserIndex !== -1) {
      users[existingUserIndex].socketId = socket.id;
    } else {
      users.push({ socketId: socket.id, userId });
    }
     console.log('====================================');
     console.log("join app :",userId);
     console.log('====================================');
  });

  // Xử lý getOrders 1 lần khi client emit
  socket.on("getOrders", async ({ userId }) => {
    try {
      const trans = await TicketTransactionModel.find({
        user: userId,
        transaction_status: {
          $in: [TRANSACTION_STATUS_PROCESSING, TRANSACTION_STATUS_LOCKING],
        },
        transaction_type: {
          $in: [TRANSACTION_TYPE_DRAW_REWARD, TRANSACTION_TYPE_BUY_TICKET],
        },
      })
        .populate("ticket")
        .sort({ createdAt: 1 });

      const data = trans.map((tran) => {
        const obj = tran.toObject();
        const ticket = obj.ticket as any;

        if (
          !obj.rewardTime ||
          !ticket?.incomePerDay ||
          !obj.startTime ||
          !obj.endTime
        ) {
          return {
            ...obj,
            currentIncome: 0,
            currentIncome5s: 0,
          };
        }

        const currentIncome = calculateTicketIncome({
          rewardTime: obj.rewardTime,
          startTime: obj.startTime,
          endTime: obj.endTime,
          incomePerDay: ticket.incomePerDay,
        });

        const currentIncome5s = ticket.incomePerDay / 17280;

        return {
          ...obj,
          currentIncome,
          currentIncome5s,
        };
      });

      // Gửi trực tiếp về socket hiện tại
      socket.emit("emitOrders", data);
    } catch (error) {
      console.error("❌ getOrders socket error:", error);
      socket.emit("emitOrders", { error: "Server error" });
    }
  });

  socket.on("getUnreadCount", async ({ userId }) => {
    try {
      const count = await ChatModel.countDocuments({
        readBy: { $ne: userId },
      });
  
      socket.emit("unreadCount", count);
    } catch (error) {
      console.error("❌ getUnreadCount error:", error);
      socket.emit("errorMessage", { message: "Lấy số tin chưa đọc thất bại" });
    }
  });

  // Xử lý gửi tin nhắn chat chung toàn app
  socket.on(
    "sendMessage",
    async ({
      sender,
      content,
      urlImage,
    }: {
      sender: string;
      content?: string;
      urlImage?: string;
    }) => {
      try {
        // CHỐNG SPAM trước để không lưu message không hợp lệ
        const now = Date.now();
        const lastTime = messageCooldown[sender] || 0;
        const cooldown = 2000; // 2 giây cooldown
        if (now - lastTime < cooldown) {
          return socket.emit("errorMessage", {
            message: "Bạn đang gửi quá nhanh, vui lòng chờ một chút.",
          });
        }
        messageCooldown[sender] = now;
  
        // Lưu tin nhắn user vào DB
        const newChatRaw = await ChatModel.create({
          sender: sender,
          content,
          urlImage,
          readBy: [sender],
          status: true,
        });
  
        const newChat = await newChatRaw.populate("sender", "phone farmVip userId");
  
        // Gửi tin nhắn đến tất cả user
        users.forEach(async ({ socketId, userId }) => {
          socket.to(socketId).emit("newMessage", newChat);
  
          // Tính số tin nhắn chưa đọc của user này
          const countUnread = await ChatModel.countDocuments({
            readBy: { $ne: userId },
          });
  
          // Gửi số chưa đọc cho user này
          socket.to(socketId).emit("unreadCount", countUnread);
        });
  
        // Gửi tin nhắn lại cho sender luôn (phòng sender không nhận qua broadcast)
        socket.emit("newMessage", newChat);
  
        // Gửi luôn số chưa đọc cho sender
        const countUnreadSender = await ChatModel.countDocuments({
          readBy: { $ne: sender },
        });
        socket.emit("unreadCount", countUnreadSender);
  
        // Bot trả lời nếu có keyword
        const botReply = getReply(content || "");
        if (botReply) {
          const botId = new Types.ObjectId("000000000000000000000000");
          const botMessageRaw = await ChatModel.create({
            sender: botId,
            content: botReply,
            readBy: [botId],
            status: true,
          });
  
          const botMessage = {
            ...botMessageRaw.toObject(),
            sender: null
          };
  
          users.forEach(async ({ socketId, userId }) => {
            socket.to(socketId).emit("newMessage", botMessage);
  
            const countUnreadBot = await ChatModel.countDocuments({
              readBy: { $ne: userId },
            });
  
            socket.to(socketId).emit("unreadCount", countUnreadBot);
          });
  
          socket.emit("newMessage", botMessage);
  
          const countUnreadBotSender = await ChatModel.countDocuments({
            readBy: { $ne: sender },
          });
          socket.emit("unreadCount", countUnreadBotSender);
        }
      } catch (error) {
        console.error("❌ sendMessage error:", error);
        socket.emit("errorMessage", { message: "Chat gửi thất bại" });
      }
    }
  );
  

  socket.on('getAllMessage', async ({userId}) => {
    try {
      if (!userId) {
       console.log('====================================');
       console.log(11111);
       console.log('====================================');
      }
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 10);

    await ChatModel.updateMany(
      {
        readBy: { $ne: userId },
      },
      {
        $addToSet: { readBy: userId },
      }
    );
    
    const messages = await ChatModel.find({
      createdAt: { $gte: twoDaysAgo }
    })
    .populate("sender", "phone farmVip userId")
    .sort({ createdAt: 1 })
    .lean();
  
    socket.emit("loadOldMessages", messages);
    } catch (error) {
      console.error("❌ getAllMessage error:", error);
      socket.emit("errorMessage", { message: "Không thể tải tin nhắn" });
    }
  });
  
  
  // User đánh dấu đã đọc tin nhắn (có thể giữ hoặc bỏ)
  socket.on(
    "readMessage",
    async ({ messageId, userId }: { messageId: string; userId: string }) => {
      try {
        const msg = await ChatModel.findById(messageId);
        if (!msg) return;
  
        const userObjectId = new Types.ObjectId(userId);
  
        // Kiểm tra nếu chưa có userId trong readBy
        const isRead = msg.readBy.some((id) => id.equals(userObjectId));
        if (!isRead) {
          msg.readBy.push(userObjectId);
          await msg.save();
          socket.emit("messageReadUpdate", { messageId, userId });
        }
      } catch (error) {
        console.error("❌ readMessage error:", error);
      }
    }
  );

  // Dọn dẹp khi socket disconnect
  socket.on("disconnect", () => {
    const index = users.findIndex((u) => u.socketId === socket.id);
    if (index !== -1) {
      console.log("🚫 User disconnected:", users[index].userId);
      users.splice(index, 1);
    }
  });
};

export { SocketServer, users };
