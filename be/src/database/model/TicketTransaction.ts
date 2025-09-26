import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "TicketTransaction";
export const COLLECTION_NAME = "ticketTransactions";

const schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    transaction_type: { type: Schema.Types.String, required: true },
    transaction_status: { type: Schema.Types.String, required: true },
    value: { type: Schema.Types.Number, required: true },
    currentBalanceUser: { type: Schema.Types.Number, required: true },
    fiat_amount: { type: Schema.Types.Number },
    ticket: { type: Schema.Types.ObjectId, required: true, ref: "Ticket" },
    note: { type: Schema.Types.String },
    rewardTime: { type: Schema.Types.Number },
    startTime: { type: Schema.Types.Number },
    endTime: { type: Schema.Types.Number },
    totalEarn: { type: Schema.Types.Number, default: 0 },
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

export const TicketTransactionModel = model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
