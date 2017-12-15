// utils / compileJS

const readFile = require('./readFile');
const rollupify = require('./rollupify');
const isVendorAsset = require('./isVendorAsset');
const minifyJS = require('./minifyJS');

const compileJS = async (fileSrc, env = '') => {
  if (env === 'production') {
    return readFile(fileSrc);
  }
  if (isVendorAsset(fileSrc)) {
    let content = readFile(fileSrc);
    return minifyJS(content);
  }
  let js = await rollupify(fileSrc);
  return js;
};

module.exports = compileJS;
