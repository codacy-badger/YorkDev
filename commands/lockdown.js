const ms = require('ms');
module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['ld'],
      permLevel: 2
    };

    this.help = {
      name: 'lockdown',
      description: 'Locks the channel for a set duration.',
      usage: 'lockdown <duration>',
      category:'Moderation',
      extended: 'This command will prevent the \'@everyone\' role from speaking in the locked channel, this is designed with raids and spam attacks in mind.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!this.client.lockit) this.client.lockit = [];
    const time = args.join(' ');
    const validUnlocks = ['release', 'unlock'];
    if (!time) return message.reply('You must set a duration for the lockdown in either hours, minutes or seconds');
    if (validUnlocks.includes(time)) {
      await message.channel.overwritePermissions(message.guild.id, {SEND_MESSAGES: null});
      await message.channel.send('Lockdown lifted.');
      clearTimeout(this.client.lockit[message.channel.id]);
      delete this.client.lockit[message.channel.id];
    } else {
      await message.channel.overwritePermissions(message.guild.id, {SEND_MESSAGES: false});
      await message.channel.send(`Channel locked down for ${ms(ms(time), { long:true })}`);
      this.client.lockit[message.channel.id] = await timeOut(ms(time));
      await message.channel.overwritePermissions(message.guild.id, {SEND_MESSAGES: null});
      await message.channel.send('Lockdown lifted.');
      delete this.client.lockit[message.channel.id];
    }
  }
};

function timeOut(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
