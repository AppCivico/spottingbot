// Import external module
const
  async = require('async'),
  Twitter = require('twitter'),
  path = require('path'),
  fs = require('fs')
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
        let res = await calculateUserIndex(data)
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
        let res = await calculateFollowersScore(data)
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
        let res = await calculateFriendsScore(data)
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
        let res = await calculateTemporalNetwork(data)
        callback(null, res)
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

  function calculateUserIndex(data) {
    return new Promise(resolve => {
      let friends_ratio = 0
      let verified = data.verified
      let name = data.name
      let name_length = data.name.length
      let screen_name = data.screen_name
      let screen_name_length = data.screen_name.length
      let screen_name_digits = getNumberOfDigit(data.screen_name)
      let description_length = data.description.length
      let profile_image = data.profile_image_url
      if (data.friends_count !== 0) {
        friends_ratio = data.followers_count / data.friends_count
      }
      let age = convertTwitterDateToDaysAge(data.created_at)
      let number_of_tweets = data.statuses_count
      let ratio_tweets_day = number_of_tweets / age
      let number_of_favorites = data.favourites_count
      let offset = data.utc_offset
      if (verified) {
        resolve(0)
      }
      let nameCut = name.replace(/[\s_]+/g, '');
      let screenNameCut = screen_name.replace(/[\s_]+/g, '');
      let nameSimilarityScore = 1 - similarity(nameCut, screenNameCut);
      if (name.toLowerCase().indexOf("bot") !== -1 || screen_name.toLowerCase().indexOf("bot") !== -1) nameSimilarityScore = 1;
      let numberDigitScore = 0.15;
      if (screen_name_digits > 2) {
        numberDigitScore = screen_name_digits * 0.12
        if (numberDigitScore > 1) numberDigitScore = 1;
      }
      let nameLengthScore = 0.15;
      if (name_length > 15) {
        nameLengthScore = name_length * 0.009
        if (nameLengthScore > 1) nameLengthScore = 1;
      }
      let screenNameLengthScore = 0.15;
      if (screen_name_length > 10) {
        screenNameLengthScore = screen_name_length * 0.012
        if (screenNameLengthScore > 1) screenNameLengthScore = 1;
      }
      let descriptionLengthScore = 0.15;
      if (description_length < 10) {
        descriptionLengthScore = description_length * 0,1
        descriptionLengthScore = 1 - descriptionLengthScore
        if (descriptionLengthScore < 0) descriptionLengthScore = 0;
      }
      let ageScore = 1;
      if (age > 90) {
        ageScore = ageScore - age * 0.001
        if (ageScore < 0) ageScore = 0;
      }
      let friendScore = 1 - friends_ratio;
      if (friendScore < 0) friendScore = 0;
      let imageScore
      if (profile_image == null) imageScore = 1;
      else imageScore = 0.15
      let ratioTweetScore = ratio_tweets_day * 0.05;
      let favoritesScore = 1 - number_of_favorites * 0.01;
      if (favoritesScore < 0) favoritesScore = 0;
      let userScore = (nameSimilarityScore + numberDigitScore + nameLengthScore + screenNameLengthScore + descriptionLengthScore + ageScore + ratioTweetScore + favoritesScore + imageScore + friendScore) / 10
      if (userScore < 0) userScore = 0;
      else if (userScore > 1) userScore = 1;
      resolve(Math.round(userScore * 100))
    })
  }

  function calculateFollowersScore(data) {
    return new Promise(resolve => {
      let distribution_followers_offset = new Array()
      let distribution_followers_age = new Array()
      let distribution_followers_friends = new Array()
      let distribution_followers_followers = new Array()
      let distribution_followers_tweets = new Array()
      let followers_score = 0
      data.users.forEach(function(current) {
        if (current.utc_offset != null && distribution_followers_offset.indexOf(current.utc_offset) === -1) {
          distribution_followers_offset.push(current.utc_offset)
        }
        let current_age = Math.round(convertTwitterDateToDaysAge(current.created_at)/100)*100
        if (current.created_at != null && distribution_followers_age.indexOf(current_age) === -1) {
          distribution_followers_age.push(current_age)
        }
        let current_friends = Math.round(current.friends_count/100)*100
        if (current.friends_count != null && distribution_followers_friends.indexOf(current_friends) === -1) {
          distribution_followers_friends.push(current_friends)
        }
        let current_followers = Math.round(current.followers_count/100)*100
        if (current.followers_count != null && distribution_followers_followers.indexOf(current_followers) === -1) {
          distribution_followers_followers.push(current_followers)
        }
        let current_statuses = Math.round(current.statuses_count/100)*100
        if (current.statuses_count != null && distribution_followers_tweets.indexOf(current_statuses) === -1) {
          distribution_followers_tweets.push(current_statuses)
        }
      })
      let score_offset = distribution_followers_offset.length / 8
      let score_age = distribution_followers_age.length / 50
      let score_friends = distribution_followers_friends.length / 50
      let score_followers = distribution_followers_followers.length / 50
      let score_statuses = distribution_followers_tweets.length / 50
      if (score_offset > 1) score_offset = 1;
      if (score_age > 1) score_age = 1;
      if (score_friends > 1) score_friends = 1;
      if (score_followers > 1) score_followers = 1;
      if (score_statuses > 1) score_statuses = 1;
      followers_score = ((score_offset * 2) + score_age + score_friends + score_followers + score_statuses) / (5 * 2)
      resolve(Math.round(followers_score * 100))
    })
  }

  function calculateFriendsScore(data) {
    return new Promise(resolve => {
      let distribution_friends_offset = new Array()
      let distribution_friends_age = new Array()
      let distribution_friends_friends = new Array()
      let distribution_friends_followers = new Array()
      let distribution_friends_tweets = new Array()
      let friends_score = 0
      data.users.forEach(function(current) {
        if (current.utc_offset != null && distribution_friends_offset.indexOf(current.utc_offset) === -1) {
          distribution_friends_offset.push(current.utc_offset)
        }
        let current_age = Math.round(convertTwitterDateToDaysAge(current.created_at)/100)*100
        if (current.created_at != null && distribution_friends_age.indexOf(current_age) === -1) {
          distribution_friends_age.push(current_age)
        }
        let current_friends = Math.round(current.friends_count/100)*100
        if (current.friends_count != null && distribution_friends_friends.indexOf(current_friends) === -1) {
          distribution_friends_friends.push(current_friends)
        }
        let current_followers = Math.round(current.followers_count/100)*100
        if (current.followers_count != null && distribution_friends_followers.indexOf(current_followers) === -1) {
          distribution_friends_followers.push(current_followers)
        }
        let current_statuses = Math.round(current.statuses_count/100)*100
        if (current.statuses_count != null && distribution_friends_tweets.indexOf(current_statuses) === -1) {
          distribution_friends_tweets.push(current_statuses)
        }
      })
      let score_offset = distribution_friends_offset.length / 8
      let score_age = distribution_friends_age.length / 50
      let score_friends = distribution_friends_friends.length / 50
      let score_followers = distribution_friends_followers.length / 50
      let score_statuses = distribution_friends_tweets.length / 50
      if (score_offset > 1) score_offset = 1;
      if (score_age > 1) score_age = 1;
      if (score_friends > 1) score_friends = 1;
      if (score_followers > 1) score_followers = 1;
      if (score_statuses > 1) score_statuses = 1;
      friends_score = ((score_offset * 2) + score_age + score_friends + score_followers + score_statuses) / (5 * 2)
      resolve(Math.round(friends_score * 100))
    })
  }

  function calculateTemporalNetwork(data) {
    return new Promise(resolve => {
      let retweet_count = 0
      let count_network = 0
      let creationArray = new Array()
      let delayTwoTweets = new Array()
      data.forEach(function(current) {
        count_network += current.entities.hashtags.length
        count_network += current.entities.user_mentions.length
        let date = new Date(current.created_at + 'Z')
        creationArray.push(date)
        if (current.retweeted_status) {
          retweet_count++
        }
      })
      for (let i = 0; i < creationArray.length - 1; i++) {
        let diff = creationArray[i].getTime() - creationArray[i + 1].getTime()
        if (delayTwoTweets.indexOf(diff) === -1) {
          delayTwoTweets.push(diff)
        }
      }
      let average_network = (count_network / data.length) * 100
      let score_network = 0;
      if (average_network > 200) {
        score_network += average_network / 2
      }
      if (average_network > 100) {
        score_network = 100
      }
      let age = convertTwitterDateToDaysAge(data[0].user.created_at)
      let number_of_tweets = data[0].user.statuses_count
      let ratio_tweets_day = number_of_tweets / age
      let ratioTweetScore = ratio_tweets_day * 0.10;
      let temporal_score = ((1 - (delayTwoTweets.length + 2) / creationArray.length) + ratioTweetScore) * 100
      resolve([Math.round(temporal_score), Math.round(score_network)])
    })
  }

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
