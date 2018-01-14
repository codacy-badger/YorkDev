const lint = require(`${process.cwd()}/functions/linting/lint.js`);
const lang = require('lang-detector');
exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  const input = message.content.split('```').filter((e,i) => i % 2 === 1);
  const code = input.find(e => /^(js|javascript)\n/.test(e)) || input.find(e => lang(e) === 'JavaScript');
  if (code) {
    lint(message);
  }
};