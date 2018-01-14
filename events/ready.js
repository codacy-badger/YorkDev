module.exports = class {
  constructor(client) {
    this.client = client;
  }
  
  async execute() {
    await this.client.wait(1000);

    try {
      this.client.appInfo = await this.client.fetchApplication();
    } catch (error) {
      this.client.logger.error(error);
    }
    
    setInterval(async () => {
      try {
        this.client.appInfo = await this.client.fetchApplication();
      } catch (error) {
        this.client.logger.error(error);
      }
    }, 60000);

    this.client.logger.log(`Logged in as ${this.client.user.tag} and I'm ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`);
    await this.client.user.setGame(`@${this.client.user.username} help`);
  }
  
};
