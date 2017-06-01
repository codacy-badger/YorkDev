const Discord = require('discord.js');
const client = new Discord.Client();
client.vote = new Discord.Collection();
client.sql = require('sqlite');
client.sql.open('./tagsbot.sqlite');
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
    log(`Loading Command: ${props.help.name}. ✔`);
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
  let permlvl = 0;
  if (config.ownerId.includes(message.author.id)) return permlvl = 10;
  if (!message.guild) return permlvl;
  if (message.guild) {
    let mod_role = message.guild.roles.find('name', config.modRole);
    if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;

    let admin_role = message.guild.roles.find('name', config.adminRole);
    if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;

    if (message.author.id === message.guild.owner.id) permlvl = 4;
  }
  return permlvl;
};

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err);
});
module.exports = client;
