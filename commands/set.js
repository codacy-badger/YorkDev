const { inspect } = require('util');
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  const settings = client.settings.get(message.guild.id);

  if (action === 'edit') {
    if (!key) return message.reply('Please specify a key to edit');
    if (!settings[key]) return message.reply('This key does not exist in the settings');
    if (!value) return message.reply('Please specify a new value');

    settings[key] = value.join(' ');

    client.settings.set(message.guild.id, settings);
    message.channel.send(`${key} successfully edited to ${value.join(' ')}`);
  } else
  if (action === 'get') {
    if (!key) return message.reply('Please specify a key to view');
    if (!settings[key]) return message.reply('This key does not exist in the settings');
    message.channel.send(`The value of ${key} is currently "\`${settings[key]}\`"`);
  } else {
    message.channel.send(inspect(settings), {code: 'json'});
  }
};

exports.conf = {
  hidden: false,
  guildOnly: true,
  aliases: ['setting', 'settings', 'conf'],
  permLevel: 3
};

exports.help = {
  name: 'set',
  category: 'System',
  description: 'View or change settings for your server.',
  usage: 'set <view/get/edit> <key> <value>',
  extended: 'This command is designed to change per-server-configurations for the guild the command was issued on.'
};
