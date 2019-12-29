const withCSS = require('@zeit/next-css')

// Note: newer versions of webpack / url-loader will not render icons correctly
// Current working versions:
// "@zeit/next-css": "^1.0.1"
// "file-loader": "^3.0.1"
// "url-loader": "^1.1.2"
// "webpack": "^4.29.0"
module.exports = withCSS({
  target: 'serverless',
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: '/_next/static/',
          outputPath: 'static/',
          name: '[name].[ext]',
        },
      },
    })
    return config
  },
})