import cron from "node-cron";
import { sendMessageToGroup } from "../functions/to-group.js";

export async function configCron(client) {
  // Enviar mensaje al grupo a las 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    const message = "Buenos días, me voy conectando.";
    await sendMessageToGroup("PRIVATE", message, client);
    consola.info("Mensaje enviado al grupo a las 9:00 AM.");
  });

  // Enviar mensaje al grupo a la 1:30 PM
  cron.schedule("30 13 * * *", async () => {
    const message = "Buenas tardes, me voy a almorzar.";
    await sendMessageToGroup("PRIVATE", message, client);
    consola.info("Mensaje enviado al grupo a la 1:30 PM.");
  });

  // Enviar mensaje al grupo a las 2:30 PM
  cron.schedule("30 14 * * *", async () => {
    const message = "Volvi de almorzar.";
    await sendMessageToGroup("PRIVATE", message, client);
    consola.info("Mensaje enviado al grupo a las 2:30 PM.");
  });

  // Enviar mensaje al grupo a las 6:10 PM
  cron.schedule("10 18 * * *", async () => {
    const message = "Buenas tardes, me voy retirando.";
    await sendMessageToGroup("PRIVATE", message, client);
    consola.info("Mensaje enviado al grupo a las 6:10 PM.");
  });
}