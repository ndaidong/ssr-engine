// utils / compileHTML

const {
  extname,
  normalize,
} = require('path');

const {
  existsSync,
} = require('fs');

const {
  compileFile,
} = require('pug');

const {load} = require('cheerio');

const {
  md5,
} = require('bellajs');

const writeFile = require('./writeFile');

const {
  getConfig,
} = require('../config');

const minifyHTML = require('./minifyHTML');

const extractHTML = require('./extractHTML');
const extractCSS = require('./extractCSS');
const extractJS = require('./extractJS');

const optimize = async (content, templateName) => {
  let fileName = md5(templateName);
  let {
    distDir,
    rev,
  } = getConfig();

  let {
    css,
    js,
    html,
  } = await extractHTML(content);

  let $ = load(html);

  let sCSS = await extractCSS(css, fileName);
  if (sCSS) {
    let outputCSSFile = `${distDir}/css/${fileName}.css`;
    writeFile(outputCSSFile, sCSS);

    let subTag = `<link rel="subresource" href="css/${fileName}.css">`;
    $('head').append(subTag);
    let styleTag = `<link rel="stylesheet" type="text/css" href="css/${fileName}.css?rev=${rev}">`;
    $('head').append(styleTag);
  }

  let sJS = await extractJS(js, fileName);
  if (sJS) {
    let outputJSFile = `${distDir}/js/${fileName}.js`;
    writeFile(outputJSFile, sJS);

    let scriptTag = `<script type="text/javascript" defer="true" src="js/${fileName}.js?rev=${rev}"></script>`;
    $('body').append(scriptTag);
  }

  let output = minifyHTML($.html());
  return output;
};

const compileHTML = async (fileName = 'index', tplData = {}) => {
  let {
    baseDir,
    srcDir,
    ENV,
  } = getConfig();

  let tplFileSrc = normalize(`${baseDir}/${srcDir}/templates/${fileName}`);

  let fileExt = extname(fileName);
  if (fileExt !== '.pug') {
    tplFileSrc += '.pug';
  }
  if (existsSync(tplFileSrc)) {
    if (!tplData.meta) {
      tplData.meta = {};
    }

    let opt = ENV === 'production' ? {
      cache: true,
    } : {
      pretty: true,
      compileDebug: true,
    };

    let html = compileFile(tplFileSrc, opt)(tplData);

    return ENV === 'production' ? await optimize(html, fileName) : html;
  }

  return '';
};

module.exports = compileHTML;
