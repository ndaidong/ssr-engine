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
  babel: {
    presets: [
      [
        'env',
        {
          targets: {
            browsers: [
              '> 4%',
            ],
          },
        },
      ],
    ],
  },
  rev: createId(40),
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
