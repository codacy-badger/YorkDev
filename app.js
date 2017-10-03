// For dashboard stuff.
// npm install body-parser ejs express express-passport express-session marked passport passport-discord
const { Client } = require('discord.js');
const {readdir} = require('fs-nextra');
const Enmap = require('enmap');
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

class YorkDev extends Client {
  constructor(options) {
    super(options);
    this.db = require('./functions/EnmapDB.js');
    this.config = require('./config.js');
    this.settings = new Enmap({name: 'settings', persistent: true});
    this.consent = new Enmap({name: 'consent', persistent: true});
    this.blacklist = new Enmap({name: 'blacklist', persistent: true});
    this.points = new Enmap({name: 'points', persistent: true});
    this.commands = new Enmap();
    this.aliases = new Enmap();
    this.invspam = new Enmap();
  }

  permlevel(message) {
    let permlvl = 0;
    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  log(type, message, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}]${message}`);
  }

  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

}

const client = new YorkDev({
  fetchAllMembers: true,
  disabledEvents:['TYPING_START']
});

console.log(client.config.permLevels.map(p=>`${p.level} : ${p.name}`));

require('./functions/utilities.js')(client);

const init = async () => {
  const cmdFiles = await readdir('./commands/');
  client.log('log', `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    try {
      const props = new (require(`./commands/${f}`))(client);
      if (f.split('.').slice(-1)[0] !== 'js') return;
      client.log('log', `Loading Command: ${props.help.name}. ✔`);
      if (props.init) props.init(client);
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
    } catch (error) {
      client.log(`Unable to load command ${f}: ${error}`);
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

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();
