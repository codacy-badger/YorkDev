const config = require('../config.json');
const prefix = new RegExp(`^\\${config.prefix}`);
var cmds = require('../commands.js');

module.exports = message => {
  let client = message.client;
  if (message.author.bot || !message.content.startsWith(config.prefix)) return;
  const args = [];
  const unprefixed = message.content.replace(prefix, '');

  let match;
  const re = /\S+/g;
  while ((match = re.exec(unprefixed)) !== null) args.push(match[0]);

  const cmdTxt = args.shift();

  let cmd;
  if (cmds.commands.hasOwnProperty(cmdTxt)) {
    cmd = cmds.commands[cmdTxt];
  } else if (cmds.aliases.hasOwnProperty(cmdTxt)) {
    cmd = cmds.commands[cmds.aliases[cmdTxt]];
  } else {
    return;
  }

  if (cmd.hasOwnProperty('permissions')) {
    let missingPerms = [];
    for (const val of cmd.permissions) {
      if (!message.channel.permissionsFor(client.user).hasPermission(val)) {
        missingPerms.push(cmds.toTitleCase(val.replace('_', ' ')));
      }
    }
    if (missingPerms.length > 0) {
      return message.reply(`That command cannot be run without the following Missing Permissions: **${missingPerms}**`).catch(error => console.error(error.stack));
    }
  }
  try {
    cmd.execute(client, message, args);
    console.log(`${message.author.username} used ${message.content}`);
  } catch (e) {
    message.reply(`command ${cmdTxt} failed :(\n ${e.stack}`).catch(error => console.error(error.stack));
  }
};

let reload = (message) => {
  delete require.cache[require.resolve('../commands.js')];
  try {
    cmds = require('../commands');
  } catch (err) {
    message.reply(`Problem loading commands.js: ${err}`).then(
      response => response.delete(1000)
    ).catch(error => console.log(error.stack));
    console.log(`Problem loading commands.js: ${err}`);
    return;
  }
  message.reply('Commands reload was a success!').then(
    response => response.delete(1000)
  ).catch(error => console.error(error.stack));
  console.log('Commands reload was a success!');
};
exports.reload = reload;
