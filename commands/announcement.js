const Moderation = require('../base/Moderation.js');

class Announcement extends Moderation {
  constructor(client) {
    super(client, {
      name: 'announcement',
      description: 'Posts an announcement.',
      usage: 'announcement <Komada|Idiot> <announcement>',
      extended: '[role] is either \'Komada\' or \'Idiot\', followed by your announcement.',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const role = message.guild.roles.find('name', `${args[0]} Subscribers`);
      if (!role) return message.reply(`Cannot find ${args[0]} Subscribers`);
      const channel = message.guild.channels.find('name', 'announcements');
      if (!channel) return message.reply('Cannot find Announcements channel');
      if (role.mentionable === false) await role.edit({mentionable: true});
      await channel.send(`${role}\n${args.slice(1).join(' ')}`);
      await role.edit({mentionable: false});
      await message.delete().catch(console.error);
      return message.channel.send('Successfully posted announcement.');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Announcement;