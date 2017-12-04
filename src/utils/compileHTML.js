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

const {
  getConfig,
} = require('../config');

const compileHTML = async (fileName = 'index', tplData = {}) => {
  let {
    baseDir,
    srcDir,
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
    let html = compileFile(tplFileSrc)(tplData);
    return html;
  }

  return '';
};

module.exports = compileHTML;
