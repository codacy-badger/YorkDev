const Pinned2DM = require(`${process.cwd()}/functions/Pinned2DM.js`);
module.exports = class {
  constructor(client) {
    this.client = client;
    this.pinned2dm = new Pinned2DM(this.client);
  }

  async execute(data) {
    const reaction = data.d;
    const user = await this.client.fetchUser(reaction.user_id).catch(() => null);
    if (user === null) return false;
    const channel = this.client.channels.get(reaction.channel_id);
    if (!channel || channel.type !== 'text' || channel.permissionsFor(this.client.user).has('VIEW_CHANNEL') === false) return false;
    const message = await channel.fetchMessage(reaction.message_id);
    switch (reaction.emoji.name) {

      case '📍':
      case '📌':
        this.pinned2dm.run({user_id: reaction.user_id, user, channel_id: reaction.channel_id, channel, emoji: reaction.emoji, message: message, message_id: reaction.message_id}).catch(e => this.client.logger.error(e));
        break;
    
      default:
        break;
    }
  }
};