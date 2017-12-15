// utils / buildPage

const {
  basename,
  dirname,
  extname,
} = require('path');

const {load} = require('cheerio');

const {
  warning,
} = require('./logger');

const isAbsoluteURL = require('./isAbsoluteURL');
const getAssetPath = require('./getAssetPath');

const {
  getConfig,
} = require('../config');

const getRealPath = (path) => {
  let {
    baseDir,
    srcDir,
    distDir,
  } = getConfig();
  let fileDir = dirname(path);
  let fileExt = extname(path);
  let fileName = basename(path, fileExt);

  let fileSrc = getAssetPath({
    baseDir,
    distDir,
    srcDir,
    fileDir,
    fileName,
    fileExt,
  });

  return fileSrc;
};

const extractHTML = (content) => {
  let $ = load(content, {
    normalizeWhitespace: true,
  });

  let css = [];
  $('link[rel="stylesheet"]').each((k, el) => {
    let $el = $(el);
    let href = $el.attr('href') || '';
    if (href && !isAbsoluteURL(href)) {
      let realPath = getRealPath(href);
      if (realPath) {
        css.push(realPath);
      } else {
        warning(`File not found: "${href}"`);
      }
      $el.remove();
    }
  });

  let js = [];
  $('script').each((k, el) => {
    let $el = $(el);
    let src = $el.attr('src') || '';
    if (src && !isAbsoluteURL(src)) {
      let realPath = getRealPath(src);
      if (realPath) {
        js.push(realPath);
      } else {
        warning(`File not found: "${src}"`);
      }
      $el.remove();
    }
  });

  let html = $.html();

  return {
    html,
    css,
    js,
  };
};

module.exports = extractHTML;
