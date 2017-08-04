module.exports = (client) => {

  client.permlevel = message => {
    let permlvl = 0;
    if (client.config.ownerId.includes(message.author.id)) return permlvl = 10;
    if (!message.guild || !message.member) return 0;
    try {
      const modRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.modRole.toLowerCase());
      if (modRole && message.member.roles.has(modRole.id)) permlvl = 2;
    } catch (e) {
      console.warn('modRole not present in guild settings. Skipping Moderator (level 2) check');
    }

    try {
      const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === message.settings.adminRole.toLowerCase());
      if (adminRole && message.member.roles.has(adminRole.id)) permlvl = 3;
    } catch (e) {
      console.warn('adminRole not present in guild settings. Skipping Administrator (level 3) check');
    }

    if (message.author.id === message.guild.owner.id) permlvl = 4;
    return permlvl;
  };

  client.log = (type, message, title) => {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}]${message}`);
  };


  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get 'precisions' on certain things...

  USAGE

  const response = await client.awaitReply(message, 'Favourite Color?');
  message.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (message, question, limit = 60000) => {
    const filter = m=>m.author.id = message.author.id;
    await message.channel.send(question);
    try {
      const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  // client.answer = (message, contents, options = {}) => {
  //   options.delay =  (options.delay || 2000);
  //   if (message.flags.includes('delme')) options.deleteAfter = true;
  //   options.deleteAfter = (options.deleteAfter || false);
  //   message.edit(contents);
  //   if (options.deleteAfter) message.delete({timeout: options.delay});
  // };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string')
      text = require('util').inspect(text, {depth: 0});

    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(client.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    return text;
  };


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };

  Array.prototype.remove = function() {
    var value, a = arguments, L = a.length, ax;
    while (L && this.length) {
      value = a[--L];
      while ((ax = this.indexOf(value)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };

  global.wait = require('util').promisify(setTimeout);

  global.range = (count, start = 0) => {
    const myArr = [];
    for (var i = 0; i<count; i++) {
      myArr[i] = i+start;
    }
    return myArr;
  };

  process.on('uncaughtException', (err) => {
    const errormessage = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error('Uncaught Exception: ', errormessage);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};
