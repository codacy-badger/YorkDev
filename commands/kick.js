const Moderation = require('../base/Moderation.js');

class Kick extends Moderation {
  constructor(client) {
    super(client, {
      name: 'kick',
      description: 'Kicks a mentioned user, or a user\'s ID',
      usage: 'kick <mention> [reason]',
      extended: 'This kicks the mentioned user, with or without a reason.',
      aliases: ['toss', 'boot', 'throw'],
      botPerms: ['KICK_MEMBERS', 'EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars

    const target = message.mentions.members.first();
    if (!target) return message.reply('|`❌`| Invalid command usage, You must mention someone to use this command.');
    if (!target.kickable) return message.reply('');
    
    const modLevel = this.modCheck(message, args, level);
    if (typeof modLevel === 'string') return message.reply(modLevel);

    const reason = args.splice(1, args.length).join(' ');
    
    const settings = this.client.settings.get(message.guild.id);
    const channel = message.guild.channels.exists('name', settings.modLogChannel);
    if (!channel) return message.reply(`Cannot find the \`${settings.modLogChannel}\` channel.`);
    await this.buildModLog(this.client, message.guild, 'k', target, message.author, reason);
    await message.channel.send('beaned!');
  }
}

module.exports = Kick;