module.exports = (client) => {

  client.supportMsg = (message, msg) => {
    const {RichEmbed} = require('discord.js');
    const embed = new RichEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setDescription(msg)
      .setTimestamp();
    return embed;
  };

  client.checkConsent = async (client, message, msg) => {
    const embed = client.supportMsg(message, msg);
    const validAnswers = ['yes', 'y', 'no', 'n', 'cancel'];
    const consent = client.consent.get(message.author.id);
    const channel = client.guilds.get('351448068257742868').channels.exists('topic', message.author.id);
    if (!consent) client.consent.set(message.author.id, false);
    if (consent && channel) {
      client.channels.find('topic', message.author.id).send({embed}).then(() => message.channel.send('Sent Successfully'));
    } else {
      message.channel.send('```By submitting the support ticket below, you authorise the bot, the bot creator, and other bot support members ("the Staff") to store and use your Username, Discriminator, Message Content, and any other End User Data in matters relative to usage of the bot, record keeping, and support. You also agree not to hold the Staff responsible for any actions that are taken, that also comply with these terms.```\n\nDo you wish to send this message? (**y**es | **n**o)\n\n\nReply with `cancel` to cancel the message. The message will timeout after 60 seconds.\n\n\n', { embed });
      return message.channel.awaitMessages(m => m.author.id === message.author.id, { 'errors': ['time'], 'max': 1, time: 60000 }).then(resp => {
        if (!resp) return;
        resp = resp.array()[0];
        if (validAnswers.includes(resp.content.toLowerCase())) {
          if (resp.content === 'cancel' || resp.content === 'no' || resp.content === 'n') {
            return message.channel.send('Cancelled Message.');
          } else if (resp.content === 'yes' || resp.content === 'y') {
            client.consent.set(message.author.id, true);
            client.guilds.get('351448068257742868').createChannel(message.author.tag.replace('#', '-').toLowerCase(), 'text').then((c) => {
              c.edit({ topic: message.author.id });
              c.send({ embed });
            });
          }
        } else {
          message.channel.send(`Only \`${validAnswers.join('`, `')}\` are valid, please supply one of those.`).catch(() => console.error);
        }
      }).catch(() => {
        console.error;
        message.channel.send('Message timed out.');
      });
    }
  };

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

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};
