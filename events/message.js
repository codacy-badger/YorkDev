const config = require('../config.json');
const errorChecks = require('../functions/parseText.js');
module.exports = async message => {
  let client = message.client;
  errorChecks(message, message.content);
  if (!message.content.startsWith(config.prefix) || message.author.bot || message.author.id === client.user.id) return;
  let command = message.content.split(' ')[0].slice(config.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    cmd.run(client, message, params, perms);
  }
};
