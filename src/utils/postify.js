// utils / postify

const postcss = require('postcss');
const presetenv = require('postcss-preset-env');
const mqpacker = require('css-mqpacker');
const atImport = require('postcss-import');

const {
  error,
} = require('./logger');

const readFile = require('./readFile');

const POSTCSS_PLUGINS = [
  atImport(),
  presetenv({
    stage: 3,
  }),
  mqpacker({
    sort: true,
  }),
];

const postify = async (fileSrc) => {
  try {
    let plugins = [...POSTCSS_PLUGINS];
    let css = readFile(fileSrc);
    let result = await postcss(plugins).process(css, {
      from: fileSrc,
    });
    return result.css;
  } catch (err) {
    error(err);
    return err;
  }
};

module.exports = postify;
