const Command = require(`${process.cwd()}/base/Command.js`);
const { Linter } = require('eslint');
const linter = new Linter();
const rules = linter.getRules();
const { MessageEmbed } = require('discord.js');

class EslintRule extends Command {
  constructor(client) {
    super(client, {
      name: 'eslint-rule',
      description: 'Gets information on an eslint rule.',
      usage: 'eslint-rule <rule>',
      category: 'Support',
      aliases: ['rule'],
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const rule = args.join('-');
    try {
      if (!rules.has(rule)) message.error(undefined, 'Could not find any results.');
      const data = rules.get(rule).meta;
      const embed = new MessageEmbed()
        .setAuthor('ESLint', 'https://i.imgur.com/TlurpFC.png')
        .setColor(0x3A33D1)
        .setTitle(`${rule} (${data.docs.category})`)
        .setURL(`https://eslint.org/docs/rules/${rule}`)
        .setDescription(data.docs.description);
      return message.channel.send(embed);
    } catch (error) {
      this.client.logger.error(error);
    }
  }
}

module.exports = EslintRule;