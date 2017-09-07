module.exports = class {
  
  static run(client, message) {
    this.givePoints(client, message),
    this.checkAFK(client,message);
  }
    
  static givePoints(client, message) {
    const settings = client.settings.get(message.guild.id);
    if (message.content.startsWith(settings.prefix) || message.channel.type !== 'text') return;
    const score = client.points.get(`${message.guild.id}-${message.author.id}`) || { points: 0, level: 0, user: message.author.id, guild: message.guild.id, daily: 1504120109 };
    score.points++;
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      if (settings.levelNotice === 'true')
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
      score.level = curLevel;
    }
    client.points.set(`${message.guild.id}-${message.author.id}`, score);
  }
  
  static checkAFK(client, message) {
    if (!message.guild) return;
    const settings = client.settings.get(message.guild.id);
    const person = message.mentions.members.first();
    if (!person) return;
    const mention = client.config.ownerId.includes(person.id);
    if (!mention) return;
    if (settings.afk === 'true') {
      message.reply(`${person.displayName} ${settings.afkMessage}`);
    }
  }
};