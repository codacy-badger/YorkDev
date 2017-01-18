const config = require('../config.json');
const sql = require('sqlite');
const moment = require('moment');
require('moment-duration-format');
sql.open('./tagsbot.sqlite');

exports.run = async (client, message, args) => {
  let type = args[0];
  if (type !== '++' && type !== '--') return message.reply('Invalid reputation type, please supply either `++` or `--`');
  let reason = args.splice(2, args.length).join(' ');
  if (reason.length < 1) return message.reply('you must give a reason for the reputation.');
  let user = message.mentions.users.size > 0 ? message.mentions.users.first() : message.author;
  let userId = user.id;
  if (userId === message.author.id) return message.reply('You cannot give yourself reputation.');
  if (user.bot) return message.reply('You cannot give bots reputation.');
  addRep(client, message, userId, message.guild.id, message.author.id, type, reason);
};

async function addRep(client, message, awardee, guildid, awarder, type, reason) {
  var goodrep = 0;
  var badrep = 0;
  if (type === '++') {
    goodrep = 1;
    type = '+';
  } else {
    badrep = 1;
    type ='-';
  }
  try {
    const rows = await sql.get(`SELECT time FROM reputations WHERE awarder=${awarder} AND awardeeid=${awardee} ORDER BY time DESC LIMIT 1;`);
    if (rows.time + config.cooldown * 1000 * 60 * 60 > message.createdTimestamp) return message.reply(`You cannot rep this user for another ${moment.duration(message.createdTimestamp - rows.time + config.cooldown * 1000 * 60 * 60).format('d[ days], h[ hours], m[ minutes, and ]s[ seconds]')}`);
  } catch (error) {
    console.log(`Ignore me: ${error}`);
  }

  try {
    await sql.run('INSERT INTO reputations (guildid, awardeeid, goodrep, badrep, awarder, rawuser, type, reason, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [guildid, awardee, goodrep, badrep, awarder, client.users.get(awarder).username + '#' + client.users.get(awarder).discriminator, type, reason, Date.now()]);
    await message.reply(`you gave ${type}1 reputation to ${client.users.get(awardee).username}#${client.users.get(awardee).discriminator} ${reason}`);
  } catch(error){
    console.log(error);
  }
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'addrep',
  description: 'Give a user either a positive (++) or a negative (--) reputation.',
  usage: 'addrep <type> <mention> <reason>'
};
