async function checkAFK(client, message) {
  const settings = client.settings.get(message.guild.id);
  const person = message.mentions.members.first();
  if (!person) return;
  const mention = client.config.ownerId.includes(person.id);
  if (!mention) return;
  if (settings.afk === 'true') {
    message.reply(`${person.displayName} ${settings.afkMessage}`);
  }
}

module.exports = { checkAFK };
