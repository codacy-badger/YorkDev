module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: true,
      guildOnly: true,
      aliases: [],
      permLevel: 0
    };

    this.help = {
      name: 'reply',
      description: 'Support use only',
      usage: 'reply <message>',
      category: 'System',
      extended: 'Responds to a support channel.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const user = message.channel.topic;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return message.channel.send('Not a valid support channel.');
    const id = match[1];
    const target = await this.client.fetchUser(id);
    const msg = args.join(' ');
    const embed = this.client.supportMsg(message, msg);
    try {
      const consent = this.client.consent.get(id);
      !consent ? message.channel.send('You cannot contact this user until they consent.') : target.send({embed});
    } catch (e) {
      if (e.message === 'Cannot send messages to this user') {
        await message.channel.send(`I cannot send that message ${message.author.username}, as it appears they may have **Direct Messages's** disabled.`);
      } else {
        console.log(e);
      }
    }
  }
};
