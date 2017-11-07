module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute(message) {
    if (!message || !message.id || !message.content || !message.guild) return;
    const channel = message.guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    channel.send(`🗑 ${message.author.tag} (${message.author.id}) : Message Deleted in ${message.channel.name}:\n${message.cleanContent}`);
  }

};
