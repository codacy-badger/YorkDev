const Command = require('../base/Command.js');

class Hug extends Command {
  constructor(client) {
    super(client, {
      name: 'hug',
      description: '',
      usage: 'hug [@mention]',
      extended: '',
      aliases: ['stab', 'shoot', 'knife', 'punch', 'highfive'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const command = message.cleanContent.split(message.settings.prefix)[1].split(' ')[0];
    try {
      switch (command) {
        case ('stab'): {
          message.channel.send(`Holy crap, they just stabbed ${message.mentions.members.first()}!`);
          break;
        }
        case ('knife'): {
          message.channel.send(`Holy crap, they just stabbed ${message.mentions.members.first()}!`);
          break;
        }
        case ('shoot'): {
          message.channel.send(`Holy crap, they just shot ${message.mentions.members.first()}!`);
          break;
        }
        case ('punch'): {
          message.channel.send(`Holy crap, they just punched ${message.mentions.members.first()}!`);
          break;
        }
        case ('highfive'): {
          message.channel.send(`Aww sweet, they just high fived ${message.mentions.members.first()}!`);
          break;
        }
        default:
          message.channel.send(`Aww sweet, they just gave ${message.mentions.members.first()} a hug!`);        
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Hug;