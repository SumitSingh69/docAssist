import getEnv from "../utils/getEnv.js";

const envConfig = () => ({
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", "mongodb://localhost:27017/imagine"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  JWT_SECRET: getEnv("JWT_SECRET", "secert_jwt"),
  JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "15m") as string,

  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "secert_jwt_refresh"),
  JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "7d") as string,
});
const env = envConfig();
export default env;
