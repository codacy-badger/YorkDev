exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const user = message.channel.name;
  const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
  if (!match) return message.channel.send('Not a valid support channel.');
  const id = match[1];
  const target = await client.fetchUser(id);
  const msg = args.join(' ');
  const embed = client.supportMsg(message, msg);
  try {
    target.send({embed});
  } catch (e) {
    if (e.message === 'Cannot send messages to this user') {
      await message.channel.send(`I cannot send that message ${message.author.username}, as it appears they may have **Direct Messages's** disabled.`);
    } else {
      console.log(e);
    }
  }
};

exports.conf = {
  hidden: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'reply',
  description: 'Support use only',
  usage: 'reply <message>',
  category: 'System',
  extended: 'Responds to a support channel.'
};
