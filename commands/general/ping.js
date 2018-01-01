const Command = require(`${process.cwd()}/base/Command.js`);

class Ping extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      description: 'Latency and API response times.',
      usage: 'ping',
      extended: 'This command is a response test, it helps gauge if there is any latency (lag) in either the bots connection, or the API.',
      aliases: ['pong'],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send('🏓 Ping!');
      msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(this.client.ping)}ms.)`);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = Ping;