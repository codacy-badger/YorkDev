class Command {
  constructor(client, {
    name = null,
    description = 'No description provided.',
    category = 'General',
    usage = 'No usage provided.',
    extended = 'No information provided.',
    cost = 0,
    cooldown = 0,
    hidden = false,
    guildOnly = false,
    aliases = [],
    botPerms = [],
    permLevel = 'User',
    location = ''
  }) {
    this.client = client;
    this.help = {
      name,
      description,
      category,
      usage,
      extended,
      cost
    };
    this.conf = {
      hidden,
      guildOnly,
      aliases,
      botPerms,
      permLevel,
      location,
      cooldown
    };
  }

  async verifyUser(message, user) {
    try {
      const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
      if (!match) message.error(undefined, 'Invalid user');
      const id = match[1];
      const check = await this.client.fetchUser(id, true);
      if (check.username !== undefined) return check;
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async verifyMember(message, member) {
    const user = await this.verifyUser(message, member);
    const target = await message.guild.fetchMember(user);
    return target;
  }

  async verifyMessage(message, msgid) {
    try {
      const match = /([0-9]{17,20})/.exec(msgid);
      if (!match) message.error(undefined, 'Invalid message id.');
      const id = match[1];
      const check = await message.channel.fetchMessage(id);
      if (check.cleanContent !== undefined) return id;
    } catch (error) {
      this.client.logger.error(error);
    }
  }

  async verifyChannel(message, chanid) {
    try {
      const match = /([0-9]{17,20})/.exec(chanid);
      if (!match) return message.channel.id;
      const id = match[1];
      const check = await message.guild.channels.get(id);
      if (check.name !== undefined && check.type === 'text') return id;
    } catch (error) {
      this.client.logger.error(error);
    }
  }
  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.error(new Error(`Command ${this.constructor.name} doesn't provide a run method.`)); 
  }
}
module.exports = Command;