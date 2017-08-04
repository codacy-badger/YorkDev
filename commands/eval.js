exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const code = args.join(' ');
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
    console.log(clean);
  } catch (err) {

    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['ev'],
  permLevel: 10
};

exports.help = {
  name: 'eval',
  description: 'Evaluates arbitrary Javascript.',
  usage: 'eval <expression>',
  category:'System',
  extended: 'This is an extremely dangerous command, use with caution and never eval stuff strangers tell you.'
};
