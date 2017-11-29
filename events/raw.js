const messageReactionAdd = require('../eventsRaw/messageReactionAdd.js');
module.exports = class {
  constructor(client) {
    this.client = client;
    this.messageReactionAdd = new messageReactionAdd(this.client);
  }
  async execute(data) {
    if (data.t === 'MESSAGE_REACTION_ADD') {
      // console.log(data);
      return this.messageReactionAdd.execute(data);
    } else {
      return null;
    }
  }
};