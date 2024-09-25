export async function sendMessageToContact(phone, message, client) {
  const formatPhone = "51" + phone + "@c.us";
  client.sendMessage(formatPhone, message);
}
