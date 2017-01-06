const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

var cmds = require('./commands.js');

client.login(config.token);

client.on('ready', () => {
  console.log('Ready to go!');
});

client.on('message', message => {
  if (!message.content.startsWith(config.prefix)) return;
  if (message.author.bot) return; 
  let cmdTxt = message.content.split(' ')[0].replace(config.prefix, '').toLowerCase(),
    args = message.content.replace(/ {2,}/g, ' ').split(' ').slice(1);

  let cmd;
  if (cmds.commands.hasOwnProperty(cmdTxt)) {
    cmd = cmds.commands[cmdTxt];
  } else if (cmds.aliases.hasOwnProperty(cmdTxt)) {
    cmd = cmds.commands[cmds.aliases[cmdTxt]];
  }

  if (cmd) {
    if (cmd.hasOwnProperty('permissions')) {
      let missingPerms = [];
      cmd.permissions.forEach(val => {
        if (!message.channel.permissionsFor(client.user).hasPermission(val)) {
          missingPerms.push(cmds.toTitleCase(val.replace('_', ' ')));
        }
      });
      if (missingPerms.length > 0) {
        message.reply(`That command cannot be run without the following Missing Permissions: **${missingPerms}**`).catch(error => console.log(error.stack));
        return;
      }
    }
    try {
      cmd.execute(client, message, args);
      console.log(`${message.author.username} used ${message.content}`);
    } catch (e) {
      message.reply(`command ${cmdTxt} failed :(\n ${e.stack}`).catch(error => console.log(error.stack));
    }
  }
});

let reload = (message) => {
  delete require.cache[require.resolve('./bot_self_commands.js')];
  try {
    cmds = require('./bot_self_commands.js');
  } catch (err) {
    message.reply(`Problem loading bot_self_commands.js: ${err}`).then(
      response => response.delete(1000).catch(error => console.log(error.stack))
    ).catch(error => console.log(error.stack));
    console.log(`Problem loading bot_self_commands.js: ${err}`);
  }
  message.reply('Commands reload was a success!').then(
    response => response.delete(1000).catch(error => console.log(error.stack))
  ).catch(error => console.log(error.stack));
  console.log('Commands reload was a success!');
};
exports.reload = reload;
process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err);
});
