exports.run = (client, message, args = []) => {
  let code = args.join(' ');
  try {
    let evaled = eval(code);
    if (typeof evaled !== 'string')
      evaled = require('util').inspect(evaled, {depth: 0});
    message.channel.sendCode('xl', clean(evaled.toString().replace(client.token, 'Redacted')), {split:true}).catch(console.error);
  } catch (error) {
    console.error(error);
    message.channel.sendCode('xl', `ERROR\n${clean(error)}`);
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
