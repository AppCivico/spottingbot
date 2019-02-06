const library = require('../library');

module.exports = function (data) {
  return new Promise((resolve) => {
    let friends_ratio = 0;
    let name = data.name;
    let name_length = data.name.length;
    let screen_name = data.screen_name;
    let screen_name_length = data.screen_name.length;
    let screen_name_digits = library.getNumberOfDigit(data.screen_name);
    let description_length = data.description.length;
    let profile_image = data.profile_image_url;
    let age = library.convertTwitterDateToDaysAge(data.created_at);
    let ratio_tweets_day = data.statuses_count / age;
    if (data.verified) {
      resolve([0, 3]);
    }
    let nameCut = name.replace(/[\s_]+/g, '');
    let screenNameCut = screen_name.replace(/[\s_]+/g, '');
    let nameSimilarityScore = 1 - library.similarity(nameCut, screenNameCut);
    if (name.toLowerCase().indexOf('bot') !== -1 || screen_name.toLowerCase().indexOf('bot') !== -1) nameSimilarityScore = 1;
    let numberDigitScore = 0.15;
    if (screen_name_digits > 2) {
      numberDigitScore = screen_name_digits * 0.12;
      if (numberDigitScore > 1) numberDigitScore = 1;
    }
    let nameLengthScore = 0.15;
    if (name_length > 15) {
      nameLengthScore = name_length * 0.009;
      if (nameLengthScore > 1) nameLengthScore = 1;
    }
    let screenNameLengthScore = 0.15;
    if (screen_name_length > 10) {
      screenNameLengthScore = screen_name_length * 0.012;
      if (screenNameLengthScore > 1) screenNameLengthScore = 1;
    }
    let descriptionLengthScore = 0.15;
    if (description_length < 10) {
      descriptionLengthScore = description_length * 0.1;
      descriptionLengthScore = 1 - descriptionLengthScore;
      if (descriptionLengthScore < 0) descriptionLengthScore = 0;
    }
    let ageScore = 1;
    if (age > 90) {
      ageScore = ageScore - age * 0.001;
      if (ageScore < 0) ageScore = 0;
    }
    let imageScore;
    if (profile_image === null) imageScore = 1;
    else imageScore = 0.15;
    let ratioTweetScore = ratio_tweets_day * 0.05;
    let favoritesScore = 1 - data.favourites_count * 0.01;
    if (favoritesScore < 0) favoritesScore = 0;
    let userScore = (nameSimilarityScore + numberDigitScore + nameLengthScore + screenNameLengthScore + descriptionLengthScore + ageScore + ratioTweetScore + favoritesScore + imageScore) / 9;
    if (userScore < 0) userScore = 0;
    else if (userScore > 1) userScore = 1;
    resolve([userScore, 1]);
  });
};
