exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
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
  description: 'It purges between 2 and 99 messages.',
  usage: 'purge [user] <number',
  category:'Moderation'
};
