/*

	This selfie command is only possible due to hosting my bot on my raspberry pi
	it has a webcam hooked up directly, and with using child_process with fswebcam
	I am able to take pictures on command, unless you're hosting your bot on a linux
	machine such as a home server, or raspberry pi with a webcam attached, you should
	delete this command from your folder.

*/
const fsn = require('fs-nextra');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const msg = await message.channel.send('\`Smile for the camera...\`');
    const imgW = 640;
    const imgH = 480;
    await exec(`fswebcam -r ${imgW}x${imgH} --no-banner ./assets/selfie.jpg`);
    const image = await fsn.readFile('./assets/selfie.jpg');
    await message.channel.send(args.join(' '), {files: [{ attachment: image, name: 'selfie.jpg'}]});
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
  name: 'selfie',
  description: 'Takes a live image from a webcam.',
  usage: 'selfie [string]',
  category: 'Fun',
  extended: 'This command, with the use of \`fswebcam\` takes a live image from an attached webcam and uploads it to discord.'
};
