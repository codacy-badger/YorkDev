module.exports = class {

  static run(client, message, level) {
    this.linting = require('./linting.js').run(client, message, level),
    this.nis = require('./nis.js').run(client, message, level),
    this.nms = require('./nms.js').run(client, message, level),
    this.everyone = require('./everyone.js').run(client, message, level);
  }
};
