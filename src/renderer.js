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


const send = (res, type, content) => {
  let {
    ENV,
    cacheTime,
  } = getConfig();
  if (ENV === 'production') {
    res.set('Cache-Control', 'public, max-age=' + cacheTime);
    res.set('Expires', new Date(Date.now() + cacheTime * 1000).toUTCString());
  }
  return res.status(200).type(type).send(content);
};

const render = async (template, data = {}, res) => {
  let html = await compileHTML(template, data);
  return send(res, 'text/html', html);
};

const renderer = async (req, res, next) => {
  let {path = ''} = req;

  let {
    baseDir,
    distDir,
    srcDir,
    ENV,
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
    let js = await compileJS(fileSrc, ENV);
    return send(res, 'text/javascript', js);
  }

  if (fileExt === '.css') {
    let css = await compileCSS(fileSrc, ENV);
    return send(res, 'text/css', css);
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
