const moment = require('moment');
require('moment-duration-format');
module.exports = (client) => {

  client.ratelimit = async (message, level, key, duration) => {
    if (level > 1) return false;
    duration = duration * 1000;
    const ratelimits = client.ratelimits.get(message.author.id) || {};
    if (!ratelimits[key]) ratelimits[key] = Date.now() - duration;
    const differnce = Date.now() - ratelimits[key];
    if (differnce < duration) {
      return moment.duration(duration - differnce).format('D [days], H [hours], m [minutes], s [seconds]', 1);
    } else {
      ratelimits[key] = Date.now();
      client.ratelimits.set(message.author.id, ratelimits);
      return true;
    }
  };


  client.getSettings = (id) => {
    const defaults = client.settings.get('default');
    let guild = client.settings.get(id);
    if (typeof guild != 'object') guild = {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guild[key] ? guild[key] : defaults[key];
    });
    return returnObject;
  };
  
  client.writeSettings = (id, newSettings) => {
    const defaults = client.settings.get('default');
    let settings = client.settings.get(id);
    if (typeof settings != 'object') settings = {};
    for (const key in newSettings) {
      if (defaults[key] !== newSettings[key])  {
        settings[key] = newSettings[key];
      }
    }
    client.settings.set(id, settings);
  };

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get 'precisions' on certain things...

  USAGE

  const response = await client.awaitReply(message, 'Favourite Color?');
  message.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (message, question, limit = 60000, embed = {}) => {
    const filter = m => m.author.id === message.author.id;
    await message.channel.send(question, { embed });
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (error) {
      client.logger.error(error);
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string') text = require('util').inspect(text);
    
    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 

  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  String.prototype.toPlural = function() {
    return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
  };

  Array.prototype.remove = function() {
    var value, a = arguments,
      L = a.length,
      ax;
    while (L && this.length) {
      value = a[--L];
      while ((ax = this.indexOf(value)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  client.wait = require('util').promisify(setTimeout);

  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.error;
    client.logger.error(`Uncaught Promise Error: ${err}`);
  });
};