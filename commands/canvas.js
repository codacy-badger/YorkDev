const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');

const output = async () => {
  const plate = await fsn.readFile('./assets/plate_achievement.png');
  return new Canvas(320, 240)
    .setColor('#0000FF')
    .addRect(0, 0, 320, 240)
    .addImage(plate, 0, 32, 320, 64)
    .setColor('#FFFFFF')
    .setTextFont('20pt sans-serif')
    .setTextAlign('center')
    .setTextBaseline('top')
    .setGlobalAlpha(0.8)
    .setShadowColor('#FF0000')
    .setShadowOffsetX(5)
    .setShadowOffsetY(3)
    .setShadowBlur(5)
    .addText('Hello World!', 320 / 2, 58)
    .clearCircle(100, 100, 20)
    .toBuffer(undefined, 3, Canvas.PNG_FILTER_NONE);
};

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const result = await output();
    await message.channel.send({files: [{attachment: result, name: 'achievementGet.png'}]});
  } catch (e) {
    console.log(e);
  }
};

exports.conf = {
  hidden: false,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'canvas',
  description: '',
  usage: '',
  category: 'Fun',
  extended: ''
};
