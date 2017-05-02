exports.run = (client, message, args) => {
  const user = message.mentions.users.first();
  const amount = isNaN(args[0]) ? parseInt(args[1]) : parseInt(args[0]);
  if (!amount && !user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
  if (!amount) return message.reply('Must specify an amount to delete!');
  message.channel.fetchMessages({
    limit: amount,
  }).then((messages) => {
    if (user) {
      const filterBy = user ? user.id : client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }
    message.channel.bulkDelete(messages).catch(error => console.error(error));
  });
};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['prune'],
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'This will delete a given number of messages, supply a user and it will delete a given number of their messages.',
  usage: 'purge [user] <number'
};
