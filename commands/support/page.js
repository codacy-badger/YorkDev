const Command = require(`${process.cwd()}/base/Command.js`);
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
      description: 'Returns page details from the guidebook.',
      usage: 'page [-list] [name]',
      category:'Support',
      extended: '-add newPageName /path/to/page.html Snippet describing the page\n          -del pageName\n          -edit pageName This is new new edited snippet\n          -rename pageName newName\n          -export // exports and returns URL\n          -import http://url-to-import/\n          -list',
      aliases: ['guide', 'guides', 'pages', 'p'],
      botPerms: []
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
    if (level < 8) return;
    
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
      this.client.logger.error(error);
    }
  }
}

module.exports = Page;