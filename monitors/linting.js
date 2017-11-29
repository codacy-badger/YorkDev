const lint = require('../functions/linting/lint.js');
const lang = require('lang-detector');
exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (message.content.match(/```js\s(.|\s)+```/gi)) {
    lint(message);
  } else if (message.content.match(/```(.|\s)+```/gi) && lang(message.content.replace(/```(js)?|```/gi, '')) === 'JavaScript') {
    lint(message);
  }
};