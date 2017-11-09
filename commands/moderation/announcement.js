const Command = require('../../base/Command.js');

class Announcement extends Command {
  constructor(client) {
    super(client, {
      name: 'announcement',
      description: 'Posts an announcement.',
      usage: 'announcement <role name> <announcement>',
      extended: '<role name> must be correctly spelt, otherwise it will throw an error.',
      botPerms: ['MANAGE_ROLES'],
      permLevel: 'Moderator'
    });
  }

  async run(message, [role, ...announcement], level) { // eslint-disable-line no-unused-vars
    try {
      const settings = this.client.getSettings(message.guild.id);      
      const anRole = message.guild.roles.find('name', `${role}`);
      if (!anRole) return message.reply(`Cannot find ${role}.`);
      const channel = message.guild.channels.find('name', settings.announceChannel);
      if (!channel) return message.reply(`Cannot find ${settings.announceChannel} channel.`);
      if (anRole.mentionable === false) await anRole.edit({mentionable: true});
      await channel.send(`${anRole}\n${announcement.join(' ')}`);
      await anRole.edit({mentionable: false});
      return message.channel.send('Successfully posted announcement.');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Announcement;
