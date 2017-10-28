const Command = require('../../base/Command.js');

class Hug extends Command {
  constructor(client) {
    super(client, {
      name: 'hug',
      description: 'You can hug, or punch people with this.',
      usage: 'hug [@mention]',
      extended: 'Ever needed to give a supportive hug, or high five another user? Now you can.',
      aliases: ['stab', 'shoot', 'knife', 'punch', 'highfive'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const person = message.mentions.members.first() || 'themself';
    const command = message.cleanContent.split(message.settings.prefix)[1].split(' ')[0];
    try {
      switch (command) {
        case ('stab'): {
          message.channel.send(`Holy crap, they just stabbed ${person}!`);
          break;
        }
        case ('knife'): {
          message.channel.send(`Holy crap, they just stabbed ${person}!`);
          break;
        }
        case ('shoot'): {
          message.channel.send(`Holy crap, they just shot ${person}!`);
          break;
        }
        case ('punch'): {
          message.channel.send(`Holy crap, they just punched ${person}!`);
          break;
        }
        case ('highfive'): {
          message.channel.send(`Aww sweet, they just high fived ${person}!`);
          break;
        }
        default:
          message.channel.send(`Aww sweet, they just gave ${person} a hug!`);        
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Hug;