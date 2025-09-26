export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;
export const timezone = process.env.TZ;
export const domainUpload =
  process.env.DOMAIN_UPLOAD || `http://localhost:${port}/uploads`;

export const db = {
  name: process.env.DB_NAME || "",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "27017",
  user: process.env.DB_USER || "",
  database: process.env.DATABASE_NAME || "invest",
  password: process.env.DB_USER_PWD || "",
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || "5"),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || "10"),
};

export const tokenInfo = {
  accessTokenValidity: parseInt(
    process.env.ACCESS_TOKEN_VALIDITY_SEC || "600000000"
  ),
  refreshTokenValidity: parseInt(
    process.env.REFRESH_TOKEN_VALIDITY_SEC || "600000000"
  ),
  issuer: process.env.TOKEN_ISSUER || "123123",
  audience: process.env.TOKEN_AUDIENCE || "123123",
};
export const USDT_CONTRACT = `${process.env.USDT_CONTRACT_ADDRESS}`

export const corsUrl = process.env.CORS_URL || "*";
export const botToken = process.env.TELEGRAM_BOT_TOKEN as string;
export const chatID = process.env.TELEGRAM_CHAT_ID || "";
export const groupChatID = process.env.GROUP_CHAT_ID || "@richfarmer_offical";
