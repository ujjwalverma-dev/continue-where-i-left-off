import { createApp } from "../src/app.js";

// Vercel invokes this exported Express application as a serverless function.
// Do not call app.listen here: src/server.ts remains the local server entrypoint.
const app = createApp();

export default app;
