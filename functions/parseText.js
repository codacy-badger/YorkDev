/*

	Yes, this is a modified version of Auto by Hackzilla

*/
const issue = require('./issueList.json');
function parse(input) {
  const text = input.toLowerCase();
  if (text.includes('not yet supported outside strict mode')) {
    return {
      message: issue.responses.strictmode.message,
      info: issue.responses.strictmode.info,
      problem: issue.responses.strictmode.problem,
      solution: issue.responses.strictmode.solution
    };
  } else

  if (text.includes('async') && text.includes('unexpected token')) {
    return {
      message: issue.responses.async.message,
      info: issue.responses.async.info,
      problem: issue.responses.async.problem,
      solution: issue.responses.async.solution
    };
  } else

  if (text.includes('gyp error') || (text.includes('npm exit status 1') && (text.includes('node—gyp rebuild') || text.includes('node-gyp rebuild')))) {
    return {
      message: issue.responses.gyperror.message,
      info: issue.responses.gyperror.info,
      problem: issue.responses.gyperror.problem,
      solution: issue.responses.gyperror.solution,
    };
  } else

  if (text.includes('cannot find module')) {
    return {
      message: issue.responses.lostmodule.message,
      info: issue.responses.lostmodule.info,
      problem: issue.responses.lostmodule.problem,
      solution: issue.responses.lostmodule.solution,
    };
  } else

  if (text.includes('msg is not defined') || text.includes('message is not defined')) {
    return {
      message: issue.responses.msgnotdef.message,
      info: issue.responses.msgnotdef.info,
      problem: issue.responses.msgnotdef.problem,
      solution: issue.responses.msgnotdef.solution,
    };
  } else

  if (text.includes('bot is not defined') || text.includes('client is not defined')) {
    return {
      message: issue.responses.botnotdef.message,
      info: issue.responses.botnotdef.info,
      problem: issue.responses.botnotdef.problem,
      solution: issue.responses.botnotdef.solution,
    };
  } else

  if (text.includes('discord.richembed') && text.includes('is not a constructor')) {
    return {
      message: issue.responses.richembed.message,
      info: issue.responses.richembed.info,
      problem: issue.responses.richembed.problem,
      solution: issue.responses.richembed.solution,
    };
  } else

  if (text.includes('unhandledpromiserejectionwarning') || text.includes('unhandled promise rejection')) {
    return {
      message: issue.responses.unhandledpromise.message,
      info: issue.responses.unhandledpromise.info,
      problem: issue.responses.unhandledpromise.problem,
      solution: issue.responses.unhandledpromise.solution,
    };
  } else

  if (text.includes('bad request')) {
    return {
      message: issue.responses.badrequest.message,
      info: issue.responses.badrequest.info,
      problem: issue.responses.badrequest.problem,
      solution: issue.responses.badrequest.solution,
    };
  } else

  if (text.includes('forbidden')) {
    return {
      message: issue.responses.forbidden.message,
      info: issue.responses.forbidden.info,
      problem: issue.responses.forbidden.problem,
      solution: issue.responses.forbidden.solution,
    };
  } else

  if (text.includes('couldn\'t find an opus engine')) {
    return {
      message: issue.responses.opusengine.message,
      info: issue.responses.opusengine.info,
      problem: issue.responses.opusengine.problem,
      solution: issue.responses.opusengine.solution,
    };
  } else

  if (text.includes('ffmpeg was not found on your system')) {
    return {
      message: issue.responses.ffmpeg.message,
      info: issue.responses.ffmpeg.info,
      problem: issue.responses.ffmpeg.problem,
      solution: issue.responses.ffmpeg.solution,
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
        name: 'Solution',
        value: result.solution,
      },
      {
        inline: true,
        name: 'More Info',
        value: result.info,
      }
      ],
    },
  }).catch(console.error);
};
