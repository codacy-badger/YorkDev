const Canvas = require('canvas-constructor');
const [width, height] = [400, 533];
const snapchat = new Canvas(width, height);
const { resolve, join} = require('path');
const fsn = require('fs-nextra');

const getSnap = async (text) => {
  const snap = await fsn.readFile('./assets/image_snapchat.jpg');
  snapchat.addImage(snap, 0, 0, width, height)
    .addTextFont(resolve(join(__dirname, '../assets/font_snapchat.ttf')), 'Snapchat')
    .setTextAlign('center')
    .setTextFont('18pt Snapchat')
    .setColor('#FFFFFF')
    .addText(text, width / 2, 379);
};

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const text = args.join(' ');
  if (text.length < 1) return message.reply('You must give the snap some text.');
  if (text.length > 28) return message.reply('I can only handle a maximum of 28 characters');
  await getSnap(text);
  await message.channel.send({files: [{attachment: snapchat.toBuffer(undefined, 3, Canvas.PNG_FILTER_NONE), name: `${text.toLowerCase().replace(' ', '-').replace('.', '-')}.jpg`}]});
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: ['sc'],
  permLevel: 2
};

exports.help = {
  name: 'snapchat',
  description: 'Creates a meme based on the But MOOOOOM statue.',
  usage: 'snapchat <text>',
  category: 'Fun',
  extended: 'This command uses canvas to generate a Snapchat styled image based on the well known _But MOOOOOM_ statue meme.'
};
