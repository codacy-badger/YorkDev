const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const moment = require('moment');
const fs = require('fs');
require('./util/eventLoader')(client);

client.login(config.token);
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading Command: ${props.help.name}. 👌`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });

      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
  let permlvl = 0;
  // Mod
  let mod_role = message.guild.roles.find('name', config.modRole);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  // Super Mod
  let super_mod_role = message.guild.roles.find('name', config.superModRole);
  if (super_mod_role && message.member.roles.has(super_mod_role.id)) permlvl = 3;
  // Admin
  let admin_role = message.guild.roles.find('name', config.adminRole);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 4;
  if (message.author.id === config.ownerId) permlvl = 10;
  return permlvl;
};

process.on('unhandledRejection', error => {
  console.error(`Uncaught Promise Error: ${error}`);
});
