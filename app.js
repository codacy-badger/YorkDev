// For dashboard stuff.
// npm install body-parser ejs express express-session hbs helmet marked passport passport-discord
const { Client, Collection } = require('discord.js');
const {readdir} = require('fs-nextra');
const Enmap = require('enmap');
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

class YorkDev extends Client {
  constructor(options) {
    super(options);
    this.db = require('./functions/EnmapDB.js');
    this.config = require('./config.json');
    this.settings = new Enmap({name: 'settings', persistent: true});
    this.consent = new Enmap({name: 'consent', persistent: true});
    this.blacklist = new Enmap({name: 'blacklist', persistent: true});
    this.points = new Enmap({name: 'points', persistent: true});
    this.commands = new Collection();
    this.aliases = new Collection();
  }

  permlevel(message) {
    let permlvl = 0;
    if (client.config.ownerId.includes(message.author.id)) return permlvl = 10;
    if (!message.guild || !message.member) return 0;
    try {
      const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
      if (modRole && message.member.roles.has(modRole.id)) permlvl = 2;
    } catch (e) {
      console.log(e);
      console.warn(`modRole (${client.settings.get(message.guild.id).modRole}) not present in guild settings for ${message.guild.name} (${message.guild.id}). Skipping Moderator (level 2) check`);
    }

    try {
      const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
      if (adminRole && message.member.roles.has(adminRole.id)) permlvl = 3;
    } catch (e) {
      console.log(e);
      console.warn(`adminRole (${client.settings.get(message.guild.id).adminRole}) not present in guild settings for ${message.guild.name} (${message.guild.id}). Skipping Administrator (level 3) check`);
    }

    if (message.author.id === message.guild.owner.id) permlvl = 4;
    return permlvl;
  }

  log(type, message, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}]${message}`);
  }

}

const client = new YorkDev({
  messageCacheMaxSize: 1,
  fetchAllMembers: true,
  disabledEvents:['TYPING_START']
});

require('./functions/utilities.js')(client);

const init = async () => {
  const cmdFiles = await readdir('./commands/');
  client.log('log', `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    try {
      const props = new (require(`./commands/${f}`))(client);
      if (f.split('.').slice(-1)[0] !== 'js') return;
      client.log('log', `Loading Command: ${props.help.name}. ✔`);
      client.commands.set(props.help.name, props);
      if (props.init) props.init(client);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (e) {
      client.log(`Unable to load command ${f}: ${e}`);
    }
  });

  const evtFiles = await readdir('./events/');
  client.log('log', `Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.execute(...args));
    client.log('log', `Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.login(client.config.token);
};

init();
