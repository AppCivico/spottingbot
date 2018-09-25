// Import external module
const
  async = require('async'),
  Twitter = require('twitter'),
  path = require('path'),
  fs = require('fs')

// Import our module
const
  userIndex = require('./index/user'),
  friendsIndex = require('./index/friends'),
  temporalIndex = require('./index/temporal'),
  networkIndex = require('./index/network')

// Get Twitter Configuration
const twitterConfigFile = path.join(__dirname, '.twitter.json');
if (!fs.existsSync(twitterConfigFile)) {
  throw "No configuration file, please create '.twitter.json'."
}
const config = JSON.parse(fs.readFileSync(twitterConfigFile));
if (!config.twitter_consumer_key || !config.twitter_consumer_secret || !config.twitter_access_token_key || !config.twitter_access_token_secret) {
  throw ".twitter.json config file should have the following parameters:\ntwitter_consumer_key\ntwitter_consumer_secret\ntwitter_access_token_key\ntwitter_access_token_secret"
}

// Create Twitter client
const client = new Twitter({
      consumer_key: config.twitter_consumer_key,
      consumer_secret: config.twitter_consumer_secret,
      access_token_key: config.twitter_access_token_key,
      access_token_secret: config.twitter_access_token_secret
});

const screen_name = process.argv[2];
if (!screen_name) {
  throw "Please specific in argument a screen name to analyze"
}
console.log("Start analyzing the user", screen_name);
let param = {
  screen_name: screen_name
};

async.parallel([
    function(callback) {
      client.get('users/show', param, async function(error, tweets, response_twitter_user) {
        if (error) {
          callback(error);
          return;
        }
        let data = JSON.parse(response_twitter_user.body)
        let res = await userIndex(data)
        callback(null, res)
      })
    },
    function(callback) {
      param.count = 200;
      client.get('followers/list', param, async function(error, tweets, response_twitter_user) {
        if (error) {
          callback(error);
          return;
        }
        let data = JSON.parse(response_twitter_user.body)
        let res = await friendsIndex(data)
        callback(null, res)
      })
    },
    function(callback) {
      param.count = 200;
      client.get('friends/list', param, async function(error, tweets, response_twitter_user) {
        if (error) {
          callback(error);
          return;
        }
        let data = JSON.parse(response_twitter_user.body)
        let res = await friendsIndex(data)
        callback(null, res)
      })
    },
    function(callback) {
      param.count = 200;
      client.get('statuses/user_timeline', param, async function(error, tweets, response_twitter_user) {
        if (error) {
          callback(error);
          return;
        }
        let data = JSON.parse(response_twitter_user.body)
        let res1 = await temporalIndex(data)
        let res2 = await networkIndex(data)
        callback(null, [res1, res2])
      })
    }
  ], function(err, results) {
    if (err) {
      console.error(err);
      return;
    }
    let userScore = results[0]
    let friendsScore = Math.round((results[1] + (results[2] * 1.5)) / (2 * 1.5))
    let temporalScore = results[3][0];
    let networkScore = results[3][1];
    let total = (userScore + friendsScore + temporalScore + networkScore) / 4
    console.log('User score:', userScore + '%\nFriends score:', friendsScore + '%\nTemporal score:', temporalScore + '%\nNetwork score:', networkScore + '%\nFinal score:', total + '%');
  });

  function getNumberOfDigit(string) {
    return string.replace(/[^0-9]/g,"").length
  }

  function convertTwitterDateToDaysAge(date) {
    let split = date.split(' ');
    let month = new Date(Date.parse(split[1] +" 1, 2012")).getMonth();
    let day = split[2];
    let year = split[split.length-1];
    let oneDay = 24*60*60*1000;
    let firstDate = new Date(year,month,day);
    let now = new Date();
    let diffDays = Math.round(Math.abs((firstDate.getTime() - now.getTime())/(oneDay)));
    return diffDays;
  }

  function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
