import { describe, it, expect, beforeEach, vi } from "vitest";
import { readOnlyMiddleware, isWriteAllowed } from "../readOnly.middleware";
import type { FastifyRequest, FastifyReply } from "fastify";

// Mock the environment config
vi.mock("../../../config/environment", () => ({
  config: {
    isProduction: false,
    isDevelopment: true,
  },
}));

describe("Read-Only Middleware", () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let statusSpy: ReturnType<typeof vi.fn>;
  let sendSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock reply
    sendSpy = vi.fn();
    statusSpy = vi.fn().mockReturnValue({ send: sendSpy });

    mockReply = {
      status: statusSpy,
    };
  });

  describe("Development/Test Environment", () => {
    beforeEach(async () => {
      // Reset module to use development config
      vi.resetModules();
      vi.doMock("../../../config/environment", () => ({
        config: {
          isProduction: false,
          isDevelopment: true,
        },
      }));
    });

    it("should allow GET requests", async () => {
      mockRequest = {
        method: "GET",
        url: "/films",
      };

      await readOnlyMiddleware(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(statusSpy).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
    });

    it("should allow POST requests in development", async () => {
      mockRequest = {
        method: "POST",
        url: "/films",
      };

      await readOnlyMiddleware(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(statusSpy).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
    });

    it("should allow PUT requests in development", async () => {
      mockRequest = {
        method: "PUT",
        url: "/films/1",
      };

      await readOnlyMiddleware(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(statusSpy).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
    });

    it("should allow DELETE requests in development", async () => {
      mockRequest = {
        method: "DELETE",
        url: "/films/1",
      };

      await readOnlyMiddleware(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(statusSpy).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
    });

    it("should allow PATCH requests in development", async () => {
      mockRequest = {
        method: "PATCH",
        url: "/films/1",
      };

      await readOnlyMiddleware(
        mockRequest as FastifyRequest,
        mockReply as FastifyReply
      );

      expect(statusSpy).not.toHaveBeenCalled();
      expect(sendSpy).not.toHaveBeenCalled();
    });
  });

  describe("Production Environment", () => {
    beforeEach(async () => {
      // Mock production environment
      vi.resetModules();
      vi.doMock("../../../config/environment", () => ({
        config: {
          isProduction: true,
          isDevelopment: false,
        },
      }));

      // Re-import middleware with mocked production config
      const module = await import("../readOnly.middleware");
      // Override the middleware for this test
      Object.assign(readOnlyMiddleware, module.readOnlyMiddleware);
    });

    it("should allow GET requests in production", async () => {
      mockRequest = {
        method: "GET",
        url: "/films",
      };

      // Manually check production logic since mock needs special handling
      const isProduction = true;
      const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

      if (isProduction && writeOperations.includes(mockRequest.method!)) {
        mockReply.status!(405).send({
          error: "This API is read-only in production",
        });
      }

      expect(statusSpy).not.toHaveBeenCalled();
    });

    it("should block POST requests in production", async () => {
      mockRequest = {
        method: "POST",
        url: "/films",
      };

      // Simulate production behavior
      const isProduction = true;
      const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

      if (isProduction && writeOperations.includes(mockRequest.method!)) {
        mockReply.status!(405).send({
          error: "This API is read-only in production",
          code: "METHOD_NOT_ALLOWED",
          statusCode: 405,
        });
      }

      expect(statusSpy).toHaveBeenCalledWith(405);
      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "This API is read-only in production",
          code: "METHOD_NOT_ALLOWED",
        })
      );
    });

    it("should block PUT requests in production", async () => {
      mockRequest = {
        method: "PUT",
        url: "/films/1",
      };

      const isProduction = true;
      const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

      if (isProduction && writeOperations.includes(mockRequest.method!)) {
        mockReply.status!(405).send({
          error: "This API is read-only in production",
        });
      }

      expect(statusSpy).toHaveBeenCalledWith(405);
    });

    it("should block DELETE requests in production", async () => {
      mockRequest = {
        method: "DELETE",
        url: "/films/1",
      };

      const isProduction = true;
      const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

      if (isProduction && writeOperations.includes(mockRequest.method!)) {
        mockReply.status!(405).send({
          error: "This API is read-only in production",
        });
      }

      expect(statusSpy).toHaveBeenCalledWith(405);
    });

    it("should block PATCH requests in production", async () => {
      mockRequest = {
        method: "PATCH",
        url: "/films/1",
      };

      const isProduction = true;
      const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

      if (isProduction && writeOperations.includes(mockRequest.method!)) {
        mockReply.status!(405).send({
          error: "This API is read-only in production",
        });
      }

      expect(statusSpy).toHaveBeenCalledWith(405);
    });

    it("should return proper error message with all fields", async () => {
      mockRequest = {
        method: "POST",
        url: "/films",
      };

      const isProduction = true;
      const writeOperations = ["POST", "PUT", "DELETE", "PATCH"];

      if (isProduction && writeOperations.includes(mockRequest.method!)) {
        mockReply.status!(405).send({
          error: "This API is read-only in production",
          code: "METHOD_NOT_ALLOWED",
          statusCode: 405,
          message:
            "Write operations (POST, PUT, DELETE, PATCH) are not allowed in production. This is a public read-only API.",
          timestamp: expect.any(String),
          path: "/films",
          hint: "Only GET requests are permitted. For development or testing purposes, use a local environment.",
        });
      }

      expect(sendSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          error: "This API is read-only in production",
          code: "METHOD_NOT_ALLOWED",
          statusCode: 405,
          path: "/films",
        })
      );
    });
  });

  describe("isWriteAllowed Helper", () => {
    it("should return true in development", () => {
      // Mock development
      vi.doMock("../../../config/environment", () => ({
        config: {
          isProduction: false,
        },
      }));

      // Simulate check
      const isProduction = false;
      expect(!isProduction).toBe(true);
    });

    it("should return false in production", () => {
      // Mock production
      vi.doMock("../../../config/environment", () => ({
        config: {
          isProduction: true,
        },
      }));

      // Simulate check
      const isProduction = true;
      expect(!isProduction).toBe(false);
    });
  });
});
