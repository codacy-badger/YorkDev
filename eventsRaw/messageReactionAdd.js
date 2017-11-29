// const Starboard = require('../functions/Starboard.js');
const Pinned2DM = require('../functions/Pinned2DM.js');
const Inspect = require('../functions/linting/Inspect.js');
module.exports = class {
  constructor(client) {
    this.client = client;
    // this.starboard = new Starboard(this.client);
    this.pinned2dm = new Pinned2DM(this.client);
    this.inspect = new Inspect(this.client);
  }

  async execute(data) {
    const reaction = data.d;
    const user = await this.client.fetchUser(reaction.user_id).catch(() => null);
    if (user === null) return false;
    const channel = this.client.channels.get(reaction.channel_id);
    if (!channel || channel.type !== 'text' || channel.permissionsFor(this.client.user).has('VIEW_CHANNEL') === false) return false;
    const message = await channel.fetchMessage(reaction.message_id);
    switch (reaction.emoji.name) {

      case '🔍':
        this.inspect.run({channel_id: reaction.channel_id, channel, message: message, message_id: reaction.message_id}).catch(e => console.log(e));
        break;

      // case '✡':
      // case '⭐':
      //   this.starboard.run({user_id: reaction.user_id, user, channel_id: reaction.channel_id, channel, emoji: reaction.emoji, message: message, message_id: reaction.message_id}).catch(e => console.log(e));
      //   break;
    
      case '📍':
      case '📌':
        this.pinned2dm.run({user_id: reaction.user_id, user, channel_id: reaction.channel_id, channel, emoji: reaction.emoji, message: message, message_id: reaction.message_id}).catch(e => console.log(e));
        break;
    
      default:
        break;
    }
  }
};