const Command = require('../../base/Command.js');

class Source extends Command {
  constructor(client) {
    super(client, {
      name: 'source',
      description: 'Gets the raw message content.',
      usage: 'source <messageID>',
      category: 'Utilities',
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars

    const fetchedMessage = await message.channel.fetchMessages({ limit: args[0] ? 1 : 2, around: args[0] || message.channel.lastMessageID });
    message.channel.send(`Content for Message ID \`${args[0] || message.channel.lastMessageID}\`: \`\`\`md\n${await this.client.clean(this.client, fetchedMessage.last().content)}\n\`\`\``);
  }
}

module.exports = Source;
