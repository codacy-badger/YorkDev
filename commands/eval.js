exports.run = (client, message, args = []) => {
  var code = args.join(' ');
  try {
    var evaled = eval(code);
    if (typeof evaled !== 'string')
      evaled = require('util').inspect(evaled);
    message.channel.sendCode('xl', clean(evaled.toString().replace(client.token, 'Redacted')), {split:true}).catch(console.error);
  } catch (err) {
    console.log(err);
    message.channel.sendCode('xl', `ERROR\n${clean(err)}`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ev'],
  permLevel: 10
};

exports.help = {
  name: 'eval',
  description: 'Evaluates arbitrary Javascript. Not for the faint of heart, expression may contain multiple lines. Oh and **you** can\'t use it.',
  usage: 'eval <expression>'
};

function clean(text) {
  if (typeof(text) === 'string') {
    return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
  } else {
    return text;
  }
}
