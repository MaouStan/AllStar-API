import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// App Variables
dotenv.config();

// Generate JWT for users.
export const generateJWT = function (
  payload: object = {},
  options: object = {}
): string {
  const privateKey: any = process.env.ACCESS_TOKEN_PUBLIC_KEY;
  const defaultOptions: object = {
    expiresIn: '2h',
  };
  return jwt.sign(payload, privateKey, Object.assign(defaultOptions, options));
};

// To verify the JWT token.
export const verifyToken = function (token: string): Object {
  try {
    const publicKey: any = process.env.ACCESS_TOKEN_PUBLIC_KEY;
    return { valid: true, decoded: jwt.verify(token, publicKey) };
  } catch (e) {
    return { valid: false, error: JSON.stringify(e) };
  }
};
