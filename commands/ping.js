exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const msg = await message.channel.send('🏓 Ping!');
    msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(client.ping)}ms.)`);
  } catch (e) {
    console.log(e);
  }
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['pong'],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Latency and API response times.',
  usage: 'ping',
  category:'General',
  extended: 'This command is a response test, it helps gauge if there is any latency (lag) in either the bots connection, or the API.'
};
