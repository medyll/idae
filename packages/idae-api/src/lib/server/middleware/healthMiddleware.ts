import type { Request, Response, NextFunction } from "express";


/**
 * Endpoint de healthcheck (GET /health)
 * Retourne l'état de santé de l'API (uptime, timestamp)
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
export function healthHandler(req: Request, res: Response) {
  res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: Date.now() });
}

/**
 * Endpoint de readiness (GET /readiness)
 * Peut vérifier la DB, le cache, etc. (ici toujours prêt)
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
export function readinessHandler(req: Request, res: Response) {
  // In a real app, check DB, cache, etc.
  res.status(200).json({ ready: true, timestamp: Date.now() });
}
