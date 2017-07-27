exports.run = async (client, message, args, level) => {
  const settings = client.settings.get('message.guild.id');
  if (!args[0] && !message.flags.length) message.flags.push('list');

  if (!message.flags.length) {
    const [name, ...msg] = args;
    if (!this.db.has(name)) return message.channel.send(`The example \`${name}\` does not exist. Use \`${settings.prefix}examples -help\` for help.`);
    const example = this.db.get(name).contents;
    return message.channel.send(`${msg.join(' ')}${example}`);
  }

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
    const response = await this.db[message.flags[0]](name, data);
    message.channel.send(response);
  } catch (e) {
    console.log(e);
  }
};

exports.init = client => {
  this.db = new client.db(client, 'examples');
  this.db.extendedHelp = this.help.extended;
  client.examples = this.db;
};

exports.conf = {
  hidden: false,
  aliases: ['ex', 'examples'],
  permLevel: 0
};

exports.help = {
  name: 'example',
  description: 'Displays an example.',
  usage: 'example <action> [examplename] <contents> (use -help action to show additional help)',
  category: 'Support',
  extended: `\`\`\`
  -add newExampleName This is your new example contents
  -del exampleName
  -edit existingExampleName This is new example edited contents
  -list\`\`\``
};
