import { consola } from "consola";
import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import qrcode from "qrcode";
import { fileURLToPath } from "url";
import pkg from "whatsapp-web.js";
import imageRouter from "./api/image.api.js";
import { configCron } from "./cron/config.cron.js";
const { Client, LocalAuth } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "sessions",
  }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // Desactiva el sandbox
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
});

client.on("qr", (qr) => {
  try {
    consola.success("QR RECEIVED", qr);
    const dir = path.join(__dirname, "..", "public", "qr_codes");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const qrPath = path.join(dir, "whatsapp_qr.png");

    qrcode.toFile(qrPath, qr, (err) => {
      if (err) {
        console.log(err);
      }
    });

    consola.success("El QR ha sido creado!");
  } catch (error) {
    consola.error(JSON.stringify(error));
  }
});

client.on("ready", async () => {
  consola.success("Client is ready!");
});

// client.on("message", async (message) => {

// });

client.initialize();

app.set("whatsappClient", client);

app.use("/api", imageRouter);

configCron(client);

app.listen(4000, () => {
  consola.start("Server is running on port 4000");
});
