const Command = require('./Command.js');

class Social extends Command {
  
  constructor(client, options) {
    super(client, Object.assign(options, {
      category: 'Social',
      guildOnly: true
    }));

    
  }

  async dingUp(message, user) {
    const curLevel = Math.floor(0.1 * Math.sqrt(user.points));
    if (user.level < curLevel) {
      user.level = curLevel;
      return user.level;
    }
  }

  async dingDown(message, user) {
    const curLevel = Math.floor(0.1 * Math.sqrt(user.points));
    if (user.level > curLevel) {
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

  async pay(message, payer, payee, amount) {
    try {
      if (payer === payee) return message.channel.send('You cannot pay yourself, why did you even try it?');
      // payer: The user paying.
      const getPayer = await this.client.points.get(`${message.guild.id}-${payer}`)
        || this.client.points.set(`${message.guild.id}-${payer}`, { points: 0, level: 0, user: payer, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${payer}`);
    
      // payee: The user getting paid
      const getPayee = await this.client.points.get(`${message.guild.id}-${payee}`)
        || this.client.points.set(`${message.guild.id}-${payee}`, { points: 0, level: 0, user: payee, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${payee}`);

      if (getPayer.points < parseInt(amount)) {
        return message.reply(`Insufficient funds, you have ${getPayer.points}${this.emoji(message.guild.id)}`);
      }

      const response = await message.client.awaitReply(message, `Are you sure you want to pay ${message.guild.member(payee).displayName} ${parseInt(amount)} ${this.emoji(message.guild.id)}?\n\n(**y**es | **n**o)\n\nReply with \`cancel\` to cancel the message. The message will timeout after 60 seconds.`);
      
      if (response === 'yes' || response === 'y') {
        getPayer.points -= parseInt(amount);
        getPayee.points += parseInt(amount);
        message.channel.send(`The payment of ${parseInt(amount)}${this.emoji(message.guild.id)} has been sent to ${message.guild.member(payee).displayName}.`);
    
        const PayerLevel = await this.dingDown(message, getPayer);
        console.log(PayerLevel);
        getPayer.level = PayerLevel;
        this.client.points.set(`${message.guild.id}-${payer}`, getPayer);
        
        const PayeeLevel = await this.dingUp(message, getPayee);
        console.log(PayeeLevel);
        getPayee.level = PayeeLevel;
        this.client.points.set(`${message.guild.id}-${payee}`, getPayee);

      } else

      if (response === 'no' || response === 'n') {
        message.channel.send('Payment cancelled');
      } 
    } catch (error) {
      console.log(error);
    }
  }

}
module.exports = Social;