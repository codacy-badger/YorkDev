const Social = require('../../base/Social.js');
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
      description: 'Mocks a nominated message.',
      usage: 'mock',
      category: 'Fun',
      extended: 'Based on the popular Spongebob Squarepants mocking meme.',
      cost: 4,
      cooldown: 10,
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars 
    try {
      const grabMock = args.length === 0 ? await message.channel.fetchMessages({ limit:1, before: message.id}) : await message.channel.fetchMessage(await this.verifyMessage(message, args[0]));
      const mockBob = await fsn.readFile('./assets/images/spongebob.png');
      const mock = grabMock.size === 1 ? grabMock.first() : grabMock;
      if (mock.author.bot) throw '|`❌`| You cannot mock bots.';
      const payMe = await this.cmdPay(message, message.author.id, this.help.cost, this.conf.botPerms);
      if (!payMe) return;  
      await message.channel.send(alternateCase(mock.cleanContent), {files: [{attachment: mockBob, name: 'mock.png'}]});
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Mock;