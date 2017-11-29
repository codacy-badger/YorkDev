module.exports = class {

  static run(client, message, level) {
    this.checkAFK(client, message, level),
    this.linting = require('./linting.js').run(client, message, level),
    this.social = require('./social.js').run(client, message, level),
    this.nis = require('./nis.js').run(client, message, level),
    this.nms = require('./nms.js').run(client, message, level),
    this.everyone = require('./everyone.js').run(client, message, level);
  }

  static checkAFK(client, message, level) { // eslint-disable-line no-unused-vars
    if (!message.guild) return;
    const settings = client.botSettings.get('bot');
    const person = message.mentions.members.first();
    if (!person) return;
    if (person.id !== client.appInfo.owner.id) return;
    if (settings.afk) {
      message.reply(`${person.displayName} ${settings.afkMessage}`);
    }
  }
};
