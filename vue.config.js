module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    port: 8081,
    host: 'localhost',
    allowedHosts: 'all'
  }
};