module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: false,
      aliases: ['restart'],
      permLevel: 10
    };

    this.help = {
      name: 'reboot',
      description: 'This reboots the bot.',
      usage: 'reboot',
      category: 'System',
      extended: 'This will make the bot logout and destroy the client instance before exiting cleanly.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const commandUnloads = this.client.commands.filter(c => !!c.db).array();
      for (const c of commandUnloads) {
        await c.db.close();
      }
      await message.channel.send('Rebooting now...');
      await this.client.destroy();
      process.exit();
    } catch (e) {
      console.log(e);
    }
  }
};

exports.conf = {
};

exports.help = {
};
