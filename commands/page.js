const Command = require('../base/Command.js');
const baseUrl = 'https://anidiots.guide';

/*
Relies on the following lines in app.js:
const PersistentCollection = require('djs-collection-persistent');
client.pages = new PersistentCollection({name: 'guidepages'});
Want all the pages? run this:
/guide -import http://how.evie-banned.me/raw/linelipajo
*/

class Page extends Command {
  constructor(client) {
    super(client, {
      name: 'page',
      description: 'Returns page details from the awesome bot guide.',
      usage: 'page [-list] [name]',
      category:'Support',
      extended: `-add newPageName /path/to/page.html Snippet describing the page
          -del pageName
          -edit pageName This is new new edited snippet
          -rename pageName newName
          -export // exports and returns URL
          -import http://url-to-import/
          -list`,
      aliases: ['guide', 'guides', 'g', 'pages', 'p'],
    });

    this.init = client => {
      this.db = new client.db(client, 'guides');
      this.db.extendedHelp = this.help.extended;
      client.guides = this.db;
    };
  }

  async run(message, args, level) {
    if (!args[0]) args[0] = 'home';
    
    if (!message.flags.length) {
      let name = args[0];
      if (!this.db.has(name)) name = 'home';
      const details = this.db.get(name);
      return message.channel.send(`${details.snippet}\n**Read More**: <${baseUrl}${details.url}>`);
    }
    
    if (message.flags[0] === 'list') return message.channel.send(this.db.list());
    if (level < 2) return;
    
    const [name, ...extra] = args.slice(0);
    let data = null;
    switch (message.flags[0]) {
      case ('add'): {
        let [url, ...snippet] = extra; // eslint-disable-line prefer-const
        snippet = snippet.join(' ');
        if (name.indexOf('/') == 0) return message.channel.send('You seem to have forgotten a tag name...');
        if (url.indexOf('/') !== 0) return message.channel.send('URL is absolute and must start with `/`');
        if (!snippet) return message.channel.send('You seem to have forgotten a tag name...');
        data = {url, snippet};
        break;
      }
      default :
        data = extra.join(' ');
    }
    
    try {
      const response = await this.db[message.flags[0]](name, data);
      message.channel.send(response);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Page;