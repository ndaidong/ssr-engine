// utils / extractCSS

const CACHE_LIFE_TIME = 120 * 6e4;

const cache = require('lru-cache')(30);

const postify = require('./postify');
const readFile = require('./readFile');
const isVendorAsset = require('./isVendorAsset');
const minifyCSS = require('./minifyCSS');

const {
  error,
  info,
} = require('./logger');

const extractCSS = async (cssFiles, tplId) => {
  try {
    let presaved = cache.get(tplId);
    if (presaved) {
      info('Use presaved CSS from cache.');
      return presaved;
    }

    info('Handling css files...');
    let vendorCSS = cssFiles.filter((file) => {
      return isVendorAsset(file);
    }).map(readFile);

    let promises = cssFiles.filter((file) => {
      return !isVendorAsset(file);
    }).map(postify);

    let siteCSS = await Promise.all(promises);

    let css = vendorCSS.concat(siteCSS).join('\n');
    let output = minifyCSS(css);
    cache.set(tplId, output, CACHE_LIFE_TIME);
    return output;
  } catch (err) {
    error(err);
    return null;
  }
};

module.exports = extractCSS;
