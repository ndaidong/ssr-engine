// utils / getAssetPath

const {
  normalize,
} = require('path');

const {
  existsSync,
} = require('fs');

const getAssetPath = (opt) => {
  let {
    baseDir,
    srcDir,
    distDir,
    fileDir,
    fileName,
    fileExt,
  } = opt;

  if (fileExt !== '.js' && fileExt !== '.css') {
    return false;
  }

  let file = `${fileDir}/${fileName}${fileExt}`;
  let candidates = [
    `${baseDir}/${srcDir}/assets/${file}`,
    `${baseDir}/${distDir}/${file}`,
  ];

  let foundedFiles = candidates.map(normalize).filter((f) => {
    return existsSync(f);
  });

  if (foundedFiles.length > 0) {
    return foundedFiles[0];
  }
  return false;
};

module.exports = getAssetPath;
