import TelegramBot from "node-telegram-bot-api";
import { botToken, chatID, groupChatID } from "../config";
import fs from "fs";
import path from "path";
import { keywordReplies } from "../constants/keyword";

// Khởi tạo bot và xử lý lỗi nếu token không hợp lệ
let bot: TelegramBot | null = null;

interface SendGroupMessageOptions {
  message: string;
  imagePath?: string; // đường dẫn local
  imageUrl?: string; // hoặc ảnh từ internet
}

// Danh sách từ khóa & phản hồi


export function getReply(text: string): string | null {
  const lowered = text.toLowerCase();

  for (const item of keywordReplies) {
    for (const keyword of item.keywords) {
      if (lowered.includes(keyword.toLowerCase())) {
        return item.reply;
      }
    }
  }

  return null;
}


// Hàm escape ký tự đặc biệt trong regex từ chuỗi keyword
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

try {
  if (!botToken) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is not defined in environment variables"
    );
  }

  bot = new TelegramBot(botToken, { polling: true });
} catch (error) {
  console.error("Failed to initialize Telegram Bot:", error);
}

export function sendMessageToMe(message: string) {
  if (bot) {
    return bot.sendMessage(chatID, message);
  } else {
    console.error("Telegram bot is not initialized.");
  }
}

export async function sendMessageToGroup({
  message,
  imagePath,
  imageUrl,
}: SendGroupMessageOptions): Promise<void> {
  if (!bot) {
    console.error("Telegram bot is not initialized.");
    return;
  }

  try {
    // Gửi ảnh từ local nếu có và tồn tại
    if (imagePath && fs.existsSync(imagePath)) {
      const stream = fs.createReadStream(imagePath);
      await bot.sendPhoto(groupChatID, stream, {
        caption: message,
        parse_mode: "Markdown",
      });
      return;
    }

    // Gửi ảnh từ URL nếu có
    if (imageUrl) {
      await bot.sendPhoto(groupChatID, imageUrl, {
        caption: message,
        parse_mode: "Markdown",
      });
      return;
    }

    // Nếu không có ảnh thì gửi tin nhắn thường
    await bot.sendMessage(groupChatID, message, {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("❌ Failed to send message to group:", error);
  }
}

export function registerMessageHandler() {
  if (bot) {
    bot.on("message", async (msg) => {
      const text = msg.text || "";

      const reply = getReply(text);

      if (reply) {
        // Gửi phản hồi vào groupChatID (nhóm)
        await sendMessageToGroup({ message: reply });
      } else {
        console.log(`🤖 Không tìm thấy keyword trong: "${text}"`);
      }
    });
  } else {
    console.error("Telegram bot is not initialized.");
  }

  console.log("✅ Message handler registered");
}

export default bot;
