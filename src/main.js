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

const start = (middlewares = []) => {
  let config = getConfig();

  let {
    baseDir,
    srcDir,
    distDir,
    port,
    cacheTime,
  } = config;

  let jsDir = `${distDir}/js`;
  let cssDir = `${distDir}/css`;

  [
    distDir,
    cssDir,
    jsDir,
  ].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirp(dir);
    }
  });

  let staticOpt = {
    maxAge: cacheTime * 1000,
    etag: true,
    lastModified: true,
  };

  let app = express();
  app.set('config', config);
  app.set('etag', 'strong');
  app.disable('x-powered-by');

  middlewares.forEach((mw) => {
    app.use(mw);
  });

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

