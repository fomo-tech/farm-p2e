import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Config";
export const COLLECTION_NAME = "configs";

const schema = new Schema(
  {
    key: {
      type: Schema.Types.String,
      required: true,
    },
    value: {
      type: Schema.Types.String,
      required: true,
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

export const ConfigModel = model(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
