import "dotenv/config";
import express from "express";
import qrcode from "qrcode";
import fs from "fs";
import path from "path";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { consola, createConsola } from "consola";
import { configCron } from "./cron/config.cron.js";
import OpenAI from 'openai';

const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

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
  // const numeroTelefono = "51990882111@c.us";

  // const mensaje = "Hola, este es un mensaje de prueba!";

  // client.sendMessage(numeroTelefono, mensaje)

  // https://chat.whatsapp.com/I0UAvpWBBza2nxg4zHHwfq
  const chats = await client.getChats();

  // Buscar el grupo por nombre o por cualquier otro criterio
  const grupo = chats.find((chat) => chat.isGroup && chat.name === "PRIVATE"); // Reemplaza 'Nombre del Grupo' con el nombre real del grupo

  if (grupo) {
    const grupoID = grupo.id._serialized;
    consola.info(`ID del grupo encontrado: ${grupoID}`);

    // Mensaje que deseas enviar al grupo
    const mensaje = "Hola, este es un mensaje de prueba para el grupo!";

    // Enviar el mensaje al grupo
    try {
      await client.sendMessage(grupoID, mensaje);
      consola.success("Mensaje enviado exitosamente al grupo!");
    } catch (error) {
      consola.error("Error al enviar el mensaje al grupo:", error);
    }
  } else {
    consola.error("Grupo no encontrado");
  }
});

client.on("message", async (message) => {
  // consola.info(`Mensaje recibido de ${message.from}: ${message.body}`);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Responde amablemente a este mensaje." },
      { role: "user", content: message.body }
    ],
    max_tokens: 2,
  });

  const respuesta = response.choices[0].message.content.trim();

  await client.sendMessage(message.from, respuesta);
  consola.info(`Respuesta enviada a ${message.from}: ${respuesta}`);
  // // Aquí puedes evaluar el contenido del mensaje
  // if (message.body === "Hola") {
  //   client.sendMessage(message.from, "¡Hola! ¿Cómo estás?");
  // } else if (message.body === "Adiós") {
  //   client.sendMessage(message.from, "¡Adiós! Que tengas un buen día.");
  // } else {
  //   client.sendMessage(message.from, "No entiendo tu mensaje.");
  // }
});

client.initialize();

app.set("whatsappClient", client);

// configCron(client);

app.listen(4000, () => {
  consola.start("Server is running on port 4000");
});




// client.on("message", async (message) => {
//   consola.info(`Mensaje recibido de ${message.from}: ${message.body}`);

//   if (message.body.toLowerCase() === "pdf") {
//     const media = MessageMedia.fromFilePath('./path/to/your/file.pdf');
//     await client.sendMessage(message.from, media);
//     consola.info(`PDF enviado a ${message.from}`);
//   } else {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "Responde amablemente a este mensaje." },
//         { role: "user", content: message.body }
//       ],
//       max_tokens: 150,
//     });

//     const respuesta = response.choices[0].message.content.trim();

//     await client.sendMessage(message.from, respuesta);
//     consola.info(`Respuesta enviada a ${message.from}: ${respuesta}`);
//   }
// });


// client.on("message", async (message) => {
//   consola.info(`Mensaje recibido de ${message.from}: ${message.body}`);

//   if (message.body.toLowerCase() === "encuesta") {
//     const buttons = [
//       { buttonId: 'id1', buttonText: { displayText: 'Opción 1' }, type: 1 },
//       { buttonId: 'id2', buttonText: { displayText: 'Opción 2' }, type: 1 },
//       { buttonId: 'id3', buttonText: { displayText: 'Opción 3' }, type: 1 }
//     ];

//     const buttonMessage = {
//       contentText: 'Por favor, elige una opción:',
//       footerText: 'Encuesta',
//       buttons: buttons,
//       headerType: 1
//     };

//     await client.sendMessage(message.from, buttonMessage);
//     consola.info(`Encuesta enviada a ${message.from}`);
//   } else {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "Responde amablemente a este mensaje." },
//         { role: "user", content: message.body }
//       ],
//       max_tokens: 150,
//     });

//     const respuesta = response.choices[0].message.content.trim();

//     await client.sendMessage(message.from, respuesta);
//     consola.info(`Respuesta enviada a ${message.from}: ${respuesta}`);
//   }
// });