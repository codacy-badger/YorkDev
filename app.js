if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');
// For dashboard stuff.
// npm install body-parser ejs express express-passport express-session marked passport passport-discord
const { Client } = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const klaw = require('klaw');
const path = require('path');

class YorkDev extends Client {
  constructor(options) {
    super(options);
    this.db = require('./functions/EnmapDB.js');
    this.config = require('./config.js');
    this.logger = require('./util/Logger.js');
    this.settings = new Enmap({provider: new EnmapLevel({name: 'settings'})});
    // this.whitelist = new Enmap({provider: new EnmapLevel({name: 'whitelist'})});
    this.commands = new Enmap();
    this.aliases = new Enmap();
    this.invspam = new Enmap();
    this.ratelimits = new Enmap();
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

  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(client);
      props.conf.location = commandPath;
      // client.logger.log(`Loading Command: ${props.help.name}. 👌`);
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

  async unloadCommand(commandPath, commandName) {
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
    delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
    return false;
  }
}

const client = new YorkDev({
  fetchAllMembers: true,
  disableEveryone: true,
  disabledEvents:['TYPING_START']
});

require('./functions/utilities.js')(client);

const init = async () => {

  const commandList = [];
  klaw('./commands').on('data', (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== '.js') return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    commandList.push(cmdFile.name);
    if (response) client.logger.error(response);
  }).on('end', () => {
    client.logger.log(`Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.logger.error(error));
  
  const eventList = [];
  klaw('./events').on('data', (item) => {  
    const eventFile = path.parse(item.path);
    if (!eventFile.ext || eventFile.ext !== '.js') return;
    const eventName = eventFile.name.split('.')[0];
    try {
      const event = new (require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(client);    
      eventList.push(event);      
      client.on(eventName, (...args) => event.execute(...args));
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    } catch (error) {
      client.logger.error(`Error loading event ${eventFile.name}: ${error}`);
    }
  }).on('end', () => {
    client.logger.log(`Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.logger.error(error));

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();
