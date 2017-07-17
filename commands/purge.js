exports.run = (client, message) => {
  const user = message.mentions.users.first();
  const amount = isNaN(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1]);
  if (!amount) if (!user) return message.reply('Must specify a user and amount, or just an amount, of messages to purge!');
  else return message.reply('Must specify an amount to delete!');
  if (amount > 100 && amount < 2) return message.reply('The amount must be between 2 to 100.');
  message.channel.fetchMessages({
    limit: amount,
  }).then(messages => {
    const filterBy = user ? user.id : client.user.id;
    messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  });
};
exports.conf = {
  hidden: false,
  aliases: ['prune'],
  permLevel: 2
};

exports.help = {
  name: 'purge',
  description: 'This will delete a given number of messages, supply a user and it will delete a given number of their messages.',
  usage: 'purge [user] <number',
  category:'Moderation'
};
