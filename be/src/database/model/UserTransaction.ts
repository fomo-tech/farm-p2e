import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "UserTransaction";
export const COLLECTION_NAME = "userTransactions";

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    transaction_type: { type: Schema.Types.String, required: true },
    transaction_status: { type: Schema.Types.String, required: true },
    value: { type: Schema.Types.Number, required: true },
    currentBalanceUser: { type: Schema.Types.Number, required: true },
    fiat_amount: { type: Schema.Types.Number },
    paymentMethod: { type: Schema.Types.String },
    walletDeposit: { type: Schema.Types.String },
    note: { type: Schema.Types.String },
    hash: { type: Schema.Types.String },
    reason:{ type: Schema.Types.String },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const UserTransactionModel = model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
