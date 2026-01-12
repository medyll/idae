import type { Request, Response } from "express";
import path from "path";
import fs from "fs";


/**
 * Sert la page Swagger UI (HTML statique local, sans CDN)
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
export function swaggerUiHandler(req: Request, res: Response) {
  const htmlPath = path.join(__dirname, "../../openApi/swagger-ui.html");
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send("Swagger UI not found");
  }
}

/**
 * Sert la page Redoc (HTML statique local, sans CDN)
 * @param {Request} req - Requête Express
 * @param {Response} res - Réponse Express
 */
export function redocHandler(req: Request, res: Response) {
  const htmlPath = path.join(__dirname, "../../openApi/redoc.html");
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send("Redoc not found");
  }
}
