class Pinned2DM {
  constructor(client) {
    this.client = client;
  }
  
  async run(data) {
    const channel = data.channel;
    const message = data.message;
    const user = data.user;
    const attachment = message.attachments.first() ? { files: [{ attachment: message.attachments.first().url, name: message.attachments.first().filename }] } : null;
    if (channel.type !== 'text') return null;
    try {
      const author = user;
      const member = message.guild.member(author);
      const msg = { author:author, member:member, guild: message.guild, client: this.client, channel: message.channel };
      if (this.client.permlevel(msg) > 2)
        await message.pin();
      else
        await user.send(`Here is the message you pinned:\n\`\`\`${message.cleanContent}\`\`\``, attachment);
    } catch (error) {
      if (error.message === 'Cannot send messages to this user') {
        await message.channel.send(`I cannot send you that message ${user}, as it appears you have **Direct Messages's** disabled.`);
      } else {
        throw error;
      }
    }
  }
}
module.exports = Pinned2DM;