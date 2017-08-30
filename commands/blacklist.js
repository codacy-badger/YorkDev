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
      name: 'blacklist',
      description: 'blacklists mentioned user',
      usage: 'blacklist <mention/userid>',
      category: 'Moderation',
      extended: 'Blacklist members from using the bot via mention or user id.'
    };
  }

  async run(message, [action, key], level) { // eslint-disable-line no-unused-vars
    const blacklist = this.client.blacklist.get(message.guild.id);
    const author = message.mentions.users.first() || this.client.users.get(key);
    const member = message.guild.member(author);

    if (action === 'add') {
      if (!author) return message.channel.send('You must supply a user id or mention to blacklist them.');
      if (blacklist.includes(author.id)) return message.reply('That user is already blacklisted.');
      if (message.author.id === author.id) return message.reply('You cannot blacklist yourself. ~~idiot~~');
      const msg = { author:author, member:member, guild: message.guild };
      if (level <= this.client.permlevel(msg)) return message.reply('You cannot black list someone of equal, or a higher permission level.');
      blacklist.push(author.id);
      this.client.blacklist.set(message.guild.id, blacklist);
      message.channel.send('User successfully added to blacklist.');
    }

    if (action === 'remove') {
      if (!author) return message.channel.send('You must supply a user id or mention to blacklist them.');
      if (!blacklist.includes(author.id)) return message.reply('That user is not blacklisted.');
      blacklist.remove(author.id);
      this.client.blacklist.set(message.guild.id, blacklist);
      message.channel.send('User successfully removed from blacklist.');
    }

    if (action === 'view') {
      if (blacklist.length < 1) return message.channel.send('No one is blacklisted.');
      const a = blacklist;
      const fetch = Promise.all(a.map(r => this.client.fetchUser(r).then(u => u.tag)));
      fetch.then(r => message.channel.send(`**❯ Blacklisted:**\n${r.join('\n')}`));
    }
  }
};
