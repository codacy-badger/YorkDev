exports.run = (client, message) => {
  message.channel.sendMessage('This is an example command');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'excmd',
  description: 'This is an example command',
  usage: 'excmd'
};
