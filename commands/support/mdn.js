const Command = require(`${process.cwd()}/base/Command.js`);
const { MessageEmbed } = require('discord.js');
const snek = require('snekfetch');
const toMarkdown = require('to-markdown');
const mdnLink = 'https://developer.mozilla.org';

class Mdn extends Command {
  constructor(client) {
    super(client, {
      name: 'mdn',
      description: 'Resources for developers, by developers.',
      usage: 'mdn <search term>',
      category: 'Support',
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const query = args.join(' ').replace(/#/g, '.prototype.');
    try {
      const { body } = await snek
        .get('https://mdn.topkek.pw/search')
        .query({ q: query });

      if (!body.URL || !body.Title || !body.Summary) message.error(undefined, 'Could not find any results.');

      const embed = new MessageEmbed()
        .setColor(0x066FAD)
        .setAuthor('MDN', 'https://i.imgur.com/DFGXabG.png')
        .setURL(`${mdnLink}${body.URL}`)
        .setTitle(body.Title)
        .setDescription(toMarkdown(body.Summary, {
          converters: [{
            filter: 'a',
            replacement: (text, node) => `[${text}](${mdnLink}${node.href})`
          }]
        }));
      return message.channel.send(embed);
    } catch (err) {
      return message.error(undefined, `Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }  }
}

module.exports = Mdn;