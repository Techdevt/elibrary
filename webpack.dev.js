import webpack from 'webpack';
import assign from 'object-assign';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import prodCfg from './webpack.prod.config.js';
import path from 'path';
import { config as appConfig } from './config';

Object.assign = assign;

const BABEL_QUERY = {
  presets: ['react', 'es2015', 'stage-0'],
  plugins: [
    [
      'react-transform', {
        transforms: [{
          transform: 'react-transform-hmr',
          imports: ['react'],
          locals: ['module'],
        }],
      },
    ],
  ],
};

export default function (app) {
  const config = Object.assign(prodCfg, {
    devtool: 'eval',
    entry: {
      bundle: [
        'webpack-hot-middleware/client',
        './client',
      ],
      vendor: [
        'webpack-hot-middleware/client', 'react', 'react-dom',
      ],
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: BABEL_QUERY,
      }, {
        test: /\.scss$/,
        include: path.join(__dirname, '/shared/styles'),
        loader: 'style!css!sass',
      }, {
        test: /\.css$/,
        loader: 'style!css',
      }, {
        test: /\.gif$/,
        loader: 'url-loader?limit=10000&mimetype=image/gif',
      }, {
        test: /\.jpg$/,
        loader: 'url-loader?limit=10000&mimetype=image/jpg',
      }, {
        test: /\.png$/,
        loader: 'url-loader?limit=10000&mimetype=image/png',
      }, {
        test: /\.svg/,
        loader: 'url-loader?limit=26000&mimetype=image/svg+xml',
      }, {
        test: /\.(woff|woff2|ttf|eot)/,
        loader: 'url-loader?limit=100000',
      },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          CONFIG: JSON.stringify(appConfig),
        },
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
  });

  const compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
  }));
  app.use(webpackHotMiddleware(compiler));
}
