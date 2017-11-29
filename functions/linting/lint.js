const linter = require('eslint').linter;
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

module.exports = async (message, text, show) => {
  const code = text || message.content.match(/```(js)?(.|\s)+```/gi)[0].replace(/```(js)?|```/gi, '').trim();
  const errors = linter.verify(code, {
    extends: 'eslint:recommended',
    parserOptions: {
      emcaVersion: 2017,
    },
    env: {
      es6: true,
      node: true,
    },
    rules: {
      'no-console': 0,
    },
  });

  if (!show) {
    if (errors.length !== 0) {
      // await message.react('❌');
      await message.react(message.client.guilds.get('332984223327584256').emojis.get('385443144298266626'));
    } else {
      // await message.react('✔');
      await message.react(message.client.guilds.get('332984223327584256').emojis.get('385443144734474242'));
    }
  } else if (errors.length !== 0) {
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
};