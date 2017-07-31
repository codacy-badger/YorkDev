const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const path = require('path');

const { run: reboot } = require('./reboot');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const { stdout, stderr, err } = await exec('git pull https://github.com/YorkAARGH/York-Dev.git', { cwd: path.join(__dirname, '../') }).catch(err => ({ err }));
  if (err) return console.error(err);

  const out = [];
  if (stdout) out.push(stdout);
  if (stderr) out.push(stderr);

  await message.channel.send(out.join('\n'), {code:true});
  return reboot(client, message, args);
};

exports.conf = {
  hidden: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'update',
  description: 'This updates the bot from its git repo.',
  usage: 'update',
  category: 'System'
};
