# spottingbot
Analyzing profile on Twitter for detect behavior of spamming bot

## Installation:

`npm install`

## Usage

### Command-line interface

Create a `.twitter.json` file that contains:

```json
{
  "twitter_consumer_key": "Your application consumer key",
  "twitter_consumer_secret": "Your application consumer secret",
  "twitter_access_token_key": "Your application access token key",
  "twitter_access_token_secret": "Your application access token secret"
}
```

Then

`npm start username`

or

`source/cli.js username`

*`username` have to be replaced by the profile to analyze*

#### Install bin locally on your system

`npm link`

Then

`spottingbot username`

### Module

#### Call

```js
const spottingbot = require('spottingbot');

spottingbot(username, config)
```

`username` is a string that contains the screen name of the Twitter profile to analyze.

`config` is an object that contains Twitter app credentials, it should be like:

```js
{
  twitter_consumer_key: "Your application consumer key",
  twitter_consumer_secret: "Your application consumer secret",
  twitter_access_token_key: "Your application access token key",
  twitter_access_token_secret: "Your application access token secret"
}
```

#### Return value

*spottingbot* handle both *callback* style and *node promise* style

##### Callback

```js
spottingbot(username, config, function(error, result) {
  if (err) {
    // Handle error
  }
  // Do something with result
})
```

##### Promise

```js
spottingbot(username, config)
  .then(result => {
    // Do something with result
  })
  .catch(error => {
    // Handle error
  })
```

##### Value

The return value is an object that contains

```js
{
  metadata: {
    count: 1 // Always 1 for now
  },
  profiles: [
     {
       username: 'screen_name',
       url: 'https://twitter.com/screen_name',
       avatar: 'image link',
       language_dependent: {
         content: {
           value: 0  // Unused for now
         },
         sentiment: {
           value: 0  // Unused for now
         }
       },
       language_independent: {
         friend: 0.19,
         temporal: 0.37,
         network: 0.95,
         user: 0
       },
       bot_probability: {
         all: 0.37,
         language_independent: 0.37
       },
       share_link_on_social_network: '.', // Unused
       user_profile_language: 'en',
       feedback_report_link: '.'  // Unused
     }
  ]
}
```

**spottingbot is a project inspired by [Botometer](https://botometer.iuni.iu.edu/#!/), an [OSoMe](https://osome.iuni.iu.edu/) project**

**This project is part of the [PegaBot](http://www.pegabot.com.br) initiative.**

**PegaBot is a project of the [Institute of Technology and Society of Rio de Janeiro (ITS Rio)](https://itsrio.org), [Instituto Equidade & Tecnologia](https://tecnologiaequidade.org.br/) and [AppCívico](https://appcivico.com/).**

**spottingbot is an experimental project that needs you to evolve, do not hesitate to contribute on our [GitHub repository](https://github.com/AppCivico/spottingbot) or to contact us at [valentin@eokoe.com](mailto:valentin@eokoe.com).**
