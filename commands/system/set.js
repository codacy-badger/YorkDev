const Command = require('../../base/Command.js');

class Set extends Command {
  constructor(client) {
    super(client, {
      name: 'set',
      description: 'View or change settings for your server.',
      category: 'System',
      usage: 'set <view/get/edit> <key> <value>',
      extended: 'This command is designed to change per-server-configurations for the guild the command was issued on.',
      hidden: true,
      guildOnly: true,
      aliases: ['setting', 'settings', 'conf'],
      botPerms: [],
      permLevel: 'Administrator'
    });
  }

  async run(message, [action, key, ...value], level) { // eslint-disable-line no-unused-vars
    //     const settings = message.settings;
    //     const defaults = this.client.settings.get('default');

    //     if (action === 'add') {
    //       if (!key) return message.reply('Please specify a key to add');
    //       if (defaults[key]) return message.reply('This key already exists in the settings');
    //       if (value.length < 1) return message.reply('Please specify a value');

    //       defaults[key] = value.join(' ');

    //       this.client.settings.set('default', defaults);
    //       message.reply(`${key} successfully added with the value of ${value.join(' ')}`);
    //     } else
    
    //     if (action === 'edit') {
    //       if (!key) return message.reply('Please specify a key to edit');
    //       if (!defaults[key]) return message.reply('This key does not exist in the settings');
    //       if (value.length < 1) return message.reply('Please specify a new value');

    //       defaults[key] = value.join(' ');

    //       this.client.settings.set('default', defaults);
    //       message.reply(`${key} successfully edited to ${value.join(' ')}`);
    //     } else

    //     if (action === 'del') {
    //       if (!key) return message.reply('Please specify a key to delete.');
    //       if (!defaults[key]) return message.reply('This key does not exist in the settings');
      
    //       const response = await this.client.awaitReply(message, `Are you sure you want to permanently delete ${key}? This **CANNOT** be undone.`);
    //       if (['y', 'yes'].includes(response)) {
    //         delete defaults[key];
    //         this.client.settings.set('default', defaults);
    //         message.reply(`${key} was successfully deleted.`);
    //       } else
      
    //       if (['n','no','cancel'].includes(response)) {
    //         message.reply('Action cancelled.');
    //       }
    //     } else
    
    //     if (action === 'get') {
    //       if (!key) return message.reply('Please specify a key to view');
    //       if (!defaults[key]) return message.reply('This key does not exist in the settings');
    //       message.reply(`The value of ${key} is currently ${settings[key]}`);
    //     } else {
    //       const array = [];
    //       Object.entries(this.client.settings.get(message.guild.id)).forEach(([key, value]) => {
    //         array.push(`${key}${' '.repeat(20 - key.length)}::  ${value}`); 
    //       });
    //       await message.channel.send(`= Settings =
    // ${array.join('\n')}`, {code: 'asciidoc'});
    await message.channel.send(`The settings configuration has been moved to the Dashboard on <${this.client.config.dashboard.callbackURL.split('/').slice(0, -1).join('/')}>`);
    // }
  }
}

module.exports = Set;
