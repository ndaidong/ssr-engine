// config

const {
  createId,
} = require('bellajs');

let config = {
  ENV: 'production',
  port: 6789,
  host: '0.0.0.0',
  url: 'http://0.0.0.0:6789',
  baseDir: './',
  srcDir: './src',
  distDir: './dist',
  rev: createId(40),
  cacheTime: 3600, // 1 hour of HTTP cache
};

const configure = (conf = {}) => {
  let {
    url = '',
    host = '',
    port = '',
  } = conf;

  if (!url && host && port) {
    conf.url = `http://${host}:${port}`;
  }

  config = Object.assign(config, conf);
  return config;
};

const getConfig = () => {
  return Object.assign(config, {});
};

module.exports = {
  configure,
  getConfig,
};
