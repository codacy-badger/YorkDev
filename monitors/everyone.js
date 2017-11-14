exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (!message.guild || !message.member) return; // Second part is about webhooks.
  if (message.member.permLevel > 0) return;
  const everyoneRole = message.guild.roles.find(r => r.name.toLowerCase() === 'everyone');
  if (!everyoneRole) return;
  if (message.mentions.roles.size < 1) return;
  if (message.mentions.roles && message.mentions.roles.has(everyoneRole.id)) {
    message.member.addRole(everyoneRole).catch(O_o => {}); // eslint-disable-line no-unused-vars
  }
};