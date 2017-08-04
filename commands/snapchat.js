const fsn = require('fs-nextra');
const path = require('path');
const Canvas = require('canvas');
const Snapchat = new Canvas.Font('Snapchat', path.resolve(path.join(__dirname, '../assets/font_snapchat.ttf')));
const Image = Canvas.Image;
const imgW = 400;
const imgH = 533;
const canvas = new Canvas(imgW, imgH);
const ctx = canvas.getContext('2d');
const imgPlate = new Image;
const getSnap = async (text) => {
  imgPlate.src = await fsn.readFile('./assets/image_snapchat.jpg');
  ctx.addFont(Snapchat);
  ctx.font = '18pt Snapchat';
  ctx.drawImage(imgPlate, 0, 0);
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(text, imgW / 2, 379);
};

exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  const text = args.join(' ');
  if (text.length < 1) return message.reply('You must give the snap some text.');
  if (text.length > 28) return message.reply('I can only handle a maximum of 28 characters');
  await getSnap(text);
  await message.channel.send({files: [{attachment: canvas.toBuffer(undefined, 3, canvas.PNG_FILTER_NONE), name: `${text.toLowerCase().replace(' ', '-')}.jpg`}]});
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
