import { Request, Response } from "express";
import path from "path";
import fs from "fs";

// Serve Swagger UI static HTML (bundled, minimal, no CDN dependency)
export function swaggerUiHandler(req: Request, res: Response) {
  const htmlPath = path.join(__dirname, "../../openApi/swagger-ui.html");
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send("Swagger UI not found");
  }
}

// Serve Redoc static HTML (bundled, minimal, no CDN dependency)
export function redocHandler(req: Request, res: Response) {
  const htmlPath = path.join(__dirname, "../../openApi/redoc.html");
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send("Redoc not found");
  }
}
