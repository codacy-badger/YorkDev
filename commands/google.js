const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');
const Command = require('../base/Command.js');

class Google extends Command {
  constructor(client) {
    super(client, {
      name: 'google',
      description: 'Searches something on Google.',
      extended: 'Searches Google for your question.',
      category: 'Utilities',
      usage: 'google [search]',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, level) { // eslint-disable-line no-unused-vars
    const searchMessage = await message.reply('Searching... Please wait.');
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(message.content)}`;
    return snekfetch.get(searchUrl).then((result) => {
      const $ = cheerio.load(result.text);
      let googleData = $('.r').first().find('a').first().attr('href');
      googleData = querystring.parse(googleData.replace('/url?', ''));
      searchMessage.edit(`Result found!\n${googleData.q}`);
    }).catch((err) => { // eslint-disable-line no-unused-vars
      searchMessage.edit('No results found.');
    });
  }
}

module.exports = Google;