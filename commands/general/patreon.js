const Command = require('../../base/Command.js');
const { RichEmbed } = require('discord.js');

class Patreon extends Command {
  constructor(client) {
    super(client, {
      name: 'patreon',
      description: 'Displays patreon pledge information.',
      usage: 'patreon',
      category: 'General',
      extended: 'Pulls up a list of current Patreon tiers to support York.',
      aliases: ['donate', 'pledge', 'patron'],
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const embed = new RichEmbed()
      .setColor(0xff5900)
      .addField('Disclaimer', 'All rewards will be honoured for **active** patrons.\n\nPatreon will charge up front due to a number of scam attempts in the past.\n\nThe **Supporter** tier is limited to **10** patrons due to time and availability constraints.\n\nThe **Code Monkey** tier is limited to **1** patron due to time and availability constraints.', true)
      .addField('Become a Patron', 'Get an exclusive role with a Patron only channel!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1314501) to pledge $1.00**\n', true)
      .addField('Early Access', 'You get early access to regular content!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1374922) to pledge $2.50**\n', true)
      .addField('Making Music', 'You get access to the ongoing music bot tutorial!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1374923) to pledge $5.00**\n', true)
      .addField('Supporter', 'You can get help from me directly via Direct Messages, subject to availability!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1722818) to pledge $10.00**\n', true)
      .addField('Code Monkey', 'I will code you a single feature rich Discord Bot, subject to availability and complexity.\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1915007) to pledge $700.00**\n', true)
      .addField('Link', 'If you want to help out and support me, you can do so by pledging at [Patreon](https://www.patreon.com/anidiotsguide)\n');
    message.channel.send({embed});
  }
}

module.exports = Patreon;
