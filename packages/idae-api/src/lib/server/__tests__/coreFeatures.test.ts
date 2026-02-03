import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { idaeApi } from "$lib/server/IdaeApi.js";
import { HttpError } from "$lib/server/errors/HttpError.js";
import request from "supertest";

describe("IdaeApi Core Features", () => {
  beforeEach(() => {
    // Ensure we start with a clean singleton instance for each test
    (idaeApi.constructor as any).resetInstance?.() || (idaeApi as any).constructor.resetInstance(); 
  });

  afterEach(async () => {
    const instance = (idaeApi as any).constructor.getInstance();
    if (instance.state === "running") {
      await instance.stop();
    }
  });

  describe("Server Lifecycle & Singleton", () => {
    it("should start and stop the server", async () => {
      const instance = (idaeApi as any).constructor.getInstance();
      instance.setOptions({ port: 3001, useMemoryDb: true });
      
      expect(instance.state).toBe("stopped");
      await instance.start();
      expect(instance.state).toBe("running");
      
      await instance.stop();
      // Small delay for server closure if needed, but stop usually handles it
      expect(instance.state).toBe("stopped");
    });

    it("should reset the instance correctly", () => {
      const instance1 = (idaeApi as any).constructor.getInstance();
      (idaeApi as any).constructor.resetInstance();
      const instance2 = (idaeApi as any).constructor.getInstance();
      expect(instance1).not.toBe(instance2);
    });
  });

  describe("Configuration Validation", () => {
    it("should throw error for invalid port type", () => {
      const instance = (idaeApi as any).constructor.getInstance();
      expect(() => {
        instance.setOptions({ port: "invalid" as any });
      }).toThrow(/Invalid configuration/);
    });

    it("should throw error if session is running and trying to set options", async () => {
      const instance = (idaeApi as any).constructor.getInstance();
      instance.setOptions({ port: 3002, useMemoryDb: true });
      await instance.start();
      
      expect(() => {
        instance.setOptions({ port: 3003 });
      }).toThrow("Cannot change options while server is running");
      
      await instance.stop();
    });
  });

  describe("Centralized Error Handling", () => {
    it("should handle HttpError and return correct status", async () => {
      const instance = (idaeApi as any).constructor.getInstance();
      instance.setOptions({ port: 3004, useMemoryDb: true });
      
      // Add a test route that throws HttpError
      instance.router.addRoute({
        method: "get",
        path: "/test-error",
        handler: async () => {
          throw new HttpError(418, "I'm a teapot");
        }
      });
      
      await instance.start();
      
      const response = await request(instance.app).get("/test-error");
      expect(response.status).toBe(418);
      expect(response.body).toEqual({ error: "I'm a teapot" });
      
      await instance.stop();
    });

    it("should handle generic errors as 500 Internal Server Error", async () => {
      const instance = (idaeApi as any).constructor.getInstance();
      instance.setOptions({ port: 3005, useMemoryDb: true });
      
      instance.router.addRoute({
        method: "get",
        path: "/test-500",
        handler: async () => {
          throw new Error("Sensitive internal message");
        }
      });
      
      await instance.start();
      
      const response = await request(instance.app).get("/test-500");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
      
      await instance.stop();
    });
  });

  describe("Standard Endpoints", () => {
    it("should respond to health check", async () => {
      const instance = (idaeApi as any).constructor.getInstance();
      instance.setOptions({ port: 3006, useMemoryDb: true });
      await instance.start();
      
      const response = await request(instance.app).get("/health");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      
      await instance.stop();
    });
  });
});
