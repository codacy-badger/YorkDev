// For dashboard stuff.
// npm install body-parser ejs express express-session hbs helmet marked passport passport-discord
const { Client, Collection } = require('discord.js');
const {readdir} = require('fs-nextra');
const PersistentCollection = require('djs-collection-persistent');
if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');

class YorkDev extends Client {
  constructor(options) {
    super(options);
    this.db = require('./functions/PersistentDB.js');
    this.config = require('./config.json');
    this.settings = new PersistentCollection({name: 'settings'});
    this.blacklist = new PersistentCollection({name: 'blacklist'});
    this.commands = new Collection();
    this.aliases = new Collection();
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
      const props = require(`./commands/${f}`);
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
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    client.log('log', `Loading Event: ${eventName}. ✔`);
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.login(client.config.token);
};

init();
