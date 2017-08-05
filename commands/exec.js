const exec = require('child_process').exec;
exports.run = function(client, message, args) {
  exec(`${args.join(' ')}`, (error, stdout) => {
    const response = (error || stdout);
    message.edit(`Ran: ${message.content}\n\`\`\`${response}\`\`\``, {split: true})
      // .then(m => m.delete(30000))
      .catch(console.error);
  });
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['restart'],
  permLevel: 10
};

exports.help = {
  name: 'exec',
  description: 'executes a new process, very dangerous',
  usage: 'exec <expression>',
  category: 'System',
  extended: 'This will spawn a child process and execute the given command.'
};
