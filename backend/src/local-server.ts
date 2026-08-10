import { createApp } from "./create-app.js";
import { getRuntimeConfig } from "./config.js";

const config = getRuntimeConfig();
const app = createApp();

app.listen(config.port, () => {
  console.info(`VoxForge backend listening on http://localhost:${config.port}`);
});
