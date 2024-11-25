// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/wp-json',
    createProxyMiddleware({
      target: 'http://your-wordpress-site.com', // Замените на URL вашего WordPress сайта
      changeOrigin: true,
      pathRewrite: {
        '^/wp-json': '/wp-json', // Перезапись пути, если необходимо
      },
    })
  );
};
