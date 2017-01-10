exports.run = (client, msg, params) => {
  if (!params[0]) {
    msg.channel.sendCode('asciidoc', `= Command List =\n\n[Use ?help <commandname> for details]\n\n${client.commands.map(c=>`${c.help.name}:: ${c.help.description}`).join('\n')}`);
  } else {
    let command = params[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      msg.channel.sendCode('asciidoc', `= ${command.help.name} = \n${command.help.description}\nusage::${command.help.usage}`);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: 0
};

exports.help = {
  name: 'help',
  description: 'Displays all the available commands for your permission level.',
  usage: 'help [command]'
};
