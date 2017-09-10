const Social = require('../base/Social.js');
const fsn = require('fs-nextra');

const alternateCase = (string) => {
  const chars = string.toUpperCase().split('');
  for (let i = 0; i < chars.length; i += 2) {
    chars[i] = chars[i].toLowerCase();
  }
  return chars.join('');
};

class Mock extends Social {
  constructor(client) {
    super(client, {
      name: 'mock',
      description: 'Mocks the previous person that sent a message.',
      usage: 'mock',
      category: 'Fun',
      extended: 'Based on the popular Spongebob Squarepants mocking meme.',
      cost: 50,
      hidden: false, 
      guildOnly: true,
      aliases: [],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (level < 2) {
        const payMe = await this.pay(message, message.author.id, this.help.cost);
        if (!payMe) return;  
      }
      const mockBob = await fsn.readFile('./assets/images/spongebob.png');
      const grabMock = await message.channel.fetchMessages({ limit:1, before: message.id});
      const mock = grabMock.first();
      if (mock.author.bot) return message.reply('|`❌`| You cannot mock bots.');
      await message.channel.send(alternateCase(mock.cleanContent), {files: [{attachment: mockBob, name: 'mock.png'}]});
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Mock;