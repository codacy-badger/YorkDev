const { parse } = require('fast-html-parser');
const { get } = require('snekfetch');
const { parse: qs } = require('querystring');
const { lazy: uf } = require('unfluff');
const { RichEmbed } = require('discord.js');
const Command = require('../base/Command.js');

const gcolor = ['#4285FA', '#0F9D58', '#F4B400', '#DB4437'];

class Google extends Command {
  constructor(client) {
    super(client, {
      name: 'google',
      description: 'Searches something on Google.',
      extended: 'Searches Google for your question.',
      category: 'Utilities',
      usage: 'google [search]',
      aliases: ['g'],
      botPerms: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }


  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const time = Date.now();
    const term = args.join(' ');
    const searchurl = 'http://google.com/search?safe=active&q=' + encodeURIComponent(term);
    const searchmessage = await message.channel.send('Searching for ' + term);
    const body = await get(searchurl);
    const $ = new parse(body.text);

    const result = (await Promise.all($.querySelectorAll('.r').filter(e => e.childNodes[0].tagName === 'a' && e.childNodes[0].attributes.href).filter(e => !e.childNodes[0].attributes.href.replace('/url?', '').startsWith('/')).slice(0, 5)
      .map(async (e) => {
        let url = e.childNodes[0].attributes.href.replace('/url?', '');
        if (url.startsWith('q=/')) url = 'http://google.com' + qs(url).q || url;
        else url = qs(url).q || url;
        console.log(e, url);
        const body = await get(url);
        const details = uf(body.text);
        const obj = {
          url,
          snippet: () => {
            const x = (details.description() || '').substring(0, 180);
            const y = (details.text() || '').substring(0, 180) + '...';
            return y.includes(x) ? y : x + "\n" + y;
          },
          image: () => details.image()
        };
        try {
          obj.title = new parse(body.text).querySelector('head').childNodes.find(e => e.tagName === 'title').childNodes[0].text;
        } catch (e) {
          obj.title = details.title() || 'No title found';
        }
        return obj;
      })));
    if (!result.length) return searchmessage.edit('No results found for ' + term);
    const first = result.shift();
    const embed = new RichEmbed()
      .setColor(gcolor[Math.floor(Math.random() * gcolor.length)])
      .setAuthor(`Results for "${term}"`, 'https://lh4.googleusercontent.com/-v0soe-ievYE/AAAAAAAAAAI/AAAAAAADwkE/KyrKDjjeV1o/photo.jpg', searchurl)
      .setTitle(first.title)
      .setURL(first.url)
      .setThumbnail(first.image())
      .setDescription(first.snippet())
      .setTimestamp()
      .setFooter(Date.now() - time + ' ms')
      .addField('Top results', result.map(r => {
        const t = `${r.title}\n[${r.url}](${r.url})`;
        return t.length > 180 ? `${r.title}\n[snipped]` : t;
      }).join('\n'));
    searchmessage.edit({ embed });
  }
}

module.exports = Google;
