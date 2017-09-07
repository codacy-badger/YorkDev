const errorChecks = require('../functions/parseText.js');
const monitor = require('../monitors/monitor.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(message) {
    if (message.author.bot) return;
    if (message.guild) {
      const blacklist = this.client.blacklist.get('list');
      if (blacklist.includes(message.author.id)) return;
    }
  
    const defaults = this.client.config.defaultSettings;
    const settings = message.guild ? this.client.settings.get(message.guild.id) : defaults;
    message.settings = settings;
    
    monitor.run(this.client, message);
    const level = this.client.permlevel(message);
    if (level < 2) errorChecks(message, message.content);
  
  
    const prefixes = [settings.prefix, defaults.prefix];
    let prefix = false;
  
    for (const thisPrefix of prefixes) {
      if (message.content.indexOf(thisPrefix) == 0) prefix = thisPrefix;
    }
  
    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) {
      let mentionMsg = '';
      settings.prefix === defaults.prefix ? mentionMsg = `The prefix is \`${settings.prefix}\`.` : mentionMsg = `This server's prefix is \`${settings.prefix}\`, whilst the default prefix is \`${defaults.prefix}\``;
      return message.channel.send(mentionMsg);
    }
  
    if (!prefix) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');
    if (cmd && level >= cmd.conf.permLevel) {
      message.flags = [];
      while (args[0] && args[0][0] === '-') {
        message.flags.push(args.shift().slice(1));
      }
      this.client.log('log', `${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'CMD');
      cmd.run(message, args, level);
    } else if (this.client.tags.has(command)) {
      message.channel.send(`${args.join(' ')} ${this.client.tags.get(command).contents}`);
    }
  }
};