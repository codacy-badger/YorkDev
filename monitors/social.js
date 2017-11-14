const timeout = new Map();
function giveRandomPoints(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const PATRONS_ROLE = '272727812614651905';
const PROFICIENTS_ROLE = '260820677756452864';
const EVERYONE_ROLES = ['260202843686830080', '299299274754359296', '327101779625902081'];

async function isMessageSubstantial(message) {
  const text = message.content.toLowerCase(); // everything is case insensitive
  const mentions = message.mentions;

  // Words that might indicate this is a good, substantial message
  // (including native Node modules, like e.g. "path")
  const substantialWords = [
    'the', 'this', 'that', // If you think about it, a lot of insubstantial messages don't have "the", "this", or "that" in them.
    'js', 'javascript', 'node', 'nodejs', 'code', 'pars'/*-e, -ing*/, 'script', 'clojure', 'sql',
    'komada', 'klasa', 'dirigeants', 'discord', 'moment', 'snekfetch', 'dithcord',
    'guide', 'video', 'york', 'evie', 'bot', 'dev', 'git'/*& github*/, 'glitch', 'heroku', 'host', 'vps',
  ].concat(Object.keys(process.binding('natives')));

  // Words that might indicate that this message is lower quality
  const insubstantialWords = ['lol', 'lul', 'lel', 'kek', 'xd', '¯\\_(ツ)_/¯', 'dicksword', 'gus'];

  // The amount of "substance" needed for points to be awarded for this message
  const necessarySubstance = 10;

  // Messages with @everyone or @here pings should never be awarded points
  if (mentions.roles.some(r => EVERYONE_ROLES.includes(r.id))) return false;

  let substance = 0; // An approximation of the amount of "substance" a msg has

  /*
   * Messages at least 6 chars in length will get bonus substance, depending on their length.
   *
   * This formula is based on the minimum necessary points which are needed to get the bonus (6, which is more than 5),
   * so 5 is subtracted from both the numerator and denominator. This fraction is the amount of characters out of the
   * maximum (2000). It is then multiplied by 400, for scale. Lastly, 5 plus a little extra (7 total) is added to make
   * up for subtracting it, at the start.
   *
   * The 400 and 7 are particularly the numbers you want to mess with, if you want to make changes.
   */
  if (text.length > 'lol xD'.length) substance += 400 * ((substance - 5) / 1995) + 7;
  /*
   * Next, calculate the "substance" from the word arrays. Since String#includes is used, the words can be anywhere,
   * even inside of another word.
   */
  // Add each substantial word used in the msg to `substance`
  substance += substantialWords.reduce((num, word) => text.includes(word) ? num + 2 : num, 0);
  // Subtract each insubstantial word used in the msg from `substance`
  substance -= insubstantialWords.reduce((num, word) => text.includes(word) ? num + 1 : num, 0);
  // Someone who pings a lot of people in a message should not be rewarded
  if (mentions.users.size > 0) substance -= mentions.users.size;
  else substance += 2; // a small "substance" bonus
  const member = await message.guild.fetchMember(message.member); // This will need changed for Discord.js v12
  // Patrons and Proficients get a small bonus "substance"
  if (member.roles && member.roles.some(r => [PATRONS_ROLE, PROFICIENTS_ROLE].includes(r.id))) substance += 2;

  // Finally, true is returned if this message has enough substance; false otherwise.
  return substance >= necessarySubstance;
}

exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (message.channel.type !== 'text') return;
  if (!await isMessageSubstantial(message)) return;
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
}; 