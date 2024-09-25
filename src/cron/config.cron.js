import  cron from "node-cron"
import { sendMessageToGroup } from "../functions/to-group.js";
import { sendMessageToContact } from "../functions/to-contact.js";

export async function configCron(client){
  
  // Enviar mensaje al grupo
  cron.schedule("0 9 * * *", async () => {
    const message = "Buenos días, me voy conectando.";
    await sendMessageToGroup("PRIVATE", message, client);
    consola.info("Mensaje enviado al grupo.");
  });

  // Enviar mensaje al contacto
  // cron.schedule("0 8 * * *", async () => {
  //   consola.info("Iniciando envío de mensaje al contacto...");
  //   const mensaje = "Buenos días, me voy conectando.";
  //   await sendMessageToContact(phoneContact, mensaje);
  //   consola.info("Mensaje enviado al contacto.");
  // });

}