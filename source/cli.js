// Import external module
const
  path = require('path'),
  fs = require('fs')

// Import our module
const analyze = require('./analyze')

// Get Twitter Configuration
const twitterConfigFile = path.join(__dirname, '../.twitter.json');
if (!fs.existsSync(twitterConfigFile)) {
  throw "No configuration file, please create '.twitter.json'."
}
const config = JSON.parse(fs.readFileSync(twitterConfigFile));
if (!config.twitter_consumer_key || !config.twitter_consumer_secret || !config.twitter_access_token_key || !config.twitter_access_token_secret) {
  throw ".twitter.json config file should have the following parameters:\ntwitter_consumer_key\ntwitter_consumer_secret\ntwitter_access_token_key\ntwitter_access_token_secret"
}

const screen_name = process.argv[2];
if (!screen_name) {
  throw "Please specific in argument a screen name to analyze"
}
console.log("Start analyzing the user", screen_name);

analyze(screen_name, config)
