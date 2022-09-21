const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app){
  app.use(
    createProxyMiddleware('/api1',{
      target:'http://127.0.0.1:5000',
      pathRewrite:{'^/api1':''}
    })
  )
}