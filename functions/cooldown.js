module.exports = async function cooldown(user) {
  let talkedRecently = [];
  if (talkedRecently.includes(user)) {
    return;
  } else {
    talkedRecently.push(user);
    setTimeout(() => {
      const index = talkedRecently.indexOf(user);
      talkedRecently.splice(index, 1);
    }, 2500);
  }
};
