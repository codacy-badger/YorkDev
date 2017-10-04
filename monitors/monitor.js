const timeout = new Map();
function giveRandomPoints(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = class {

  static run(client, message, level) {
    this.givePoints(client, message, level),
    this.checkAFK(client, message, level),
    this.antiInvite(client, message, level);
  }

  static async isMessageSubstantial(message) {
    const str = message.content.toLowerCase();
    const mentions = message.mentions;
    // If you think about it, a lot of insubstantial messages don't have "the", "this", or "that" in them.
    const substantialWords = [
      'the', 'this', 'that',
      'js', 'javascript', 'node', 'nodejs', 'code', 'pars'/*-e, -ing*/, 'script', 'clojure', 'sql',
      'komada', 'klasa', 'dirigeants', 'discord', 'moment', 'snekfetch', 'dithcord',
      'guide', 'video', 'york', 'evie', 'bot', 'dev', 'git'/*& github*/, 'glitch', 'heroku', 'host', 'vps',
    ].concat(Object.keys(process.binding('natives')));
    const insubstantialWords = ['lol', 'lul', 'lel', 'kek', 'xd', '¯\\_(ツ)_/¯', 'dicksword', 'gus'];
    const necessarySubstance = 10;

    if (mentions.everyone) return false;

    let substance = 0;
    if (str.length > 'lol xD'.length) substance += 400 * ((substance - 5) / 1995) + 7;
    substance += substantialWords.reduce((num, word) => str.includes(word) ? num + 2 : num, 0);
    substance -= insubstantialWords.reduce((num, word) => str.includes(word) ? num + 1 : num, 0);
    if (mentions.users.size > 0) substance -= mentions.users.size;
    else substance += 2;
    const member = await message.guild.fetchMember(message.member);
    if (member.roles && member.roles.some(r => ['272727812614651905', '260820677756452864'].includes(r.id))) substance += 2;
    return substance >= necessarySubstance;
  }

  static async givePoints(client, message, level) { // eslint-disable-line no-unused-vars
    if (message.channel.type !== 'text') return;
    if (!await this.isMessageSubstantial(message)) return;
    const settings = message.settings;
    if (message.content.startsWith(settings.prefix) || message.content.startsWith('docs, ')) return;
    const score = client.points.get(`${message.guild.id}-${message.author.id}`) || { points: 200, level: 1, user: message.author.id, guild: message.guild.id, daily: 1504120109 };
    const timedOut = timeout.get(`${message.guild.id}-${message.author.id}`);
    if (timedOut) return;
    timeout.set(`${message.guild.id}-${message.author.id}`, true);
    const points = giveRandomPoints(parseInt(settings.minPoints), parseInt(settings.maxPoints));
    setTimeout(() => {
      timeout.set(`${message.guild.id}-${message.author.id}`, false);
      score.points += points;
      console.log(`Awarded ${points} to ${message.author.username}`);
    }, parseInt(settings.scoreTime) * 60 * 1000);

    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
    if (score.level < curLevel) {
      if (settings.levelNotice === 'true')
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
      score.level = curLevel;
    }
    client.points.set(`${message.guild.id}-${message.author.id}`, score);
  }

  static checkAFK(client, message, level) { // eslint-disable-line no-unused-vars
    if (!message.guild) return;
    const settings = client.settings.get(message.guild.id);
    const person = message.mentions.members.first();
    if (!person) return;
    if (person.id !== client.config.ownerID) return;
    if (settings.afk === 'true') {
      message.reply(`${person.displayName} ${settings.afkMessage}`);
    }
  }

  static antiInvite(client, message, level) {
    if (level > 0) return;
    if (/(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(message.content)) {
      message.delete().then(() => {
        let count = 1;
        const spammer = `${message.guild.id}-${message.author.id}`;
        const list = client.invspam.get(spammer) || client.invspam.set(spammer, { count: 0 }).get(spammer);
        if (list) count = list.count + 1;
        if (count >= parseInt(client.settings.get(message.guild.id).inviteLimit)) {
          message.member.ban({ days: 2, reason: 'Automatic ban, invite spam threshold exceeded.' }).then((g) => {
            message.channel.send(`${g.user.username} was successfully banned for invite spam`);
            client.invspam.delete(spammer);
          });
        }
        client.invspam.set(spammer, { count });
      });
      message.channel.send(`${message.author} |\`⛔\`| Your message contained a server invite link, which this server prohibits.`);
    }
  }
};
