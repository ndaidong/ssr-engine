// utils / extractJS

const CACHE_LIFE_TIME = 120 * 6e4;

const cache = require('lru-cache')(30);

const rollupify = require('./rollupify');
const readFile = require('./readFile');
const isVendorAsset = require('./isVendorAsset');
const minifyJS = require('./minifyJS');

const {
  error,
  info,
} = require('./logger');

const extractJS = async (jsFiles, tplId) => {
  try {
    let presaved = cache.get(tplId);
    if (presaved) {
      info('Use presaved JS from cache.');
      return presaved;
    }

    info('Handling javascript files...');
    let vendorJS = jsFiles.filter((file) => {
      return isVendorAsset(file);
    }).map(readFile);

    let promises = jsFiles.filter((file) => {
      return !isVendorAsset(file);
    }).map(rollupify);

    let siteJS = await Promise.all(promises);

    let js = vendorJS.concat(siteJS).join('\n');

    let output = minifyJS(js);
    cache.set(tplId, output, CACHE_LIFE_TIME);
    return output;
  } catch (err) {
    error(err);
    return null;
  }
};

module.exports = extractJS;
