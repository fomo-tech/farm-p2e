import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Ticket";
export const COLLECTION_NAME = "tickets";

export default interface NFTTicket {
  _id: Types.ObjectId;
  vip: number;
  price: number;
  name: string;
  sale_price?: number;
  description: string;
  urlImage: string;
  desImage: string;
  inventory: number;
  incomePerDay: number;
  earningDay: number;
  soldOutAt: Date;
  status: boolean;
  order: number;
}

const schema = new Schema<NFTTicket>(
  {
    price: {
      type: Schema.Types.Number,
      required: true,
    },
    earningDay: {
      type: Schema.Types.Number,
      default: 1,
    },
    desImage: {
      type: Schema.Types.String,
      required: true,
    },
    sale_price: {
      type: Schema.Types.Number,
    },
    vip: {
      type: Schema.Types.Number,
      required: true,
    },
    order: {
      type: Schema.Types.Number,
      default: 0,
    },
    urlImage: {
      type: Schema.Types.String,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
    },
    inventory: {
      type: Schema.Types.Number,
      default: 0,
    },
    incomePerDay: {
      type: Schema.Types.Number,
      required: true,
    },
    soldOutAt: {
      type: Schema.Types.Date,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const NFTTicketModel = model<NFTTicket>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
