import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Event";
export const COLLECTION_NAME = "envents";

const schema = new Schema(
  {
    event_type: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    timeEnd: {
      type: Schema.Types.Number,
      default: 0,
    },
    timeStart: {
      type: Schema.Types.Number,
      default: 0,
    },
    isFarm: {
      type: Schema.Types.Boolean,
      default: false,
    },
    minValue: {
      type: Schema.Types.Number,
      default: 0,
    },
    maxValue: {
      type: Schema.Types.Number,
      default: 0,
    },
    value: {
      type: Schema.Types.Number,
      default: 0,
    },
    quantity: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const EventModel = model(DOCUMENT_NAME, schema, COLLECTION_NAME);
