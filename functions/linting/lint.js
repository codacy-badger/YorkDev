const linter = new (require('eslint').Linter)();
const beautify = require('js-beautify').js_beautify;
const annotate = require('./annotate.js');

const badMessages = [
  'I think you may want to take a second look.',
  'Looks like you have some problems!',
  'Did you lint your code?',
  'Get a linter bro.',
  'Uh oh!',
  'I don\'t like this code.',
  'BAD!',
  'Did you try to copy that off of Github?',
  'Do you know JS?',
  'smh',
  'no',
];

const goodMessages = [
  'It\'s all good fam.',
  'Nice job.',
  'Great code.',
  'I like',
];

module.exports = async (message) => {
  const input = message.content.match(/```(js)?(.|\s)+```/gi)[0].replace(/```(js|javascript)?|```/gi, '').trim();
  const code = /\bawait\b/i.test(input) ? `(async function(){ \n${input}\n})()` : input;
  const errors = linter.verify(code, {
    extends: 'eslint:recommended',
    parserOptions: {
      ecmaVersion: 8,
    },
    env: {
      es6: true,
      node: true,
    },
    rules: {
      'no-console': 0,
    },
  });


  if (errors.length !== 0) {
    // await message.react('❌');
    await message.react(message.client.guilds.get('332984223327584256').emojis.get('385443144298266626'));
    message.react('🔍');
  } else {
    // await message.react('✔');
    await message.react(message.client.guilds.get('332984223327584256').emojis.get('385443144734474242'));
  }

  message.awaitReactions((re, user) => !user.bot && re.emoji.toString() === '🔍', {
    time: 1000 * 60 * 60,
    max: 1,
    errors: 'time'
  }).then(() => {
    if (errors.length !== 0) {
      const errs = [];
      for (const error of errors) {
        errs.push(`- [${error.line}:${error.column}] ${error.message}`);
      }

      message.channel.send(badMessages[Math.floor(Math.random() * badMessages.length)], {
        embed: {
          color: 0xf44259,
          fields: [{
            name: 'Errors',
            value: `\`\`\`diff\n${errs.join('\n')}\`\`\``,
          },
          {
            name: 'Annotated Code',
            value: `\`\`\`${annotate(code, errors)}\`\`\``,
          },
          {
            name: 'Beautified Code',
            value: `\`\`\`js\n${beautify(code, { indent_size: 2 })}\`\`\``,
          },
          ],
        },
      });
    } else {
      message.channel.send(goodMessages[Math.floor(Math.random() * goodMessages.length)], {
        embed: {
          color: 0x43B581,
          fields: [{
            name: 'Beautified Code',
            value: `\`\`\`js\n${beautify(code, { indent_size: 2 })}\`\`\``,
          }, ],
        },
      });
    }
  }).catch(e => void e);
};