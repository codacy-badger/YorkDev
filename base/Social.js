const Command = require('./Command.js');

class Social extends Command {
  
  constructor(client, options) {
    super(client, Object.assign(options, {
      guildOnly: true
    }));

    
  }

  async ding(message, user, noticeOveride = 'false') {
    const name = await message.guild.member(user.user).displayName;
    const curLevel = Math.floor(0.1 * Math.sqrt(user.points));
    if (user.level < curLevel) {
      if (message.settings.levelNotice === 'true' && noticeOveride === 'true')
        message.channel.send(`DING! ${name} you've leveled up to level **${curLevel}**! Ain't that dandy?`);
      user.level = curLevel;
      return user.level;
    } else
    
    if (user.level > curLevel) {
      if (message.settings.levelNotice === 'true' && noticeOveride === 'true')
        message.channel.send(`DONG! ${name} you've leveled down to level **${curLevel}**! Ain't that a shame?`);
      user.level = curLevel;
      return user.level;
    }
  }

  async balance(message, user) {
    const settings = this.client.settings.get(message.guild.id);
    const pointEmoji = settings.customEmoji ? this.client.emojis.get(settings.gEmojiID) : settings.uEmoji;

    const id = await this.verifyUser(user);

    const score = this.client.points.get(`${message.guild.id}-${id}`);
    const YouThey = id === message.author.id ? 'You' : 'They';
    const YouThem = YouThey.length > 3 ? 'them' : 'you';

    return score ? `${YouThey} currently have ${score.points} ${pointEmoji}'s, which makes ${YouThem} level ${score.level}!` : `${YouThey} have no ${pointEmoji}'s, or levels yet.`; 
  }

  emoji(guild) {
    const settings = this.client.settings.get(guild);
    const pointEmoji = settings.customEmoji ? this.client.emojis.get(settings.gEmojiID) : settings.uEmoji;
    return pointEmoji;
  }

  async donate(message, payer, payee, amount) {
    try {
      if (amount < 0) throw 'You cannot pay less than zero, whatcha trying to do? rob em?';
      if (payer === payee) throw 'You cannot pay yourself, why did you even try it?';
      // payer: The user paying.
      const getPayer = await this.client.points.get(`${message.guild.id}-${payer}`)
        || this.client.points.set(`${message.guild.id}-${payer}`, { points: 0, level: 0, user: payer, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${payer}`);
    
      // payee: The user getting paid
      const getPayee = await this.client.points.get(`${message.guild.id}-${payee}`)
        || this.client.points.set(`${message.guild.id}-${payee}`, { points: 0, level: 0, user: payee, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${payee}`);

      if (getPayer.points < parseInt(amount)) {
        throw `Insufficient funds, you have ${getPayer.points}${this.emoji(message.guild.id)}`;
      }

      const response = await message.client.awaitReply(message, `Are you sure you want to pay ${message.guild.member(payee).displayName} ${parseInt(amount)} ${this.emoji(message.guild.id)}?\n\n(**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`);
      
      if (response === 'yes' || response === 'y') {
        try {
          const PayerLevel = await this.ding(message, getPayer);
          const PayeeLevel = await this.ding(message, getPayee);
          
          getPayer.points -= parseInt(amount);
          getPayee.points += parseInt(amount);
          getPayer.level = PayerLevel;
          getPayee.level = PayeeLevel;
          
          await message.channel.send(`The payment of ${parseInt(amount)}${this.emoji(message.guild.id)} has been sent to ${message.guild.member(payee).displayName}.`);
          await this.client.points.set(`${message.guild.id}-${payer}`, getPayer);
          await this.client.points.set(`${message.guild.id}-${payee}`, getPayee);
   
        } catch (error) {
          console.log(error);
        }
      } else

      if (response === 'no' || response === 'n') {
        message.channel.send('Payment cancelled');
      } 
    } catch (error) {
      console.log(error);
    }
  }

  async pay(message, payer, cost) {
    try {
      if (isNaN(cost)) throw 'Not a valid amount.';
      const amount = parseInt(cost);
      const guild = message.guild.id;
      const score = this.client.points.get(`${guild}-${payer}`);
      if (amount > score.points) throw `Insufficient funds, you have ${score.points}${this.emoji(guild)}`;
      score.points -= amount;
      const level = await this.ding(message, score, 'true');
      score.level = level;
      this.client.points.set(`${guild}-${payer}`, score);
      return true;
    } catch (error) {
      console.log(error);
    }
  }

}
module.exports = Social;