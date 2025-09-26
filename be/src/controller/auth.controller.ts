import { PublicRequest, RoleRequest } from "../types/app-request";
import asyncHandler from "../helpers/asyncHandler";
import User, { UserModel } from "../database/model/User";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
import messages from "../messages/auth";
import crypto from "crypto";
import Role, { RoleModel } from "../database/model/Role";
import { generateCode } from "../helpers/handle";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import { createTokens } from "../auth/authUtils";
import _ from "lodash";
import { sendTranslatedError } from "../helpers/response";
import { TicketTransactionModel } from "../database/model/TicketTransaction";
import { TRANSACTION_TYPE_BUY_TICKET } from "../constants/define";
import axios from "axios";
import { getUserTransactionSummary } from "./profile.controller";

type LangType = "en" | "vi";

interface IRequestBody {
  phone: string;
  password: string;
  payment_password: string;
  inviteCode?: string;
}

interface IRequestBodyLogin {
  phone: string;
  password: string;
}

export const verifyRecaptcha = async (token: string): Promise<boolean> => {
  try {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) throw new Error("Missing Turnstile secret key");

    const res = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret,
        response: token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return res.data.success === true;
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return false;
  }
};

// export const verifyRecaptcha = async (token: string) => {
//   const secretKey = process.env.RECAPTCHA_SECRET_KEY;
//   const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
//   const res = await axios.post(url);
//   return res.data.success && res.data.score >= 0.5;
// };

export default {
  loginAdmin: asyncHandler(async (req: PublicRequest, res) => {
    const { phone, password } = req.body;
    const user = await UserModel.findOne({ phone }).populate("roles");
    if (!user)
      return new BadRequestResponse("Không tìm thấy tài khoản").send(res);

    if (user.password !== password)
      return new BadRequestResponse("Mật khẩu không đúng").send(res);

    const roleAdmin = user.roles.find((i: Role) => i.code === "ADMIN");

    if (!roleAdmin)
      return new BadRequestResponse(
        "Vui lòng đăng nhập đúng tài khoản ADMIN"
      ).send(res);

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    return new SuccessResponse("Đăng nhập thành công", {
      user: _.omit(user.toObject(), ["password"]),
      tokens,
    }).send(res);
  }),

  register: asyncHandler(async (req: RoleRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";
    const { phone, password, payment_password, inviteCode, recaptchaToken } =
      req.body;

    const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidCaptcha) {
      return new BadRequestResponse("Invalid CAPTCHA").send(res);
    }

    // Lấy IP client: ưu tiên IPv4, nếu không có thì dùng IPv6

    let rawIpList = req.headers["x-forwarded-for"]?.toString().split(",") || [];
    let rawIp =
      rawIpList.find((ip) => ip && !ip.includes(":")) ||
      (rawIpList.length > 0 ? rawIpList[0] : "") ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      "";
    let ip = rawIp.replace(/^::ffff:/, "").trim();
    // if (ip.includes(":")) {
    //   return new BadRequestResponse("IPv6 addresses are not allowed").send(res);
    // }

    // Nếu bạn muốn **chặn hoàn toàn IPv6** có thể thêm đoạn này:
    // if (ip.includes(":")) {
    //   return new BadRequestResponse("IPv6 addresses are not allowed").send(res);
    // }

    // Kiểm tra số tài khoản đã tạo từ IP này
    // const ipCount = await UserModel.countDocuments({ registerIp: ip });
    // if (ipCount > 2) {
    //   return new BadRequestResponse(messages[lang].tooManyAccountsFromIp).send(
    //     res
    //   );
    // }

    // Kiểm tra số tài khoản đã tạo từ deviceId
    const deviceCount = await UserModel.countDocuments({
      uuid: req.headers["deviceid"],
    });
    if (deviceCount > 2) {
      return new BadRequestResponse(messages[lang].tooManyAccountsFromIp).send(
        res
      );
    }

    // Kiểm tra phone đã tồn tại chưa
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return new BadRequestResponse(messages[lang].msg1).send(res);
    }

    // Tạo token, role, userId ...
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    const role = await RoleModel.findOne({ code: "USER" })
      .select("+code")
      .lean();
    if (!role) {
      return sendTranslatedError(res, "Role must be defined", lang);
    }

    const lastUser = await UserModel.findOne().sort({ createdAt: -1 }).lean();
    const userId = lastUser?.userId ? lastUser.userId + 1 : 52654;

    const newUser = new UserModel({
      phone,
      realBalance: 0,
      password,
      userId,
      userName: "User" + userId,
      payment_password,
      inviteCode: inviteCode || "",
      refCode: generateCode(6),
      roles: [role],
      registerIp: ip,
      uuid: req.headers["deviceid"],
    });

    if (inviteCode) {
      const referrer = await UserModel.findOne({ refCode: inviteCode });
      if (!referrer) {
        return new BadRequestResponse(messages[lang].msg2).send(res);
      }

      const updatedInviteUser = Array.isArray(referrer.inviteUser)
        ? [...referrer.inviteUser, newUser._id]
        : [newUser._id];
      await UserModel.findByIdAndUpdate(referrer._id, {
        $set: { inviteUser: updatedInviteUser },
      });
    }

    const keystore = await KeystoreRepo.create(
      newUser,
      accessTokenKey,
      refreshTokenKey
    );
    const tokens = await createTokens(
      newUser,
      keystore.primaryKey,
      keystore.secondaryKey
    );

    await newUser.save();

    return new SuccessResponse(messages[lang].msg3, {
      user: {
        ..._.omit(newUser.toObject(), ["password", "payment_password"]),
        totalWithdrawValue: 0,
        totalbuyTicket: 0,
        totalRewardToday: 0,
        totalDep: 0,
        totalReceiveSalary: 0,
        isCheckinToday: false,
      },
      tokens,
    }).send(res);
  }),

  login: asyncHandler(async (req: RoleRequest, res) => {
    const lang: LangType = (req.headers["lang"] as LangType) || "vi";

    const rawIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      "";

    const ip = rawIp.replace(/^::ffff:/, "");

    const { phone, password, recaptchaToken } = req.body;

    const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
    if (!isValidCaptcha) {
      return new BadRequestResponse("Invalid CAPTCHA").send(res);
    }

    const user = await UserModel.findOne({ phone });

    if (!user) return new BadRequestResponse(messages[lang].msg4).send(res);

    if (!user.status)
      return new BadRequestResponse("Account blocked").send(res);

    const IpOrUuidUsers = await UserModel.find({
      $or: [{ ip }, { uuid: req.headers["deviceid"] }],
    });

    const ticket = await TicketTransactionModel.find({
      user: user._id,
      transaction_type: TRANSACTION_TYPE_BUY_TICKET,
    });

    if (IpOrUuidUsers.length > 3 && ticket.length == 0) {
      return new BadRequestResponse("Too many accounts logged in").send(res);
    }

    if (user.password !== password)
      return new BadRequestResponse(messages[lang].msg5).send(res);

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);

    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    const stats = await getUserTransactionSummary(user._id);

    return new SuccessResponse(messages[lang].msg6, {
      user: {
        ..._.omit(user.toObject(), ["password", "payment_password"]),
        ...stats,
      },
      tokens,
    }).send(res);
  }),
};
