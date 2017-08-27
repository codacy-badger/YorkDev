exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.guild) return message.reply('This command can only be used in DM\'s');
  const msg = args.join(' ');
  try {
    client.checkConsent(client, message, msg);
  } catch (e) {
    if (e.message === 'Cannot send messages to this user') {
      await message.channel.send(`I cannot send that message ${message.author.username}, as it appears they may have **Direct Messages's** disabled.`);
    } else {
      console.log(e);
    }
  }
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['dm', 'contact'],
  permLevel: 0
};

exports.help = {
  name: 'support',
  description: 'Contact Bot Support',
  usage: 'support <message>',
  category: 'System',
  extended: 'This command will forward your Support DM to the Support Guild, your consent is **required** to use this command.'
};
