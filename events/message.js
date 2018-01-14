const errorChecks = require(`${process.cwd()}/functions/parseText.js`);
const monitor = require(`${process.cwd()}/monitors/monitor.js`);

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(message) {
    if (message.author.bot) return;
  
    const defaults = this.client.settings.get('default');
    const settings = message.guild ? this.client.getSettings(message.guild.id) : defaults;
    message.settings = settings;
    
    const level = this.client.permlevel(message);
    monitor.run(this.client, message, level);
    if (level < 2) errorChecks(message, message.content);
  
    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}> `);
    const prefixMention = mentionPrefix.exec(message.content);

    const prefixes = [settings.prefix, `${prefixMention}`];
    let prefix = false;
  
    for (const thisPrefix of prefixes) {
      if (message.content.indexOf(thisPrefix) == 0) prefix = thisPrefix;
    }
  
    if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>$`))) {
      return message.channel.send(`The prefix is \`${settings.prefix}\`.`);
    }
  
    if (!prefix) return;
  
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    
    
    if (this.client.tags.has(command)) {
      return message.channel.send(`${args.join(' ')} ${this.client.tags.get(command).contents}`);
    }
    
    if (!cmd) return;
    
    const rateLimit = await this.client.ratelimit(message, level, cmd.help.name, cmd.conf.cooldown); 

    if (typeof rateLimit == 'string') {
      this.client.logger.warn(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) got ratelimited while running command ${cmd.help.name}`);
      return message.reply(`Please wait ${rateLimit.toPlural()} to run this command.`);
    }

    if (cmd && !message.guild && cmd.conf.guildOnly)
      return message.reply('This command is unavailable via private message. Please run this command in a guild.');

    if (level < this.client.levelCache[cmd.conf.permLevel]) {
      if (settings.systemNotice === 'true') {
        return message.reply(`You do not have permission to use this command.
Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name})
This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
      } else {
        return;
      }
    }
    
    message.author.permLevel = level;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }

    this.client.logger.cmd(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);

    if (message.channel.type === 'text') {      
      const mPerms = this.client.permCheck(message, cmd.conf.botPerms);
      if (mPerms.length) return message.reply(`The bot does not have the following permissions \`${mPerms.join(', ')}\``);
    }

    cmd.run(message, args, level).catch(error => {
      console.log(error);
      // if (error.message || error.stack) this.client.logger.error(error);
    });
  }
};
