import { model, Schema, Types } from "mongoose";
import Role from "./Role";

export const DOCUMENT_NAME = "User";
export const COLLECTION_NAME = "users";

export default interface User {
  _id: Types.ObjectId;
  name?: string;
  userId: number;
  userName?: string;
  inviteUser?: [Types.ObjectId];
  profilePicUrl?: string;
  currentUnlockedIndex:number
  bankList: [
    {
      nameBank: string;
      holderName: string;
      numberBank: string;
    }
  ];
  registerIp: string;
  phone?: string;
  password?: string;
  payment_password?: string;
  realBalance: number;
  coinBalance?: number;
  vip?: number;
  farmVip?: number;
  drawNum: number;
  mineNum: number;
  duckSticker: number;
  inviteCode?: string;
  refCode: string;
  roles: Role[];
  verified?: boolean;
  isAccountForAdmin?:boolean
  checkInToday?: number;
  agencyReward?:number;
  isBlackList?: boolean;
  isLockChat?:Boolean;
  uuid?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    currentUnlockedIndex:{
      type: Schema.Types.Number,
      default: 1,
    },
    phone: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    uuid: {
      type: Schema.Types.String,
    },
    vip: {
      type: Schema.Types.Number,
      default: 0,
    },
    farmVip: {
      type: Schema.Types.Number,
      default: 0,
    },
    drawNum: {
      type: Schema.Types.Number,
      default: 1,
    },
    agencyReward: {
      type: Schema.Types.Number,
      default: 0,
    },
    mineNum: {
      type: Schema.Types.Number,
      default: 0,
    },
    duckSticker: {
      type: Schema.Types.Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.Number,
      default: 2000,
    },
    userName: {
      type: Schema.Types.String,
    },
    realBalance: {
      type: Schema.Types.Number,
      default: 0,
    },
    coinBalance: {
      type: Schema.Types.Number,
      default: 0,
    },
    bankList: {
      type: [
        {
          nameBank: { type: String, required: true },
          holderName: { type: String, required: true },
          numberBank: { type: String, required: true },
        },
      ],
      default: [],
    },
    checkInToday: {
      type: Schema.Types.Number,
      default: 0,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    refCode: {
      type: Schema.Types.String,
    },
    isBlackList: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isLockChat: {
      type: Schema.Types.Boolean,
      default: true,
    },
    isAccountForAdmin: {
      type: Schema.Types.Boolean,
      default: false,
    },
    inviteCode: {
      type: Schema.Types.String,
    },
    payment_password: {
      type: Schema.Types.String,
      select: true,
      required: true,
    },
    registerIp: {
      type: Schema.Types.String,
      index: true, // Tùy chọn: giúp truy vấn nhanh hơn nếu bạn lọc theo IP thường xuyên
    },
    inviteUser: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
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

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
