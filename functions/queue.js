class Queue extends Array {
  constructor() {
    super();
    Object.defineProperty(this, '_started', { writable: true, value: false });

    return new Proxy(this, {
      set(target, prop, value) {
        target[prop] = value;
        if (!isNaN(prop)) target.start();
        return true;
      },
    });
  }

  async start() {
    if (this._started) return;
    this._started = true;

    while (this.length) {
      const func = this.shift();
      if (func) await func();
    }

    this._started = false;
  }
}

module.exports = Queue;