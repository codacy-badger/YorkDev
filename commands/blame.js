const { Canvas } = require('canvas-constructor');
const { resolve, join} = require('path');
const font = resolve(join(__dirname, '../assets/font_roboto.ttf'));
const blame = async (person) => { // eslint-disable-line no-unused-vars
  const size = new Canvas(130, 84)
    .addTextFont(font, 'Roboto')
    .setTextFont('20pt Roboto')
    .measureText(person.displayName);
  const newSize = size.width < 130 ? 130 : size.width + 30;
  return new Canvas(newSize, 84)
    .addTextFont(font, 'Roboto')
    .setTextFont('20pt Roboto')
    .setColor('#B93F2C')
    .setTextBaseline('top')
    .setTextAlign('center')
    .addText('Blame', newSize/2, 5)
    .setColor('#FF0000')
    .setTextBaseline('top')
    .setTextAlign('center')
    .addText(person.displayName, newSize/2, 45)
    .toBuffer(undefined, 3, Canvas.PNG_FILTER_NONE);
};
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const person = message.mentions.members.first();
  const msg = await message.channel.send(`\`Assigning blame to ${person.displayName}\``);
  if (!person) return message.reply('You must mention someone to blame them.');
  const result = await blame(person);
  await msg.delete();
  await message.channel.send({files: [{attachment: result, name: 'blame.png'}]});
};

exports.conf = {
  hidden: false,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'blame',
  description: 'Blame someone in canvas form',
  usage: 'blame <user>',
  category: 'Fun',
  extended: 'Use canvas to blame a fellow user.'
};
