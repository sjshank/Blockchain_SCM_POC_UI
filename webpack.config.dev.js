const { merge } = require('webpack-merge');
const common = require('./webpack.config.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  target: 'web',
  devServer: {
    contentBase: './build',
    compress: false,
    https: false,
    disableHostCheck: true,
    port: "5000",
    headers: { "Access-Control-Allow-Origin": "*" },
    liveReload: true
  },
  stats: {
    colors: true,
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new BundleAnalyzerPlugin({
      openAnalyzer: false
    })
  ]
});