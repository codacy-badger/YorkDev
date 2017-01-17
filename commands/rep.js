const sql = require('sqlite');
sql.open('./tagsbot.sqlite');

exports.run = async (client, message) => {
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
    console.log(error);
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
  description: 'Displays a users reputation',
  usage: 'rep <mention>'
};
