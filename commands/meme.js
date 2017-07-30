/*

  This meme command is only possible due to hosting the bot on my raspberry pi,
  It has a webcam hooked up directly, and with using child_process with fswebcam.
  I am able to take pictures on command, unless you're hosting your bot on a linux
  machine such as a home server, or raspberry pi with a webcam attached, you should
  delete this command from your folder.

*/
const fsn = require('fs-nextra');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const meme = args.join(' ');
  let topKek;
  let bottomKek;
  if (meme.includes('; ')) {
    [topKek, bottomKek] = meme.split('; ');
  } else {
    topKek = meme;
    bottomKek = '';
  }
  const imgW = 640;
  const imgH = 480;
  try {
    const msg = await message.channel.send('`Fetching meme, please wait...`');
    await exec(`fswebcam -r ${imgW}x${imgH} --no-banner ./assets/selfie_meme.jpg`);
    const output = await fsn.readFile('./assets/selfie_meme.jpg');
    const Canvas = require('canvas'),
      Image = Canvas.Image,
      canvas = new Canvas(imgW, imgH),
      ctx = canvas.getContext('2d');
    const img = new Image;
    img.src = output;
    ctx.drawImage(img, 0, 0);
    // ctx.font = '60pt Impact';
    let size = 60;
    ctx.font = `${size}pt Impact`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    const topLength = ctx.measureText(topKek.toUpperCase());
    if (topLength > imgW) size = topLength / (imgW * size);
    ctx.font = `${size}pt Impact`;
    ctx.fillText(topKek.toUpperCase(), imgW / 2, 84, imgW);
    ctx.lineWidth = 1;
    ctx.strokeText(topKek.toUpperCase(), imgW / 2, 84);
    ctx.stroke();
    const botLength = ctx.measureText(bottomKek.toUpperCase());
    if (botLength > imgW) size = botLength / (imgW * size);
    ctx.font = `${size}pt Impact`;
    ctx.fillText(bottomKek.toUpperCase(), imgW / 2, 463, imgW);
    ctx.lineWidth = 1;
    ctx.strokeText(bottomKek.toUpperCase(), imgW / 2, 463);
    ctx.stroke();
    await message.channel.send({files: [{attachment: canvas.toBuffer(undefined, 3, canvas.PNG_FILTER_NONE), name: 'memes.png'}]});
    await msg.delete();
  } catch (e) {
    console.log(e);
  }

};

exports.conf = {
  hidden: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'meme',
  description: 'Creates a top text/bottom text memes',
  usage: 'meme <top text; bottom text>',
  category: 'Fun'
};
