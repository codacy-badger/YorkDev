if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');
// For dashboard stuff.
// npm install body-parser ejs express express-passport express-session marked passport passport-discord
const { Client } = require('discord.js');
const {readdir} = require('fs-nextra');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

class YorkDev extends Client {
  constructor(options) {
    super(options);
    this.db = require('./functions/EnmapDB.js');
    this.config = require('./config.js');
    this.settings = new Enmap({provider: new EnmapLevel({name: 'settings'})});
    this.consent = new Enmap({provider: new EnmapLevel({name: 'consent'})});
    this.blacklist = new Enmap({provider: new EnmapLevel({name: 'blacklist'})});
    this.points = new Enmap({provider: new EnmapLevel({name: 'points'})});
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

  loadCommand(commandName) {
    try {
      const props = new (require(`./commands/${commandName}`))(client);
      client.log('log', `Loading Command: ${props.help.name}. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`./commands/${commandName}.js`)];
    return false;
  }

}

const client = new YorkDev({
  fetchAllMembers: true,
  disabledEvents:['TYPING_START']
});

require('./functions/utilities.js')(client);

const init = async () => {
  const cmdFiles = await readdir('./commands/');
  client.log('log', `Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith('.js')) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
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
