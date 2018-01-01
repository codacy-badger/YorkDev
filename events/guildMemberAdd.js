const moment = require('moment');
module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute(member) {
    if (!member || !member.id || !member.guild) return;
    const guild = member.guild;
    
    const channel = guild.channels.find('name', 'raw-logs');
    if (!channel) return;
    
    const fromNow = moment(member.user.createdTimestamp).fromNow();
    const isNew = (new Date() - member.user.createdTimestamp) < 900000 ? '🆕' : '';
    channel.send(`📥 ${member.user.tag} (${member.user.id}) joined. Created: ${fromNow} ${isNew}`);

  }
};