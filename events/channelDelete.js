module.exports = class {
  constructor(client) {
    this.client = client;
  }
 
  async execute(channel) {
    const client = channel.client;
    const user = channel.topic;
    const consent = channel.client.consent;
    if (!consent.get(user)) return;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return ;
    const id = match[1];
    const target =  await client.fetchUser(id);
    target.send('Support channel closed.');
    consent.delete(user);
  }
};