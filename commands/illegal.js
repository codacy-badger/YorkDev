const Social = require('../base/Social.js');
const { get, post } = require('snekfetch');
const inUse = new Map();

class IsNowIllegal extends Social {
  constructor(client) {
    super(client, {
      name: 'illegal',
      description: 'Get US President Trump to make something illegal.',
      usage: 'illegal <thing>',
      category:'Fun',
      extended: 'Powered by IsNowIllegal.com, get US President Trump to make anything illegal.',
      cost: 100,
      guildOnly: true,
      permLevel: 'User'
    });
  }

  async run(message, args, level) {
    if (inUse.get('true')) throw 'Trump is currently making something illegal, please wait.';
    inUse.set('true', {user: message.author.id});
    const word = args.join(' ').replace('.', '');
    const wordMatch = /^[a-z\s]{1,10}$/gi.exec(word);
    if (word.length < 1 || word.length > 10) {
      inUse.delete('true');
      throw 'Cannot be longer than 10 characters or shorter than 1 character.';
    }
    if (!wordMatch) {
      inUse.delete('true');
      throw 'oops! Non-standard unicode characters are now illegal.';
    }
    try {
      if (level < 2) {
        const payMe = await this.cmdPay(message, message.author.id, this.help.cost);
        if (!payMe) return;  
      }
      const msg = await message.channel.send(`Convincing Trump that ${word} should be illegal...`);
      message.channel.startTyping();
      await post('https://is-now-illegal.firebaseio.com/queue/tasks.json').send({ task: 'gif', word: word.toUpperCase() });
      await this.client.wait(5000);
      const result = await get(`https://is-now-illegal.firebaseio.com/gifs/${word.toUpperCase()}.json`);
      await message.channel.send({ 'files': [result.body.url] });
      message.channel.stopTyping({force:true});
      await msg.delete();
      inUse.delete('true');
    } catch (error) {
      inUse.delete('true');
      message.channel.stopTyping({force:true});
      throw error;
    }
  }
}

module.exports = IsNowIllegal;