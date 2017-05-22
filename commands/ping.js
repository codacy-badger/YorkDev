exports.run = async (client, message) => {
  try {
    let msg = await message.channel.send('🏓 Ping!');
    msg.edit(`🏓 Pong! (Roundtrip took: ${msg.createdTimestamp - message.createdTimestamp}ms. 💙: ${Math.round(client.ping)}ms.)`);
  } catch (e) {
    console.log(e);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ping',
  description: 'Latency and API response times.',
  usage: 'ping',
  category:'General',

};
