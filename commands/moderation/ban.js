const Moderation = require('../../base/Moderation.js');

class Ban extends Moderation {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Bans a nominated user.',
      usage: 'ban <@mention> [reason]',
      extended: 'This bans the mentioned user, with or without a reason.',
      aliases: ['B&', 'b&', 'banne', 'bean'],
      botPerms: ['BAN_MEMBERS', 'EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.getSettings(message.guild.id);      
    const channel  = message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel)    throw `${message.author}, I cannot find the \`${settings.modLogChannel}\` channel.`;
    const target   = await this.verifyUser(args[0]);
    if (!target)     throw `${message.author} |\`❌\`| Invalid command usage, You must mention someone to use this command.`;
    const modLevel = this.modCheck(message, args[0], level);
    if (typeof modLevel === 'string') return message.reply(modLevel);
    const reason   = args.splice(1, args.length).join(' ');
    try {
      await message.guild.ban(target, {days:0, reason: reason.length < 1 ? 'No reason supplied.': reason});
      await this.buildModLog(this.client, message.guild, 'ba', target, message.author, reason);
      await message.channel.send(`\`${target.tag}\` was successfully banned.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ban;