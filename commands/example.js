const Command = require('../base/Command.js');

class Example extends Command {
  constructor(client) {
    super(client, {
      name: 'example',
      description: 'Displays an example.',
      usage: 'example <action> [examplename] <contents>.',
      category: 'Support',
      extended: `-add newExampleName This is your new example contents
          -del exampleName
          -edit existingExampleName This is new example edited contents
          -list`,
      aliases: ['ex', 'examples']
    });
    this.init = client => {
      this.db = new client.db(client, 'examples');
      this.db.extendedHelp = this.help.extended;
      client.examples = this.db;
    };
  }

  async run(message, args, level) {
    if (!args[0] && !message.flags.length) message.flags.push('list');
    
    if (!message.flags.length) {
      const [name, ...msg] = args;
      if (!this.db.has(name)) return message.channel.send(`The example \`${name}\` does not exist.`);
      const example = this.db.get(name).contents;
      return message.channel.send(`${msg.join(' ')}${example}`,{code:'js'});
    }
    
    if (message.flags[0] === 'list') return message.channel.send(this.db.list());
    if (level < 2) return;
    
    const [name, ...extra] = args;
    
    let data = null;
    switch (message.flags[0]) {
      case ('add') :
        data = {contents: extra.join(' ')};
        break;
      default :
        data = extra.join(' ');
    }
    
    try {
      const response = await this.db[message.flags[0]](name, data);
      message.channel.send(response);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Example;