import { mockReports } from "../mocks/reports";
import { mockUsers } from "../mocks/users";
import { IReportResource } from "../types/Report";
import { generateToken, verifyToken } from "../utils/auth";

/**
 * @description Generate token that will be used as signed url link for file download
 * @param email user email
 * @param reportId
 * @returns token
 */
export const generateDownloadLink = (
  email: string,
  reportId: number
): string => {
  const user = mockUsers[email];
  if (!user || !user.reports.includes(reportId)) {
    throw Error("Unauthorized access to this report.");
  }

  const token = generateToken(email, reportId);

  return token;
};

/**
 * @description Validate token and get report
 * @param token
 * @returns validated report
 */
export const getReportFromToken = (token: string): IReportResource | Error => {
  const decoded = verifyToken(token);

  if (!decoded) {
    return new Error("Invalid or expired link.");
  }

  const { email, reportId } = decoded;
  const user = mockUsers[email];

  if (!user || !user.reports.includes(reportId)) {
    return new Error("You do not have permission to access this report.");
  }

  const report = mockReports.find((report) => report.id === reportId);

  if (!report) {
    return new Error("Report not found.");
  }

  return report;
};
