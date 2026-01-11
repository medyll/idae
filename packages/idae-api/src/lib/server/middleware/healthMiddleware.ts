import { Request, Response, NextFunction } from "express";

export function healthHandler(req: Request, res: Response) {
  res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
}

export function readinessHandler(req: Request, res: Response) {
  // In a real app, check DB, cache, etc.
  res.status(200).json({ ready: true, timestamp: Date.now() });
}
