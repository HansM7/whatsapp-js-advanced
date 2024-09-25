export async function sendMessageToGroup(nameGroup, message, client) {
  const chats = await client.getChats();
  const grupo = chats.find((chat) => chat.isGroup && chat.name === nameGroup);

  if (grupo) {
    const grupoID = grupo.id._serialized;

    try {
      await client.sendMessage(grupoID, message);
    } catch (error) {
      consola.error("Error al enviar el mensaje al grupo:", error);
    }
  } else {
    consola.error("Grupo no encontrado");
  }
}
