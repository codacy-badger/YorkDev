const Moderation = require('../../base/Moderation.js');

class Ban extends Moderation {
  constructor(client) {
    super(client, {
      name: 'softban',
      description: 'Bans a nominated user, then unbans them.',
      usage: 'softban <@mention> [reason]',
      extended: 'A hard kick. It kicks so hard, all the user\'s messages of the last 2 days are deleted.',
      aliases: ['gentlebann', 'hardkick'],
      botPerms: ['BAN_MEMBERS', 'EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.getSettings(message.guild.id);
    const channel  = message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel)    throw `${message.author}, I cannot find the \`${settings.modLogChannel}\` channel.`;
    const target   = await this.verifyMember(message.guild, args[0]);
    if (!target)     throw `${message.author} |\`❌\`| Invalid command usage, You must mention someone to use this command.`;
    const modLevel = this.modCheck(message, args[0], level);
    if (typeof modLevel === 'string') return message.reply(modLevel);
    const reason   = args.splice(1, args.length).join(' ');
    try {
      await target.ban({days:2, reason: reason.length < 1 ? 'No reason supplied.': reason});
      await message.guild.unban(target);
      await this.buildModLog(this.client, message.guild, 'so', target, message.author, reason);
      await message.channel.send(`\`${target.user.tag}\` was successfully softbanned.`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Ban;