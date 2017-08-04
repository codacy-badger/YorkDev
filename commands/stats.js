const { version } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  // const guilds = (await client.shard.broadcastEval('this.guilds.size'));//.reduce((a, b) => a + b, 0);
  // console.log(guilds);
  const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
  message.channel.send(`= STATISTICS =
• Mem Usage  :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime     :: ${duration}
• Users      :: ${client.users.size.toLocaleString()}
• Servers    :: ${client.guilds.size.toLocaleString()}
• Channels   :: ${client.channels.size.toLocaleString()}
• Discord.js :: v${version}
• Node       :: ${process.version}`, {code: 'asciidoc'});
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['system', 'usage'],
  permLevel: 0
};

exports.help = {
  name: 'stats',
  category: 'General',
  description: 'Gives some useful bot statistics.',
  usage: 'stats',
  extended: 'This command will display system stats such as memory used, uptime and version.'
};
