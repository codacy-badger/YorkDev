const errorChecks = require('../functions/parseText.js');
module.exports = (client, message) => {
  if (message.author.bot) return;

  errorChecks(message, message.content);

  if (message.channel.type === 'dm' && message.author.id !== client.user.id)
    console.log(`[${message.author.id}] DM received from ${message.author.tag}: ${message.content}`);

  if (!message.guild) return;
  const settings = client.settings.get(message.guild.id);
  const defaults = client.config.defaultSettings;
  const prefixes = [settings.prefix, defaults.prefix];
  let prefix = false;
  for (const thisPrefix of prefixes) {
    if (message.content.indexOf(thisPrefix) == 0) prefix = thisPrefix;
  }
  
  if (message.content.match(new RegExp(`^<@!?${client.user.id}>$`))) {
    let mentionMsg = '';
    settings.prefix === defaults.prefix ? mentionMsg = `The prefix is \`${settings.prefix}\`.` : mentionMsg = `This server's prefix is \`${settings.prefix}\`, whilst the default prefix is \`${defaults.prefix}\``;
    return message.channel.send(mentionMsg);
  }

  if (!prefix) return;
  message.settings = settings;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const level = client.permlevel(message);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd && level >= cmd.conf.permLevel) {
    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    // client.log("log", `${message.guild.name}/#${message.channel.name}: ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "CMD");
    cmd.run(client, message, args, level);
  } else if (client.tags.has(command)) {
    message.channel.send(`${args.join(' ')} ${client.tags.get(command).contents}`);
  }
};
