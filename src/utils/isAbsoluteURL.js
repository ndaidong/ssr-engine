// utils / isAbsoluteURL

const isAbsoluteURL = (file = '') => {
  let f = String(file);
  return f.startsWith('http') || f.startsWith('//');
};

module.exports = isAbsoluteURL;
