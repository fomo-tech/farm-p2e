import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Wallet";
export const COLLECTION_NAME = "wallets";

const schema = new Schema(
  {
    address: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    lastBlockNumber:{
      type: Schema.Types.Number,
      default:0
    },
    type: {
      type: Schema.Types.String,
      enum: ['receive', 'master', 'user'],
      default: 'receive',
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    assignedToUser: {
      type: Schema.Types.ObjectId, ref: "User",default:null
    },
    assignedOrderId: {
      type: Schema.Types.String,
      default: null,
    },
    lastUsedAt: {
      type: Schema.Types.Number,
      default: 0,
    },
  
  },
  {
    versionKey: false,
    timestamps:true
  }
);

export const WalletModel = model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
