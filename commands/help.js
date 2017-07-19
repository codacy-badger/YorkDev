const config = require('../config.json');
exports.run = async (client, message, params) => {
  const permission = client.elevation(message);
  if (!params[0]) {
    const myCommands = client.commands.filter(cmd => cmd.conf.permLevel <= permission && cmd.conf.hidden !== true);
    const commandNames = myCommands.keyArray();
    const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
    let currentCategory = '';
    let output = `= Command List =\n\n[Use ${config.prefix}help <commandname> for details]\n\n`;
    const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);
    sorted.forEach(c => {
      if (currentCategory !== c.help.category) {
        output += `== ${c.help.category}\n`;
        currentCategory = c.help.category;
      }
      output += `${config.prefix}${c.help.name}${' '.repeat(longest - c.help.name.length)} :: ${c.help.description}\n`;
    });
    message.channel.send(output, { code:'asciidoc' });
  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}`, { code:'asciidoc' });
    }
  }
};

exports.conf = {
  hidden: true,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]',
  category: 'Support'
};
