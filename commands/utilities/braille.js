const Command = require('../../base/Command.js');
const br = require('braille');

function To(msg) {
  const rt = br.toBraille(msg);
  console.log(rt);
  return rt;
}

class Braille extends Command {
  constructor(client) {
    super(client, {
      name: 'braille',
      description:'Converts a message given into braille.',
      category: 'Utilities',
      usage: 'braille <message>',
      extended: 'Ever felt the need to convert your message into braille? Now you can!',
      aliases: [],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (args.lengh > 1) return message.reply('I cannot trasnslate nothingness.. How about you put something there?');
    const msg = args.join(' ');
    const reply = To(msg);
    message.reply(reply);
  }
}

module.exports = Braille;
