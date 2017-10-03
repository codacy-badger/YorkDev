module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute() {
    await this.client.wait(1000);
    this.client.log('log', `Logged in as ${this.client.user.username} and I'm ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, 'Ready!');
    await this.client.user.setGame(`${this.client.config.defaultSettings.prefix}help | ${this.client.guilds.size} Servers`);
    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));
    if (!this.client.blacklist.get('list')) this.client.blacklist.set('list', []);
    require('../functions/dashboard.js')(this.client);
  }
};