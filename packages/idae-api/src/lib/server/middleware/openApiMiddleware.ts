import { Request, Response } from "express";
import fs from "fs";
import path from "path";

// Serve the OpenAPI spec as JSON
export function openApiJsonHandler(req: Request, res: Response) {
  const openApiPath = path.join(__dirname, "../../openApi/openapi-base.yaml");
  try {
    const yaml = fs.readFileSync(openApiPath, "utf8");
    // Optionally, convert YAML to JSON (require 'js-yaml')
    const jsYaml = require("js-yaml");
    const openApiJson = jsYaml.load(yaml);
    res.json(openApiJson);
  } catch (err) {
    res.status(500).json({ error: "Failed to load OpenAPI spec" });
  }
}
