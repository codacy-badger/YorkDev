module.exports = async (client, r, user) => {
  const message = r.message;
  const validEmojis = ['📌', '📍'];
  if (validEmojis.includes(r.emoji.name)) {
    try {
      await user.send(`Here is the message you pinned:\n${message.cleanContent}`);
    } catch (e) {
      if (e.message === 'Cannot send messages to this user') {
        await message.channel.send(`I cannot send you that message ${user}, as it appears you have **Direct Messages's** disabled.`);
      } else {
        console.log(e);
      }
    }
  }
};
