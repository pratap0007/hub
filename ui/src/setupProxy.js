const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware(['/auth', '/user'], {
      target: 'http://localhost:4200',
      changeOrigin: true
    })
  );
  app.use(
    createProxyMiddleware(['/resource/**/rating'], {
      target: 'http://localhost:8000',
      changeOrigin: true
    })
  );
};

//  typescript http proxy middleware
// import express from 'express';
// import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';

// import API_URL from './config/constants';

// const app = express();

// app.use(
//   '/auth/providers',
//   createProxyMiddleware({
//     target: 'http://localhost:4200/auth/providers',
//     changeOrigin: true
//   })
// );

// app.listen(4200);
