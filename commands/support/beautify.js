const Command = require('../../base/Command.js');
const { js_beautify: beautify } = require('js-beautify');

class Beautify extends Command {
  constructor(client) {
    super(client, {
      name: 'beautify',
      description: 'Beautifies code with js-beautify.',
      usage: 'beautify',
      category: 'Support',
      botPerms: ['READ_MESSAGE_HISTORY']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const messages = message.channel.messages.array().reverse().filter(msg => msg.author.id !== message.client.user.id);
    let code;
    const codeRegex = /```(?:js|json|javascript)?\n?((?:\n|.)+?)\n?```/ig;
    for (let m = 0; m < messages.length; m++) {
      const msg = messages[m];
      const groups = codeRegex.exec(msg.content);
      if (groups && groups[1] && groups[1].length) {
        code = groups[1];
        break;
      }
    }

    if (!code) {
      throw 'No JavaScript code blocks found.';
    }

    let beautifiedCode = beautify(code, { indent_size: 2, brace_style: 'none' });
    beautifiedCode = this.reduceIndentation(beautifiedCode);
    message.channel.send(`${'```js'}\n${beautifiedCode}\n${'```'}`);
  }

  reduceIndentation(string) {
    let whitespace = string.match(/^(\s+)/);
    if (!whitespace) return string;
    whitespace = whitespace[0].replace('\n', '');
    const lines = string.split('\n');
    const reformattedLines = [];
    lines.forEach((line) => {
      reformattedLines.push(line.replace(whitespace, ''));
    });
    return reformattedLines.join('\n');
  }
}

module.exports = Beautify;