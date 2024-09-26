import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

export async function sendMessageFromOpenAi(message, client) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Responde amablemente a este mensaje." },
      { role: "user", content: message.body },
    ],
    max_tokens: 2,
  });

  const respuesta = response.choices[0].message.content.trim();

  await client.sendMessage(message.from, respuesta);
  consola.info(`Respuesta enviada a ${message.from}: ${respuesta}`);
}

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
