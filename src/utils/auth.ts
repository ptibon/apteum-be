import jwt from "jsonwebtoken";
import { ITokenResource } from "../types/Token";

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Generate a JWT token
export const generateToken = (email: string, reportId: number): string => {
  return jwt.sign({ email, reportId }, JWT_SECRET, { expiresIn: "15m" });
};

// Verify and decode a JWT token
export const verifyToken = (token: string): ITokenResource | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ITokenResource;
    return decoded;
  } catch (err) {
    return null;
  }
};
