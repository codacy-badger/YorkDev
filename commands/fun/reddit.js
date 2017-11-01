const Social = require('../../base/Social.js');
const snek = require('snekfetch');

class Reddit extends Social {
  constructor(client) {
    super(client, {
      name: 'reddit',
      description: 'Posts a random subreddit entry.',
      usage: 'reddit [-new|-random|-hot|-top] [subreddit]',
      category: 'Fun',
      cost: 10,
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const subreddit = args.join(' ') || 'random';
    const subRedCat = message.flags[0] || 'random'
    try {
      const { body } = await snek.get(`https://www.reddit.com/r/${subreddit}/${subRedCat}.json`);
      let meme;
      if (message.flags[0] === 'random') meme = body[0].data.children[0].data;
      else meme = body.data.children[0].data;

      if (!message.channel.nsfw && meme.over_18) {
        throw 'Cannot display NSFW content in a SFW channel.'
      }
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  
      const msg = await message.channel.send('Fetching from reddit...');
      await message.channel.send(`${meme.title} submitted by ${meme.author} in ${meme.subreddit_name_prefixed}\nUpvote Ratio ${meme.upvote_ratio}\n${meme.url}`)
      msg.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Reddit;