import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Chat";
export const COLLECTION_NAME = "chats";


const schema = new Schema(
  {
    sender:{ type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    content: {
      type: Schema.Types.String,
      required: false, // Có thể là ảnh không có content
    },
    urlImage: {
      type: Schema.Types.String,
      required: false,
    },
    readBy: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    }
  },
  {
    timestamps:true,
    versionKey: false,
  }
);

export const ChatModel = model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
