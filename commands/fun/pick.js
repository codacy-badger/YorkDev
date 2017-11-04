const Social = require('../../base/Social.js');

class Pick extends Social {
  constructor(client) {
    super(client, {
      name: 'pick',
      description: 'Pick out of a list',
      category: 'Fun',
      usage: 'pick <option1>, <option2>, <option3>, <etc>',
      extended: 'This command will help you select out of a list of supplied options.',
      cost: 1,
      aliases: ['choose'],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const options = args.join(' ');
    if (options.length < 2) throw `${message.author} |\`❌\`| Invalid command usage, you must supply text.`;
    const list = options.split(',');
    if (list.length < 2)  throw `${message.author} |\`❌\`| Invalid command usage, you must supply at least two items to pick from.`;
    const cost = this.cmdDis(this.help.cost, level);
    const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
    if (!payMe) return;  
    try {
      return message.channel.send(`I think you should do \`${list[Math.floor(Math.random()*list.length)].trim()}\``);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Pick;