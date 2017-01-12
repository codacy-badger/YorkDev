/*

	Yes, this is a modified version of Auto by Hackzilla

*/
const issue = require('./issuelist.json');
function parse(input) {
  const text = input.toLowerCase();
  if (text.includes('not yet supported outside strict mode')) {
    console.log(issue.errors.strictmode);
    return {
      message: issue.errors.strictmode.message,
      info: issue.errors.strictmode.info,
      problem: issue.errors.strictmode.problem,
      solution: issue.errors.strictmode.solution
    };
  } else

  if (text.includes('async') && text.includes('unexpected token')) {
    return {
      message: issue.errors.async.message,
      info: issue.errors.async.info,
      problem: issue.errors.async.problem,
      solution: issue.errors.async.solution
    };
  } else

  if (text.includes('gyp error') || (text.includes('npm exit status 1') && (text.includes('node—gyp rebuild') || text.includes('node-gyp rebuild')))) {
    return {
      message: issue.errors.gyperror.message,
      info: issue.errors.gyperror.info,
      problem: issue.errors.gyperror.problem,
      solution: issue.errors.gyperror.solution,
    };
  } else

  if (text.includes('cannot find module')) {
    return {
      message: issue.errors.lostmodule.message,
      info: issue.errors.lostmodule.info,
      problem: issue.errors.lostmodule.problem,
      solution: issue.errors.lostmodule.solution,
    };
  } else

  if (text.includes('msg is not defined') || text.includes('message is not defined')) {
    return {
      message: issue.errors.msgnotdef.message,
      info: issue.errors.msgnotdef.info,
      problem: issue.errors.msgnotdef.problem,
      solution: issue.errors.msgnotdef.solution,
    };
  } else

  if (text.includes('bot is not defined') || text.includes('client is not defined')) {
    return {
      message: issue.errors.botnotdef.message,
      info: issue.errors.botnotdef.info,
      problem: issue.errors.botnotdef.problem,
      solution: issue.errors.botnotdef.solution,
    };
  } else

  if (text.includes('discord.richembed') && text.includes('is not a constructor')) {
    return {
      message: issue.errors.richembed.message,
      info: issue.errors.richembed.info,
      problem: issue.errors.richembed.problem,
      solution: issue.errors.richembed.solution,
    };
  } else

  if (text.includes('unhandledpromiserejectionwarning') || text.includes('unhandled promise rejection')) {
    return {
      message: issue.errors.unhandledpromise.message,
      info: issue.errors.unhandledpromise.info,
      problem: issue.errors.unhandledpromise.problem,
      solution: issue.errors.unhandledpromise.solution,
    };
  } else

  if (text.includes('couldn\'t find an opus engine')) {
    return {
      message: issue.errors.opusengine.message,
      info: issue.errors.opusengine.info,
      problem: issue.errors.opusengine.problem,
      solution: issue.errors.opusengine.solution,
    };
  } else

  if (text.includes('ffmpeg was not found on your system')) {
    return {
      message: issue.errors.ffmpeg.message,
      info: issue.errors.ffmpeg.info,
      problem: issue.errors.ffmpeg.problem,
      solution: issue.errors.ffmpeg.solution,
    };
  }

  return undefined;
}

module.exports = (message, input) => {
  if (/([a-z0-9]|-){24}\.([a-z0-9]|-){6}\.([a-z0-9]|-){27}|mfa.([a-z0-9]|-){84}/gi.test(input)) {
    message.delete();
    message.reply('You posted your token! Be sure to reset it at <https://discordapp.com/developers/applications/me>');
  }

  const result = parse(input);
  if (!result) return;

  message.reply(result.message, {
    embed: {
      color: 0xf44259,
      fields: [{
        inline: true,
        name: 'Problem',
        value: result.problem,
      },
      {
        inline: true,
        name: 'More Info',
        value: result.info,
      },
      {
        name: 'Solution',
        value: result.solution,
      },
      ],
    },
  }).catch(console.error);
};
