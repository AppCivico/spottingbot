#!/usr/bin/env node

// Import external module
const
  path = require('path'),
  fs = require('fs')

// Import our module
const analyze = require('./analyze')

// Get Twitter Configuration
const twitterConfigFile = path.join(__dirname, '../.twitter.json');
if (!fs.existsSync(twitterConfigFile)) {
  console.error("No configuration file, please create '.twitter.json'.");
  return;
}
const config = JSON.parse(fs.readFileSync(twitterConfigFile));
/*if (!config.twitter_consumer_key || !config.twitter_consumer_secret || !config.twitter_access_token_key || !config.twitter_access_token_secret) {
  throw ".twitter.json config file should have the following parameters:\ntwitter_consumer_key\ntwitter_consumer_secret\ntwitter_access_token_key\ntwitter_access_token_secret"
}*/

const screen_name = process.argv[2];
if (!screen_name) {
  console.error("Please specific in argument a screen name to analyze");
  return;
}
console.log("Start analyzing the user", screen_name);

analyze(screen_name, config).then(function(info) {
  let userScore = info.profiles[0].language_independent.user;
  let friendsScore = info.profiles[0].language_independent.friend;
  let temporalScore = info.profiles[0].language_independent.temporal;
  let networkScore = info.profiles[0].language_independent.network;
  let total = info.profiles[0].bot_probability.all
  console.log('User score:', userScore + '%\nFriends score:', friendsScore + '%\nTemporal score:', temporalScore + '%\nNetwork score:', networkScore + '%\nFinal score:', total + '%');
}).catch(function(err) {
  console.error(err);
})
