const Command = require('../base/Command.js');
const fsn = require('fs-nextra');

const alternateCase = (string) => {
  const chars = string.toUpperCase().split('');
  for (let i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toLowerCase();
  }
  return chars.join('');
};

class Mock extends Command {
  constructor(client) {
    super(client, {
      name: 'mock',
      description: 'Mocks the previous person that sent a message.',
      usage: 'mock',
      extended: 'Based on the popular Spongebob Squarepants mocking meme.',
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const mockBob = await fsn.readFile('./assets/images/spongebob.png');
      const grabMock = await message.channel.fetchMessages({ limit:1, before: message.id});
      const mock = grabMock.first();
      if (mock.author.bot) return message.reply('|`❌`| You cannot mock bots.');
      console.log(mock);
      await message.channel.send(alternateCase(mock.cleanContent), {files: [{attachment: mockBob, name: 'mock.png'}]});
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Mock;