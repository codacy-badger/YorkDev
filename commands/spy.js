exports.run = (client, message, [ugc]) => {
  const util = require('util');
  ugc = util.inspect(ugc, {
    depth: 1
  });
  message.channel.sendCode('xl', clean(client, ugc));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'spy',
  description: 'Spies on a user, guild, or channel',
  usage: '<role:role|msg:msg|user:user|guild:guild|channel:channel>',
  usageDelim: '',
};

function clean(text) {
  if (typeof(text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
}
