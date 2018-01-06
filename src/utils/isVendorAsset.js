// utils / isVendorAsset

const isVendorAsset = (file = '') => {
  let f = String(file);
  return f.includes('node_modules/') || f.includes(`vendor/`);
};

module.exports = isVendorAsset;
