class Command {
  constructor(client, {
    name = null, 
    description = 'No description provided.', 
    category = 'General', 
    usage = 'No usage provided.', 
    extended = 'No information provided.', 
    cost = 0,
    hidden = false, 
    guildOnly = false, 
    aliases = [], 
    botPerms = [],
    permLevel = 0
  }) {
    this.client = client;
    this.conf   = { hidden, guildOnly, aliases, botPerms, permLevel };
    this.help   = { name, description, category, usage, extended, cost };
  }

  async verifyUser(user) {
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) throw 'Invalid user';
    const id = match[1];
    const check = await this.client.fetchUser(id);
    if (check.username !== undefined) return id;
  }
}
module.exports = Command;