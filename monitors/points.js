function givePoints(client, message) {
  if (message.channel.type !== 'text') return;
  const settings = client.settings.get(message.guild.id);
  if (message.content.startsWith(settings.prefix)) return;
  const score = client.points.get(message.author.id) || { points: 0, level: 0 };
  score.points++;
  const curLevel = Math.floor(0.1 * Math.sqrt(score.points));
  if (score.level < curLevel) {
    if (settings.social === 'true')
      message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
    score.level = curLevel;
  }
  client.points.set(message.author.id, score);
}

module.exports = { givePoints };
