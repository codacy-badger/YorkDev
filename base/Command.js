class Command {
  constructor(client, {
    name = null, 
    description = 'No description provided.', 
    category = 'General', 
    usage = 'No usage provided.', 
    extended = 'No information provided.', 
    hidden = false, 
    guildOnly = false, 
    aliases = [], 
    permLevel = 0
  }) {
    this.client = client;
    this.conf = { hidden, guildOnly, aliases, permLevel };
    this.help = { name, description, category, usage, extended };
  }
}
module.exports = Command;