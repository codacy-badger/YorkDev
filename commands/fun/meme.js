const Social = require('../../base/Social.js');
const snek = require('snekfetch');
class Meme extends Social {
  constructor(client) {
    super(client, {
      name: 'meme',
      description: 'Posts a random `dankmeme` image.',
      usage: 'meme',
      cost: 1,
      aliases: ['dank', 'dankmeme'],
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const { body } = await snek.get('https://www.reddit.com/r/dankmemes/random.json');
      const meme = body[0].data.children[0].data;
      if (meme.over_18) {
        throw 'Unable to display this meme due to it being NSFW.'
      }
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const msg = await message.channel.send('Fetching meme...');
      await message.channel.send(`${meme.title} submitted by ${meme.author}\nUpvote Ratio ${meme.upvote_ratio}\n${meme.url}`)
      msg.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Meme;