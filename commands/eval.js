module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: false,
      aliases: ['ev'],
      permLevel: 10
    };

    this.help = {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      usage: 'eval <expression>',
      category:'System',
      extended: 'This is an extremely dangerous command, use with caution and never eval stuff strangers tell you.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const code = args.join(' ');
    try {
      const evaled = eval(code);
      const clean = await this.client.clean(this.client, evaled);
      message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await this.client.clean(this.client, err)}\n\`\`\``);
    }
  }
};
