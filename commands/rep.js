const config = require('../config.json');
const sql = require('sqlite');
const moment = require('moment');
require('moment-duration-format');
sql.open('./tagsbot.sqlite');

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
    console.error(error);
  }
}

exports.run = async (client, message, args) => {
  if (args.length < 2) {
    try {
      let user = message.mentions.users.size > 0 ? message.mentions.users.first() : message.author;
      let userId = user.id;
      const rows = await sql.all('SELECT * FROM reputations WHERE awardeeid =?', user.id);
      if (rows.filter(u => u.awardeeid == userId).length > 0) {
        let goodreps = rows.filter(rep => rep.guildid == message.guild.id).map(rep => rep.goodrep).reduce((a, b) => a + b);
        let badreps = rows.filter(rep => rep.guildid == message.guild.id).map(rep => rep.badrep).reduce((a, b) => a + b);
        let result = [];
        result.push(`${client.users.get(userId).username}#${client.users.get(userId).discriminator} has a total reputation score of ${goodreps - badreps} ( +${goodreps} / -${badreps} )`);
        rows.filter(rep => rep.guildid == message.guild.id).map(rows => {
          result.push(`(${rows.type}) ${rows.rawuser}: ${rows.reason}`);
        });
        message.channel.sendCode('', result);
      } else {
        message.channel.sendMessage(`Could not find any reputation for **${user.username}**.`);
      }
    } catch (error) {
      console.error(error);
    }
  } else {
    let type = args[0];
    if (type !== '++' && type !== '--') return message.reply('Invalid reputation type, please supply either `++` or `--`');
    let reason = args.splice(2, args.length).join(' ');
    if (reason.length < 1) return message.reply('you must give a reason for the reputation.');
    let user = message.mentions.users.size > 0 ? message.mentions.users.first() : message.author;
    let userId = user.id;
    if (userId === message.author.id) return message.reply('You cannot give yourself reputation.');
    if (user.bot) return message.reply('You cannot give bots reputation.');
    addRep(client, message, userId, message.guild.id, message.author.id, type, reason);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'rep',
  description: 'Displays or adds to a users reputation.',
  usage: 'rep <mention> / rep <type> <mention> <reason>'
};
