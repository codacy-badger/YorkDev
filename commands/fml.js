const request = require('snekfetch');
const HTMLParser = require('fast-html-parser');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const res = await request.get('http://www.fmylife.com/random');
  const root = HTMLParser.parse(res.text);
  const article = root.querySelector('.block a');
  return message.channel.send(article.childNodes[0].text);
};

exports.conf = {
  hidden: false,
  aliases: ['fuckmylife', 'fuckme'],
  permLevel: 0
};

exports.help = {
  name: 'fml',
  description: 'Grabs a random "fuck my life" story.',
  usage: 'fml',
  category: 'Fun'
};
