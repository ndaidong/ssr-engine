// renderer.js

const {
  basename,
  dirname,
  extname,
} = require('path');

const {
  getConfig,
} = require('./config');

const {
  compileHTML,
  compileJS,
  compileCSS,
} = require('./utils/compiler');

const getAssetPath = require('./utils/getAssetPath');

const render = async (template, data = {}, res) => {
  let html = await compileHTML(template, data);
  return res.status(200).send(html);
};

const renderer = async (req, res, next) => {
  let {path = ''} = req;

  let {
    baseDir,
    distDir,
    srcDir,
  } = getConfig();

  let fileDir = dirname(path);
  let fileExt = extname(path);
  let fileName = basename(path, fileExt) || 'index';

  let fileSrc = getAssetPath({
    baseDir,
    distDir,
    srcDir,
    fileDir,
    fileName,
    fileExt,
  });

  if (fileExt === '.js') {
    let js = await compileJS(fileSrc);
    return res.status(200).type('text/javascript').send(js);
  }

  if (fileExt === '.css') {
    let css = await compileCSS(fileSrc);
    return res.status(200).type('text/css').send(css);
  }

  res.render404 = () => {
    return render('error', {
      title: '404 Page not found',
      errorCode: '404',
      message: 'Page not found',
    }, res);
  };

  res.render500 = () => {
    return render('error', {
      title: '500 Server error',
      errorCode: '500',
      message: 'Something wrong!',
    }, res);
  };

  res.render = (template, data = {}) => {
    return render(template, data, res);
  };

  return next();
};

module.exports = renderer;
