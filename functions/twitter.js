const Twit = require('twit');
const { Embed } = require('discord.js');


module.exports = client => {
  const twitter = new Twit(client.config.twitter);
  const twStream = twitter.stream('statuses/filter', { follow: client.config.twitterUser });

  twStream.on('tweet', tweet => {
    if (tweet.retweeted_status || tweet.user.id_str != client.config.twitterUser || tweet.in_reply_to_status_id != null ) return;
    const embed = new Embed()
      .setColor('#1DA1F2')
      .setAuthor(`[${tweet.user.screen_name} (@${tweet.user.name})](https://twitter.com/${tweet.user.name}/status/${tweet.id_str})`, tweet.user.profile_image_url)
      .setFooter('© FOG_Yamato', 'http://evie.ban-hammered.me/i/0lr7k.png')
      .setTimestamp(new Date())
      .setDescription(tweet.text)
      .setThumbnail(tweet.user.profile_image_url);
    if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url);
    client.channels.get(client.config.twitChannel).send({ embed });
  });
  
  twStream.on('connect', () => console.debug('Twitter Module: Connecting to Twitter API'));
  twStream.on('connected', () => console.debug('Twitter Module: Connected to Twitter API'));
  twStream.on('disconnect', () => console.debug('Twitter Module: Disconnected from Twitter API'));
};