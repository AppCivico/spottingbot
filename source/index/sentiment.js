const sentiment = require('multilang-sentiment');

module.exports = function (data) {
  return new Promise((resolve) => {
    let sentimentNeutralSum = 0
    data.forEach(function(current) {
      let lang = current.lang;
      let text = current.text;
      if (lang === 'und') {
        lang = null
      }
      let res = sentiment(text, lang);
      if (res.comparative === 0) {
        sentimentNeutralSum++;
      }
    })
    let score_sentiment = sentimentNeutralSum / data.length;
    let weight = 2;
    resolve([score_sentiment, weight]);
  });
};
