module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: true,
      guildOnly: false,
      aliases: [],
      permLevel: 10
    };

    this.help = {
      name: 'reload',
      category: 'System',
      description: 'Reloads a command that\'s been modified.',
      usage: 'reload [command]',
      extended: 'This command is designed to unload, then reload the command from the command & aliases collections for the changes to take effect.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args || args.size < 1) return message.channel.send('Must provide a command to reload.');

    let command;
    if (this.client.commands.has(args[0])) {
      command = this.client.commands.get(args[0]);
    } else if (this.client.aliases.has(args[0])) {
      command = this.client.commands.get(this.client.aliases.get(args[0]));
    }
    if (!command) return message.channel.send(`The command \`${args[0]}\` doesn't seem to exist, nor is it an alias. Try again!`);

    if (command.db) await command.db.close();

    command = command.help.name;

    delete require.cache[require.resolve(`./${command}.js`)];
    const cmd = new (require(`./${command}`))(this.client);
    this.client.commands.delete(command);
    if (cmd.init) cmd.init(this.client);
    this.client.aliases.forEach((cmd, alias) => {
      if (cmd === command) this.client.aliases.delete(alias);
    });
    this.client.commands.set(command, cmd);
    cmd.conf.aliases.forEach(alias => {
      this.client.aliases.set(alias, cmd.help.name);
    });

    message.channel.send(`The command \`${command}\` has been reloaded`);
  }
};
