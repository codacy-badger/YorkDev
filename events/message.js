const errorChecks = require('../functions/parseText.js');
module.exports = (client, message) => {
  if (message.author.bot) return;

  errorChecks(message, message.content);

  if (message.channel.type === 'dm' && message.author.id !== client.user.id)
    console.log(`[${message.author.id}] DM received from ${message.author.tag}: ${message.content}`);

  const settings = client.settings.get(message.guild.id);
  const defaults = client.config.defaultSettings;
  const prefixes = [settings.prefix, defaults.prefix];
  let prefix = false;
  for (const thisPrefix of prefixes) {
    if (message.content.indexOf(thisPrefix) !== 0) prefix = thisPrefix;
  }
  if (!prefix) return;

  message.settings = settings;

  const args = message.content.split(/ +/g);
  const command = args.shift().slice(settings.prefix.length).toLowerCase();
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
