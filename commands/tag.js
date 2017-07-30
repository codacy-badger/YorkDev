exports.run = async (client, message, args, level) => {
  const settings = client.settings.get('message.guild.id');
  if (!args[0] && !message.flags.length) message.flags.push('list');

  if (!message.flags.length) {
    const [name, ...msg] = args;
    if (!this.db.has(name)) return message.channel.send(`The tag \`${name}\` does not exist. Use \`${settings.prefix}tags -help\` for help.`);
    const tag = this.db.get(name).contents;
    return message.channel.send(`${msg.join(' ')}${tag}`);
  }

  if (message.flags[0] === 'list') return message.channel.send(this.db.list());
  if (level < 2) return;

  const [name, ...extra] = args;

  let data = null;
  switch (message.flags[0]) {
    case ('add') :
      data = {contents: extra.join(' ')};
      break;
    default :
      data = extra.join(' ');
  }

  try {
    let response = await this.db[message.flags[0]](name, data);
    response < 1 ? response = 'There appears to be no tags saved at this time.' : response;
    message.channel.send(response);
  } catch (e) {
    console.log(e);
  }
};

exports.init = client => {
  this.db = new client.db(client, 'tags');
  this.db.extendedHelp = this.help.extended;
  client.tags = this.db;
};

exports.conf = {
  hidden: false,
  aliases: ['t', 'tags'],
  permLevel: 0
};

exports.help = {
  name: 'tag',
  description: 'Show or modify tags.',
  category: 'Support',
  usage: 'tag <action> [tagname] <contents> (use -help action to show additional help)',
  extended: `\`\`\`
  -add newTagName This is your new tag contents
  -del tagName
  -edit existingtagName This is new new edited contents
  -list\`\`\``
};
