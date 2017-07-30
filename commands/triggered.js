/*

  This triggered command is only possible due to hosting the bot on my raspberry pi,
  It has a webcam hooked up directly, and with using child_process with fswebcam.
  I am able to take pictures on command, unless you're hosting your bot on a linux
  machine such as a home server, or raspberry pi with a webcam attached, you should
  delete this command from your folder.

*/
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
const { readFile } = require('fs-nextra');
const streamToArray = require('stream-to-array');

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const imgW = 640;
const imgH = 480;

const triggering = async () => {
  await exec(`fswebcam -r ${imgW}x${imgH} --no-banner ./assets/selfie_triggered.jpg`);
  const encoder = new GIFEncoder(imgW, imgH + 62);
  const c = new Canvas(imgW, imgH + 62);

  const imgTitle = new Canvas.Image();
  const imgTriggered = new Canvas.Image();

  const ctx = c.getContext('2d');

  const [userBuffer, titleBuffer] = await Promise.all([
    readFile('./assets/selfie_triggered.jpg'),
    readFile('./assets/plate_triggered.jpg'),
  ]);
  imgTitle.src = titleBuffer;
  imgTriggered.src = userBuffer;

  const stream = encoder.createReadStream();
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(50);
  encoder.setQuality(200);

  const coord1 = [-25, -50, -42, -14];
  const coord2 = [-25, -13, -34, -3];
  for (let i = 0; i < 4; i++) {
    ctx.drawImage(imgTriggered, coord1[i], coord2[i], imgW + 62, imgH + 62);
    ctx.fillStyle = 'rgba(255 , 100, 0, 0.4)';
    ctx.drawImage(imgTitle, 0, imgH);
    ctx.fillRect(0, 0, imgW, imgH);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  return streamToArray(stream).then(Buffer.concat);
};

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const msg = await message.channel.send('\`Getting triggered...\`');
    const buffer = await triggering();
    await message.channel.send({files: [{attachment: buffer, name: 'triggered.gif'}]});
    await msg.delete();
  } catch (e) {
    console.error(e);
  }
};

exports.conf = {
  hidden: false,
  aliases: [],
  permLevel: 10
};

exports.help = {
  name: 'triggered',
  description: 'Create a gif bassed on the infamous Triggered Meme',
  usage: 'triggered',
  category: 'Fun'
};
