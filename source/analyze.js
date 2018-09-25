// Import external module
const
  async = require('async'),
  Twitter = require('twitter')

// Import our module
const
  userIndex = require('./index/user'),
  friendsIndex = require('./index/friends'),
  temporalIndex = require('./index/temporal'),
  networkIndex = require('./index/network')

module.exports = function(screen_name, config) {
  // Create Twitter client
  const client = new Twitter({
        consumer_key: config.twitter_consumer_key,
        consumer_secret: config.twitter_consumer_secret,
        access_token_key: config.twitter_access_token_key,
        access_token_secret: config.twitter_access_token_secret
  });
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
          callback(null, res, data)
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
      let user = results[0][1]
      let userScore = results[0][0]
      let friendsScore = Math.round((results[1] + (results[2] * 1.5)) / (2 * 1.5))
      let temporalScore = results[3][0];
      let networkScore = results[3][1];
      let total = (userScore + friendsScore + temporalScore + networkScore) / 4
      console.log('User score:', userScore + '%\nFriends score:', friendsScore + '%\nTemporal score:', temporalScore + '%\nNetwork score:', networkScore + '%\nFinal score:', total + '%');
      let object = {
        metadata: {
          count: 1
        },
        profiles: new Array({
          username: param.screen_name,
          url: 'https://twitter.com/' + param.screen_name,
          avatar: user.profile_image_url,
          language_dependent: {
            content: {
              value: null
            },
            sentiment: {
              value: null
            }
          },
          language_independent: {
            friend: friendsScore,
            temporal: temporalScore,
            network: networkScore,
            user: userScore
          },
          bot_probability: {
            all: total,
            language_independent: total
          },
          share_link_on_social_network: ".",
          user_profile_language: user.lang,
          feedback_report_link: "."
        })
      };
      return object
    });
}
