const Command = require('../../base/Command.js');

class AFK extends Command {
  constructor(client) {
    super(client, {
      name: 'afk',
      description: 'Sets an away message.',
      category: 'System',
      usage: 'afk [-on|-off|-status|-edit <message>]',
      extended: 'Toggle bot owner AFK, view and edit current AFK message.',
      aliases: ['brb', 'bbl'],
      botPerms: [],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.botSettings.get('bot');
    try {
      if (!args[0] && !message.flags.length) message.flags.push('status');
      if (!message.flags.length) {
        throw 'bleh';
      }
      switch (message.flags[0]) {
        case ('on'): {
          if (settings.afk) throw 'You are already set as AFK.';
          else {
            settings['afk'] = true;
            this.client.user.setStatus('dnd');
            this.client.botSettings.set('bot', settings);
            message.channel.send('Set to AFK');
          }
          break;
        }

        case ('off'): {
          if (!settings.afk) throw 'You are not AFK.';
          else {
            settings['afk'] = false;
            this.client.user.setStatus('online');
            this.client.botSettings.set('bot', settings);
            message.channel.send('No longer set to AFK');
          }
          break;
        }

        case ('edit'): {
          settings['afkMessage'] = args.join(' ');
          this.client.botSettings.set('bot', settings);
          message.channel.send(`AFK message updated \`${args.join(' ')}\``);
          break;
        }

        case ('status'): {
          message.channel.send(`The current status are,\nAFK Status: ${settings.afk}\nAFK Message: ${settings.afkMessage}`);
          break;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AFK;