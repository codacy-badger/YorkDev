const Command = require('../../base/Command.js');
const { RichEmbed, Collection } = require('discord.js');
const request = require('snekfetch');
const gcolor = ['#4285FA', '#0F9D58', '#F4B400', '#DB4437'];

class Translate extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      description: 'Translates a given message.',
      category: 'Utilities',
      usage: 'translate <language|-detect|-codes> <sentence>',
      extended: 'This command will translate any given message if a valid language code is supplied.',
      aliases: ['tr']
    });

    this.init = async client => {
      client.languages = new Collection;
      const {body} = await request.post(`https://translation.googleapis.com/language/translate/v2/languages?key=${client.config.apikey}`).send({target:'en'});
      body.data.languages.forEach((d)=>{
        client.languages.set(d.language, {lang: d.language, name: d.name});
      });

    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const embed = new RichEmbed()
        .setColor(gcolor[Math.floor(Math.random() * gcolor.length)])
        .setFooter('Google Translate');

      if (!args[0] && !message.flags.length) {
        return message.channel.send(this.help.usage);
      }

      if (message.flags[0] === 'codes') {
        const langCodes = [];
        const langNames = [];
        this.client.languages.map(l => {
          langCodes.push(l.lang);
          langNames.push(l.name);
        });
        embed.addField('Name', langNames, true)
          .addField('Code', langCodes, true);
        message.channel.send({embed});
      }
      
      else {

        let target = '';
        if (message.flags[0] === 'detect') {
          target = 'en';
        } else {
          target = args[0];
          const code = this.client.languages.find('lang', target);
          if (!code) throw 'Unsupported Language, please issue the command again with the `-codes` flag to see a list of supported languages.';
        }
        
        const lang = args[0];
        if (!message.flags[0]) args.shift();
        const phrase = args.join(' ');
        const res = await request.post(`https://translation.googleapis.com/language/translate/v2?key=${this.client.config.apikey}`).send({ q: phrase, target:target });
        embed.setColor(gcolor[Math.floor(Math.random() * gcolor.length)])
          .setThumbnail('http://nyamato.me/i/kbfuj.png')
          .addField('Original Message', phrase)
          .addField('Translated Message', this.decodeHtmlEntity(res.body.data.translations[0].translatedText))
          .addField(`${message.flags[0] ? 'Detected' : 'Selected'} Language`, message.flags[0] ? `${this.client.languages.get(res.body.data.translations[0].detectedSourceLanguage).name} (${res.body.data.translations[0].detectedSourceLanguage})` : `${this.client.languages.get(lang).name} (${lang})`);

        message.channel.send({embed});
      }
    } catch (error) {
      throw error;
    }
  }

  decodeHtmlEntity(str) {
    return str.replace(/&#(\d+);/g, function(match, dec) {
      return String.fromCharCode(dec);
    });
  }

}

module.exports = Translate;