// Tier 1: Become a Patron, $1.00, Special Discord Role, Patreon only channel, priority help
// Tier 2: Viewer Requests, $2.50, Previous rewards, early access, sponsers viewer requests
// Tier 3: Music Tutorial,  $5.00, Previous rewards, Patreon exclusive content (Music Bot Tutorial)
// Tier 4: Supporter,      $10.00, Previous rewards, First priority help via DM's
const { RichEmbed } = require('discord.js');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const embed = new RichEmbed()
  .setColor(0xff5900)
  // .setDescription('Hello my fellow idiots! My name is York, I\'m a 30 something husband and father of two, and I enjoy creating a video series called [_"An Idiot\'s Guide"_](https://www.youtube.com/c/AnIdiotsGuide) on YouTube, where I go through the process of explaining how to create and manage a discord bot.\n\nI\'m here today because I want to bring even more to you, I have a lot of ideas I want to get recorded but real life constraints are preventing me, but with **your** help, I can bring you even more content, even the illusive music bot tutorial!')
  .addField('Disclaimer', 'All rewards will be honoured for **active** patrons.\n\nPatreon will charge up front due to a number of scam attempts in the past.\n\nThe **Supporter** tier is limited to **10** patrons due to time and availability constraints.\nThe **Code Monkey** tier is limited to **1** patron due to time and availability constraints.', true)
  .addField('Become a Patron', 'Get an exclusive role with a Patron only channel!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1314501) to pledge $1.00**\n', true)
  .addField('Early Access', 'You get early access to regular content!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1374922) to pledge $2.50**\n', true)
  .addField('Making Music', 'You get access to the ongoing music bot tutorial!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1374923) to pledge $5.00**\n', true)
  .addField('Supporter', 'You can get help from me directly via Direct Messages, subject to availability!\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1722818) to pledge $10.00**\n', true)
  .addField('Code Monkey', 'I will code you a single feature rich Discord Bot, subject to availability and complexity.\n**Click [here](https://www.patreon.com/bePatron?c=639896&rid=1915007) to pledge $700.00**\n', true)
  .addField('Link', 'If you want to help out and support me, you can do so by pledging at [Patreon](https://www.patreon.com/anidiotsguide)\n');
  message.channel.send({embed});
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['support', 'donate', 'pledge', 'patron'],
  permLevel: 0
};

exports.help = {
  name: 'patreon',
  description: 'Displays patreon information',
  usage: 'patreon',
  category: 'General',
  extended: 'Pulls up a list of current Patreon tiers to support York.'
};
