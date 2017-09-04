module.exports = class {
  constructor(client) {
    this.client = client;
  }
   
  async execute(channel) {
    const client = channel.client;
    const user = channel.topic;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return ;
    const id = match[1];
    const target =  await client.fetchUser(id);
    target.send('Support Channel Opened.');
  }
};