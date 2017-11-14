const moment = require('moment');
module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute(member) {
    const guild = member.guild;
    if (!member.user.bot) this.client.points.delete(`${guild.id}-${member.id}`);
    if (!member || !member.id || !guild) return;
    try {
     
      const channel = guild.channels.find('name', 'raw-logs');
      if (!channel) return;
      const fromNow = moment(member.joinedTimestamp).fromNow();
      channel.send(`📤 ${member.user.tag} (${member.user.id}) left, they had joined: ${fromNow}`);
      
    } catch (error) {
      console.log(error);
    }

  }
};