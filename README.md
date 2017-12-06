# ssr-engine
Engine for server site renderer

[![Build Status](https://travis-ci.org/ndaidong/ssr-engine.svg?branch=master)](https://travis-ci.org/ndaidong/ssr-engine)
[![Dependency Status](https://gemnasium.com/badges/github.com/ndaidong/ssr-engine.svg)](https://gemnasium.com/github.com/ndaidong/ssr-engine)
[![NSP Status](https://nodesecurity.io/orgs/techpush/projects/9e06e9e7-d07b-4d18-9280-4031ad6e3298/badge)](https://nodesecurity.io/orgs/techpush/projects/9e06e9e7-d07b-4d18-9280-4031ad6e3298)

# Usage

#### App structure

Setup website data by the default structure as below:

```
  |-- src
      |-- assets
          |-- css
          |-- js
          |-- static
      |-- configs
      |-- pages
      |-- routers
      |-- templates
          |-- components
          |-- layouts
          |-- index.pug
  |-- package.json
  |-- server.js
```

#### Initiate

Install `ssr-engine` as regular npm module if not yet:

```
npm i ssr-engine
```

Then, in `server.js`:

```
// server.js

const ssre = require('ssr-engine');
const config = require('./src/configs');
config.baseDir = __dirname;

ssre.configure(config);

let app = ssre.start();
let appConfig = app.get('config');
let {
  ENV,
  url,
  port,
} = appConfig;

console.log(`Server started at the port ${port} in ${ENV} mode`);
console.log('Access website via', `${url}`);

module.exports = app;
```

With the above code, `ssr-engine` will do the following tasks:

- load the config from `src/configs`
- start Express server
- attach the routers from `src/routers`


#### Routing

In the routers, we declare the equivalent page's scripts.

Here is a simple router:

```
const home = require('../pages/home');
const api = require('../pages/api');

module.exports = (app) => {
  app.get('/', home.start);
  app.get('/json', api.json);
};
```

#### Page script

Page script is place where we define app's logic, such as retrieve remote data then response in JSON format, or load template file then render as HTML content.

Here is `pages/api.js` for the above router:

```
const json = (req, res) => {
  return res.json({
    message: 'Hello world',
  });
};

module.exports = {
  json,
};
```

And `pages/home.js`:

```
const {
  readFile,
} = require('../utils');

const start = (req, res) => {
  let data = {
    title: 'Welcome',
    message: 'Hello world',
  };
  return res.render('index', data);
};

module.exports = {
  start,
};
```

#### Templates

`ssr-engine` uses [Pug](https://www.npmjs.com/package/pug), that means we have to write template in [Pug syntax](https://pugjs.org/).

As we written in the above `pages/home.js`, at the end, we called res.render() method with 2 params. In which:

- the first param is template file name, that will map to `templates/index.pug`
- the second param is template data, will be parsed by Pug

For example:

```
//- templates/index.pug
h1 #{title}
.message #{message}
```


#### Assets & static data

In the template files, we can insert CSS and JavaScript files as normal.

Local CSS and JS resources should be placed under `src/assets/css` and  `src/assets/jss` folders. They will be processed by PostCSS and Rollup, so that we are able to use the latest features in CSS4 or ES7 without problem.

Third party CSS/JS - by running `npm run setup` - were saved into `dist/vendor`. They, similar to other external resources, will be ignored.

Static data such as images, fonts, etc should be stored at `src/assets/static`. The whole content within this directory are public to the client.

// Coming soon



# License

The MIT License (MIT)
