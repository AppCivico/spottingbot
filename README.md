# spottingbot
Analyzing profile on Twitter for detect behavior of a spamming bot

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

spottingbot(username, config)
```

`username` is a string that contains the screen name of the Twitter profile to analyze.

`config` is an object that contains Twitter credentials, both User and App-only authentication are supported, for App-only, the Bearer token will be automatically requested, the `config` object should be like:

```js
{
  consumer_key: "Your application consumer key",
  consumer_secret: "Your application consumer secret",
  access_token_key: "Your application access token key", // Only for User authentication
  access_token_secret: "Your application access token secret" // Only for User authentication
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

**_spottingbot is a project inspired by [Botometer](https://botometer.iuni.iu.edu/#!/), an [OSoMe](https://osome.iuni.iu.edu/) project

This project is part of the [PegaBot](http://www.pegabot.com.br) initiative.

PegaBot is a project of the [Institute of Technology and Society of Rio de Janeiro (ITS Rio)](https://itsrio.org), [Instituto Equidade & Tecnologia](https://tecnologiaequidade.org.br/) and [AppCívico](https://appcivico.com/).

spottingbot is an experimental project that needs you to evolve, do not hesitate to contribute on our [GitHub repository](https://github.com/AppCivico/spottingbot) or to contact us at [valentin@appcivico.com](mailto:valentin@appcivico.com)._**
