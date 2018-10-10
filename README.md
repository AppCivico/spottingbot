# spottingbot
Analyzing profile on Twitter for detect behavior of a spamming bot

**_spottingbot is an experimental and open-source project that needs you to evolve, do not hesitate to contribute on our [GitHub repository](https://github.com/AppCivico/spottingbot) by opening a pull request or to contact us at [valentin@appcivico.com](mailto:valentin@appcivico.com). A documentation about how the current indexes are calculated is also available [here](https://github.com/AppCivico/spottingbot/blob/master/documentation/)_**

**You can also join us on our [Telegram group](https://t.me/joinchat/AOHjCkUyx1zPuNzhf36mEw) for freely talk about suggestions, improvement or simply ask us anything**

## Usage

spottingbot can be used both as a [command-line interface application (cli)](https://github.com/AppCivico/spottingbot#command-line-interface) or as an [independent module](https://github.com/AppCivico/spottingbot#module)

### Command-line interface

#### Installation

`npm install`

#### Settings file

Create a `.twitter.json` file that contains:

```json
{
  "consumer_key": "Your application consumer key",
  "consumer_secret": "Your application consumer secret",
  "access_token_key": "Your application access token key, only for user authentication",
  "access_token_secret": "Your application access token secret, only for user authentication"
}
```

*Both User and App-only authentication are supported, for App-only, the Bearer token will be automatically requested*

#### Start

`npm start username`

*or*

`source/cli.js username`

*`username` have to be replaced by the profile to analyze*

#### Install bin locally on your system

`npm link` *sudo might be necessary*

*Then*

`spottingbot username`

### Module

#### Call

```js
const spottingbot = require('spottingbot');

spottingbot(username, twitter_config, index);
```

`username` is a string that contains the screen name of the Twitter profile to analyze.

`twitter_config` is an object that contains Twitter credentials, both User and App-only authentication are supported, for App-only, the Bearer token will be automatically requested, the `twitter_config` object should be like:

```js
{
  consumer_key: "Your application consumer key",
  consumer_secret: "Your application consumer secret",
  access_token_key: "Your application access token key", // Only for User authentication
  access_token_secret: "Your application access token secret" // Only for User authentication
}
```

`index` is used for disabling some index, it is an object that looks like
```js
{
  user: true,
  friend: true,
  temporal: true,
  network: true
}
```

By default, and if omitted, everything is `true`.

To disabling only one index, this is not necessary to put everything in the object, `{friend: false}`, is correct.

#### Return value

*spottingbot* handle both *callback* style and *node promise* style

##### Callback

```js
spottingbot(username, twitter_config, index, function(error, result) {
  if (error) {
    // Handle error
    return;
  }
  // Do something with result
})
```

##### Promise

```js
spottingbot(username, twitter_config, index)
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
         sentiment: {
           value: 0.65
         }
       },
       language_independent: {
         friend: 0.19,
         temporal: 0.37,
         network: 0.95,
         user: 0
       },
       bot_probability: {
         all: 0.37
       },
       user_profile_language: 'en',
     }
  ]
}
```

**spottingbot is a project inspired by [Botometer](https://botometer.iuni.iu.edu/#!/), an [OSoMe](https://osome.iuni.iu.edu/) project.**

**This project is part of the [PegaBot](http://www.pegabot.com.br) initiative.**

**PegaBot is a project of the [Institute of Technology and Society of Rio de Janeiro (ITS Rio)](https://itsrio.org), [Instituto Equidade & Tecnologia](https://tecnologiaequidade.org.br/) and [AppCívico](https://appcivico.com/).**

**spottingbot is an experimental and open-source project that needs you to evolve, do not hesitate to contribute on our [GitHub repository](https://github.com/AppCivico/spottingbot) by opening a pull request or to contact us at [valentin@appcivico.com](mailto:valentin@appcivico.com). A documentation about how the current indexes are calculated is also available [here](https://github.com/AppCivico/spottingbot/blob/master/documentation/)**
