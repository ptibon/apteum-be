import { Response } from "express";

export const handleResponse = (
  res: Response,
  statusCode: number,
  data: {} | [] | null = null
): Response => {
  const response = {
    ...(data !== null && data),
  };

  return res.status(statusCode).json(response);
};
