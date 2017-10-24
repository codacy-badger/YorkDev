module.exports = class {
  constructor(client) {
    this.client = client;
  }
  
  async execute() {
    await this.client.wait(1000);

    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    this.client.appInfo = await this.client.fetchApplication();
    
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    this.client.log('log', `Logged in as ${this.client.user.tag} and I'm ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, 'Ready!');
    
    await this.client.user.setGame(`${this.client.config.defaultSettings.prefix}help | ${this.client.guilds.size} Servers`);
    
    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));
    
    if (!this.client.blacklist.get('list')) this.client.blacklist.set('list', []);
    
    if (!this.client.botSettings.get('bot')) this.client.botSettings.set('bot', this.client.config.botSettings);
    if (this.client.botSettings.get('bot').afk) this.client.user.setStatus('dnd');

    require('../functions/dashboard.js')(this.client);
    
    require('../functions/twitter.js')(this.client);
    
    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(remind.id).send(`You asked me to remind you about: \`${remind.reminder}\``);
        this.client.reminders.delete(`${remind.id}-${remind.reminderTimestamp});
      }) 
    }, 5000) 
  }
  
};
