const lint = require('./lint.js');
class Inspect {
  constructor(client) {
    this.client = client;
  }
  
  async run(data) {
    const channel = data.channel;
    const message = data.message;
    if (channel.type !== 'text') return null;
    try {
      if (message.content.match(/```(.|\s)+```/gi)) {
        lint(message, null, true);
      }      
    } catch (error) {
      throw error;

    }
  }
}
module.exports = Inspect;