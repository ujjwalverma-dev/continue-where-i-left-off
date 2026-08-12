import type { NextApiRequest, NextApiResponse } from "next";
import { createApp } from "../../../.api-dist/backend/src/create-app.js";

export const config = {
  api: {
    // Express owns JSON and multipart parsing so the current request behavior,
    // including Multer's upload limits and errors, is retained.
    bodyParser: false,
    externalResolver: true,
  },
};

const app = createApp();

export default function handler(request: NextApiRequest, response: NextApiResponse): void {
  // next.config.ts maps the public /health URL here. Give the unchanged Express
  // application the original request path it expects.
  if (request.url === "/api/__health") {
    request.url = "/health";
  }

  app(request, response);
}
