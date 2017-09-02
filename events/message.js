const errorChecks = require('../functions/parseText.js');
const monitorAFK = require('../monitors/afk.js');
const monitorPoints = require('../monitors/points.js');
module.exports = (client, message) => {
  if (message.author.bot) return;
  if (message.guild) {
    const blacklist = client.blacklist.get(message.guild.id);
    if (blacklist.includes(message.author.id)) return;
  }

  const defaults = client.config.defaultSettings;
  const settings = message.guild ? client.settings.get(message.guild.id) : defaults;
  message.settings = settings;
  
  monitorAFK.checkAFK(client, message);
  monitorPoints.givePoints(client, message);
  const level = client.permlevel(message);
  if (level < 2) errorChecks(message, message.content);


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

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');
  if (cmd && level >= cmd.conf.permLevel) {
    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }
    // client.log("log", `${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, "CMD");
    cmd.run(message, args, level);
  } else if (client.tags.has(command)) {
    message.channel.send(`${args.join(' ')} ${client.tags.get(command).contents}`);
  }
};
