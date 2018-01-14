const linter = new(require('eslint').Linter)();
const beautify = require('js-beautify').js_beautify;
const annotate = require('./annotate.js');
const lang = require('lang-detector');

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
  //let code = message.content.match(/```(js)?(.|\s)+```/gi)[0].replace(/```(js|javascript)?|```/gi, '').trim();
  const input = message.content.split('```').filter((e,i) => i % 2 === 1);
  let code = input.find(e => /^(js|javascript)\n/.test(e)) || input.find(e => lang(e) === 'JavaScript') || input[0];
  code = code.replace(/^(?:js|javascript)\n/i, '');
  if (!code || !code.length) return;
  if (/(?:Syntax|Type|Range|Eval|Internal|Reference|URI)Error: (?:[^\s]+(?: |$)){2,}/.test(code)) return; //check if node error instead of actual JS
  const check = (code => linter.verifyAndFix(code, {
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
  }));
  let result = check(code);
  if (result.messages.length) {
    const awaitlines = result.messages.filter(a => {
      const line = code.split('\n')[a.line - 1];
      return line === undefined ? false : line.includes('await');
    });
    if (awaitlines.length) {
      code = `(async () => {\n${code}\n})()`;
      result = check(code);
    }
  }
  
  const errors = result.messages;
  if (errors.length !== 0) {
    // await message.react('❌');
    await message.react(message.client.guilds.get('332984223327584256').emojis.get('385443144298266626'));
    message.react('🔍');
  } else {
    // await message.react('✔');
    await message.react(message.client.guilds.get('332984223327584256').emojis.get('385443144734474242'));
  }
  
  const sentEmbed = await message.awaitReactions((re, user) => !user.bot && re.emoji.toString() === '🔍', {
    time: 1000 * 60 * 60,
    max: 1,
    errors: 'time'
  }).then(() => {
    if (errors.length !== 0) {
      const errs = [];
      for (const error of errors) {
        errs.push(`- [${error.line}:${error.column}] ${error.message}`);
      }
      const annotated = annotate(code, errors);
      return message.channel.send(badMessages[Math.floor(Math.random() * badMessages.length)], {
        embed: {
          color: 0xf44259,
          fields: [{
            name: 'Errors',
            value: `\`\`\`diff\n${errs.join('\n')}\`\`\``,
          },
          {
            name: 'Annotated Code',
            value: `\`\`\`${annotated.length > 1015 ? annotated.substring(0, 1010) + '...' : annotated}\`\`\``,
          }
          /*
          ,{
            name: 'Beautified Code',
            value: `\`\`\`js\n${beautify(code, { indent_size: 2 })}\`\`\``,
          },
          */
          ],
        },
      });
    } else {
      const beautified = beautify(code, { indent_size: 2 });
      return message.channel.send(goodMessages[Math.floor(Math.random() * goodMessages.length)], {
        embed: {
          color: 0x43B581,
          fields: [{
            name: 'Beautified Code',
            value: `\`\`\`js\n${beautified.length > 1015 ? beautified.substring(0, 1010) + '...' : beautified}\`\`\``,
          }, ],
        },
      });
    }
  }).catch(e => void e);
  await sentEmbed.react('❌');
  sentEmbed.awaitReactions((re, user) => !user.bot && re.emoji.toString() === '❌', {
    time: 1000 * 60 * 60,
    max: 1,
    errors: 'time'
  }).then(() => sentEmbed.delete()).catch(e => void e);

};