module.exports = (client) => {

  client.supportMsg = (message, msg) => {
    const {
      RichEmbed
    } = require('discord.js');
    const embed = new RichEmbed()
      .setAuthor(message.author.username, message.author.displayAvatarURL)
      .setDescription(msg)
      .setTimestamp();
    return embed;
  };

  client.checkConsent = async (client, message, msg) => {
    const embed = client.supportMsg(message, msg);
    const agree = ['yes', 'y'];
    const disagree = ['no', 'n', 'cancel'];
    const consent = client.consent.get(message.author.id);
    const channel = client.guilds.get('351448068257742868').channels.exists('topic', message.author.id);
    if (!consent) client.consent.set(message.author.id, false);
    if (consent && channel) {
      client.channels.find('topic', message.author.id).send({
        embed
      }).then(() => message.channel.send('Sent Successfully'));
    } else {

      const response = await client.awaitReply(message, '```By submitting the support ticket below, you authorise the bot, the bot creator, and other bot support members ("the Staff") to store and use your Username, Discriminator, Message Content, and any other End User Data in matters relative to usage of the bot, record keeping, and support. You also agree not to hold the Staff responsible for any actions that are taken, that also comply with these terms.```\n\nDo you wish to send this message? (**y**es | **n**o)\n\n\nReply with `cancel` to cancel the message. The message will timeout after 60 seconds.\n\n\n', 60000, embed);
      if (agree.includes(response)) {
        client.consent.set(message.author.id, true);
        const channel = (await client.guilds.get('351448068257742868').createChannel(message.author.tag.replace('#', '-').toLowerCase(), 'text')).setTopic(message.author.id).then(c => { // eslint-disable-line no-unused-vars
          c.send({
            embed
          });
          message.channel.send('Support channel opened.');
        });
      } else

      if (disagree.includes(response)) {
        message.channel.send('Cancelled message.');
      } else {
        message.channel.send('That is not a valid answer');
      }
    }
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
    await message.channel.send(question, {
      embed
    });
    try {
      const collected = await message.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ['time']
      });
      return collected.first().content;
    } catch (error) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == 'Promise')
      text = await text;
    if (typeof evaled !== 'string')
      text = require('util').inspect(text, {
        depth: 1
      });

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

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require('util').promisify(setTimeout);

  process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
  });
};