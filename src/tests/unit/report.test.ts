import {
  generateLinkController,
  downloadReportController,
} from "../../controllers/report.controller";
import { mockReports } from "../../mocks/reports";
import { Request, Response } from "express";
import { generateToken } from "../../utils/auth";

import {
  generateDownloadLink,
  getReportFromToken,
} from "../../services/report.service";
import { isError } from "../../utils/type";
import { mockUsers } from "../../mocks/users";

jest.mock("../../mocks/reports");

describe("Report Service", () => {
  beforeEach(() => {
    // Reset mock data before each test
    jest.clearAllMocks();
  });

  describe("generateDownloadLink", () => {
    it("should generate a token for valid user and report", () => {
      // Mock data for valid user and report
      const email = "user1@example.com";
      const reportId = 101;

      mockUsers[email] = { id: 1, name: "User One", reports: [101] }; // Mock user has report 101

      const result = generateDownloadLink(email, reportId);
      expect(typeof result).toBe("string"); // Token should be a string
    });

    it("should return an error for invalid user or report", () => {
      const email = "user1@example.com";
      const reportId = 999; // Invalid report

      expect(() => {
        generateDownloadLink(email, reportId);
      }).toThrow("Unauthorized access to this report.");
    });
  });

  describe("getReportFromToken", () => {
    it("should return the correct report for valid token", () => {
      // Create a valid token
      const email = "user1@example.com";
      const reportId = 101;
      const token = generateToken(email, reportId);

      mockReports.push({
        id: reportId,
        name: "InspectionReport.pdf",
        path: "public/assets/reports/11262024.pdf",
      }); // Mock report

      const report = mockReports.find((r) => r.id === reportId);

      const result = getReportFromToken(token);
      expect(result).toEqual(report);
    });

    it("should return an error for invalid or expired token", () => {
      const token = "invalid-token";

      const result = getReportFromToken(token);

      if (isError(result)) {
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe("Invalid or expired link.");
      }
    });

    it("should return an error if the user does not have access to the report", () => {
      const email = "user1@example.com";
      const reportId = 999; // Invalid report ID
      const token = generateToken(email, reportId);

      const result = getReportFromToken(token);

      if (isError(result)) {
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe(
          "You do not have permission to access this report."
        );
      }
    });
  });
});

describe("Report Controller", () => {
  describe("generateLinkController", () => {
    it("should return a valid download link for valid user and report", () => {
      const req = {
        body: {
          email: "user1@example.com",
          reportId: 101,
        },
        protocol: "http",
        get: jest.fn().mockReturnValue(`localhost:${process.env.PORT}`),
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockUsers["user1@example.com"] = {
        id: 1,
        name: "User One",
        reports: [101],
      };

      generateLinkController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          downloadLink: expect.any(String),
        })
      );
    });

    it("should return an error if the user does not own the report", () => {
      const req = {
        body: {
          email: "user1@example.com",
          reportId: 999, // Invalid report ID
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      generateLinkController(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unauthorized access to this report.",
      });
    });
  });

  describe("downloadReportController", () => {
    it("should download the report for a valid token", () => {
      const reportId = 101;
      const token = generateToken("user1@example.com", reportId);

      const req = {
        params: { token },
      } as unknown as Request;

      const res = {
        download: jest.fn(),
      } as unknown as Response;

      mockReports.push({
        id: reportId,
        name: "InspectionReport.pdf",
        path: "public/assets/reports/11262024.pdf",
      });

      downloadReportController(req, res);

      expect(res.download).toHaveBeenCalledWith(
        "public/assets/reports/11262024.pdf",
        "InspectionReport.pdf",
        expect.any(Function)
      );
    });

    it("should return an error if the token is invalid or expired", () => {
      const req = {
        params: { token: "invalid-token" },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      downloadReportController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid or expired link.",
      });
    });
  });
});
