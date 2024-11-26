import { Request, Response } from "express";
import {
  generateDownloadLink,
  getReportFromToken,
} from "../services/report.service";
import { handleResponse } from "../utils/response";
import { IReportLinkResponse } from "../types/Report";
import { IErrorResponse } from "../types/Common";
import { mockReports } from "../mocks/reports";
import { mockUsers } from "../mocks/users";

export const getReports = (req: Request, res: Response) => {
  const { email } = req.params;

  const userReports = mockUsers[email].reports;
  const reports = mockReports.filter((report) =>
    userReports.includes(report.id)
  );

  handleResponse(res, 200, { reports });
};

/**
 * @description Generate a secured link of the file
 * @param req users data
 * @param res
 */
export const generateLinkController = (req: Request, res: Response) => {
  const { email, reportId } = req.body;

  let data: IReportLinkResponse | IErrorResponse;
  let status = 200;

  try {
    const result = generateDownloadLink(email, reportId);

    const downloadLink = `${req.protocol}://${req.get(
      "host"
    )}/reports/download/${result}`;

    data = { downloadLink };
  } catch (error) {
    status = 403;
    data = { error: (error as Error).message };
  }

  handleResponse(res, status, data);
};

/**
 * @description Download a verified and secured file report
 * @param req
 * @param res
 * @returns
 */
export const downloadReportController = (req: Request, res: Response): void => {
  const { token } = req.params;

  const report = getReportFromToken(token);

  if (report instanceof Error) {
    handleResponse(res, 400, { error: report.message });
    return;
  }

  // Send the PDF file securely
  res.download(report.path, report.name, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      handleResponse(res, 500, { error: "Failed to download the file." });
    }
  });
};
