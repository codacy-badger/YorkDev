module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute(message, newMessage) {
    if (message.content === newMessage.content) return;
    if (!message || !message.id || !message.content || !message.guild) return;
    
    const channel = message.guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    channel.send(`📝 ${message.author.tag} (${message.author.id}) : Message Edited in ${message.channel.name}:\n**B**: ${message.cleanContent}\n**N**: ${newMessage.cleanContent}`);
  }
};