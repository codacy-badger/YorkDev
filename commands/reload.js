const Command = require('../base/Command.js');

class Reload extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      description: 'Reloads a command that has been modified.',
      usage: 'reload [command]',
      extended: 'This command is designed to unload, then reload the command from the command & aliases collections for the changes to take effect.',
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    if (!args || args.size < 1) return message.reply('Must provide a command to reload. Derp.');

    let command;
    if (this.client.commands.has(args[0])) {
      command = this.client.commands.get(args[0]);
    } else if (this.client.aliases.has(args[0])) {
      command = this.client.commands.get(this.client.aliases.get(args[0]));
    }
    if (!command) return message.reply(`The command \`${args[0]}\` doesn"t seem to exist, nor is it an alias. Try again!`);
    command = command.help.name;

    delete require.cache[require.resolve(`./${command}.js`)];
    const cmd = new (require(`./${command}`))(this.client);
    this.client.commands.delete(command);
    this.client.aliases.forEach((cmd, alias) => {
      if (cmd === command) this.client.aliases.delete(alias);
    });
    this.client.commands.set(command, cmd);
    cmd.conf.aliases.forEach(alias => {
      this.client.aliases.set(alias, cmd.help.name);
    });

    message.reply(`The command \`${command}\` has been reloaded`);
  }
}

module.exports = Reload;
