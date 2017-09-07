const Command = require('../base/Command.js');

const moment = require('moment');
require('moment-duration-format');

class Daily extends Command {
  constructor(client) {
    super(client, {
      name: 'daily',
      description: 'Claim or give your daily 50 G points.',
      usage: 'daily [user]',
      extended: 'You can either claim or donate your daily points. (Giving coming soon)',
      category: 'Fun',
      guildOnly: true
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const pointEmoji = settings.customEmoji ? this.client.emojis.get(settings.gEmojiID) :  settings.uEmoji;

    const user = args.join(' ') || message.author.id;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return message.channel.send('Not a valid user id.');
    const id = match[1];

    const donateTo = this.client.points.get(`${message.guild.id}-${id}`) 
    || this.client.points.set(`${message.guild.id}-${id}`, { points: 0, level: 0, user: id, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${id}`);
    
    const donateFrom = this.client.points.get(`${message.guild.id}-${message.author.id}`) 
    || this.client.points.set(`${message.guild.id}-${message.author.id}`, { points: 0, level: 0, user: message.author.id, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${message.author.id}`);

    const receiver = this.client.guilds.get(message.guild.id).members.get(id);


    if (donateTo === donateFrom) {
      if (Date.now() > donateFrom.daily) {
        const msg = await message.channel.send(`You have claimed your daily 50 ${pointEmoji} points. Ain't that dandy?`);
        donateFrom.daily = msg.createdTimestamp + (settings.dailyTime * 60 * 60 * 1000);
        donateFrom.points += 50;
        this.client.points.set(`${message.guild.id}-${message.author.id}`, donateFrom);
      } else {
        const fromNow = moment(donateFrom.daily).fromNow(true);
        message.channel.send(`You cannot claim your points yet, please try again in ${fromNow}.`);
      }
    } else {
      if (Date.now() > donateFrom.daily) {
        const msg = await message.channel.send(`You have donated your daily 50 ${pointEmoji} points to ${receiver.displayName}. Ain't that dandy?`);
        donateFrom.daily = msg.createdTimestamp + (settings.dailyTime * 60 * 60 * 1000);
        donateTo.points += 50;
        this.client.points.set(`${message.guild.id}-${id}`, donateTo);
        this.client.points.set(`${message.guild.id}-${message.author.id}`, donateFrom);
      } else {
        const fromNow = moment(donateFrom.daily).fromNow(true);
        message.channel.send(`You cannot donate your points yet, please try again in ${fromNow}.`);
      }
    }
  }
}

module.exports = Daily;
