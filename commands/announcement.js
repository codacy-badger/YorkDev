module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: 2
    };

    this.help = {
      name: 'announcement',
      description: 'Posts an announcement.',
      usage: 'announcement <Komada|Idiot> <announcement>',
      category: 'Moderation',
      extended: '[role] is either \'Komada\' or \'Idiot\', followed by your announcement.'
    };
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
    } catch (e) {
      console.log(e);
    }
  }
};
