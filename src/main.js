// main.js

const {
  readdirSync,
  existsSync,
} = require('fs');

const {
  normalize,
  extname,
} = require('path');

const mkdirp = require('mkdirp').sync;

const express = require('express');

let {
  configure,
  getConfig,
} = require('./config');

const renderer = require('./renderer');

const onStarted = () => {
  return true;
};

const start = () => {
  let config = getConfig();

  let {
    baseDir,
    srcDir,
    distDir,
    port,
  } = config;

  if (!existsSync(distDir)) {
    mkdirp(distDir);
  }

  let staticOpt = {
    maxAge: 24 * 60 * 6e4,
    etag: true,
    lastModified: true,
  };

  let app = express();
  app.set('config', config);
  app.set('etag', 'strong');

  let staticDir = normalize(`${baseDir}/${srcDir}/assets/static`);
  if (existsSync(staticDir)) {
    app.use(express.static(staticDir, staticOpt));
  }

  app.use(renderer);

  let routerDir = normalize(`${srcDir}/routers`);
  readdirSync(routerDir).forEach((file) => {
    if (extname(file) === '.js') {
      let f = `${baseDir}/${routerDir}/${file}`;
      if (existsSync(f)) {
        require(f)(app);
      }
    }
  });

  app.use((req, res) => {
    return res.render404();
  });

  app.use((error, req, res) => {
    return res.render500(error);
  });

  app.listen(port, onStarted);

  return app;
};

module.exports = {
  configure,
  getConfig,
  start,
};

