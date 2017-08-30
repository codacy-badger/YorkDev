module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: false,
      aliases: ['dm', 'contact'],
      permLevel: 0
    };

    this.help = {
      name: 'support',
      description: 'Contact Bot Support',
      usage: 'support <message>',
      category: 'System',
      extended: 'This command will forward your Support DM to the Support Guild, your consent is **required** to use this command.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (message.guild) return message.reply('This command can only be used in DM\'s');
    const msg = args.join(' ');
    try {
      this.client.checkConsent(this.client, message, msg);
    } catch (e) {
      console.log(e);
    }
  }
};
