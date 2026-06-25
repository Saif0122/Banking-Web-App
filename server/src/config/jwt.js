import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_jwt_secret_please_change_in_env',
  expire: process.env.JWT_EXPIRE || '1d'
};
