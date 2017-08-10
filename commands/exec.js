const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
exports.run = async function(client, message, args) {

  const response = await exec(args.join(' '));
  if (response.length > 2000) {
    client.sendError(response);
  }
  await message.channel.send(response);
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
