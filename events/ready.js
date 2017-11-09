module.exports = class {
  constructor(client) {
    this.client = client;
  }
  
  async execute() {
    await this.client.wait(1000);
    require('../functions/twitter.js')(this.client);

    if (this.client.users.has('1')) {
      this.client.users.delete('1');
    }

    this.client.appInfo = await this.client.fetchApplication();
    
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    this.client.log('log', `Logged in as ${this.client.user.tag} and I'm ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, 'Ready!');
    
    await this.client.user.setGame(`${this.client.settings.get('default').prefix}help | ${this.client.guilds.size} Servers`);
    
    
    if (!this.client.blacklist.get('list')) this.client.blacklist.set('list', []);
    
    if (!this.client.botSettings.get('bot')) this.client.botSettings.set('bot', this.client.config.botSettings);
    if (this.client.botSettings.get('bot').afk) this.client.user.setStatus('dnd');

    require('../functions/dashboard.js')(this.client);
    
    
    setInterval(() => {
      const toRemind = this.client.reminders.filter(r => r.reminderTimestamp <= Date.now());
      toRemind.forEach(reminder => {
        this.client.users.get(reminder.id).send(`You asked me to remind you about: \`${reminder.reminder}\``);
        this.client.reminders.delete(`${reminder.id}-${reminder.reminderTimestamp}`);
      }); 
    }, 60000); 
  }
  
};
