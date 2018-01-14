const lint = require('../functions/linting/lint.js');
exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (message.content.match(/```[^`]+```/gi)) {
    lint(message);
  }
};