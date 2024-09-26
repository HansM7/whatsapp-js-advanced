import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Definir __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageRouter = express.Router();

imageRouter.get("/image", async (req, res) => {
  const imagePath = path.join(
    __dirname,
    "../../public/qr_codes/whatsapp_qr.png"
  );
  res.sendFile(imagePath);
});

export default imageRouter;
