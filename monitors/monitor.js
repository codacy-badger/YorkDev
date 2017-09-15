// const slowmode = new Map();
// const ratelimit = 7000;

module.exports = class {

  static run(client, message) {
    this.givePoints(client, message),
      this.checkAFK(client, message),
      // this.mentions(client, message),
      this.antiInvite(client, message);
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


  // // Not ready yet.
  // static mentions(client, message) {
  //   if (message.mentions.users.size === 1 && message.mentions.users.first().bot || !message.guild.member(client.user).hasPermission('BAN_MEMBERS')) return;
  //   try {
  //     let entry = slowmode.get(message.author.id);
  //     if (!entry) {
  //       entry = 0;
  //       slowmode.set(message.author.id, entry);
  //     }
  //     entry += message.mentions.users.size + message.mentions.roles.size;

  //     if (entry > 5) {
  //       message.member.ban({
  //         days: 7,
  //         reason: 'Mention Spam'
  //       }).then(member => {
  //         message.channel.send(`:no_entry_sign: User ${member.displayName} has just been banned for mentioning too many users. :hammer:\nUsers that have been mentioned, we apologize for the annoyance. Please don't be mad!`);
  //       }).catch(error => {
  //         if (error.message === 'Privilege is too low...') throw `I am unable to ban ${message.member.displayName}, either I do not have the \`BAN_MEMBERS\` permission or they have a higher role.`;
  //       });
  //     } else {
  //       setTimeout(() => {
  //         entry -= message.mentions.users.size;
  //         if (entry <= 0) slowmode.delete(message.author.id);
  //       }, ratelimit);
  //     }
  //   } catch (error) {
  //     if (error.message === 'Privilege is too low...') throw `I am unable to ban ${message.member.displayName}, either I do not have the \`BAN_MEMBERS\` permission or they have a higher role.`;
  //     throw error;
  //   }
  // }

  static antiInvite(client, message) {
    if (/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)) {
      message.delete().then(() => {
        let count = 1;
        const spammer = `${message.guild.id}-${message.author.id}`;
        const list = client.invspam.get(spammer) || client.invspam.set(spammer, {
          count: 0
        }).get(spammer);
        if (list) count = list.count + 1;
        if (count >= parseInt(client.settings.get(message.guild.id).inviteLimit)) {
          message.member.ban({
            days: 2,
            reason: 'Automatic ban, invite spam threshold exceeded.'
          }).then((g) => {
            message.channel.send(`${g.user.username} was successfully banned for invite spam`);
            client.invspam.delete(spammer);
          });
        }
        client.invspam.set(spammer, {
          count
        });
      });
      message.reply('your message contained a server invite link, which this server prohibits').then((m) => m.delete(5000));
    }
  }
};