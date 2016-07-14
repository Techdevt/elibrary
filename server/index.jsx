import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import router from './router';
import { v4 } from 'uuid';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import sessionStore from 'connect-mongo';
import Immutable from 'immutable';
import seedData from '../config/seed';
import { config, secrets } from '../config';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { RouterContext, match } from 'react-router';
import createHistory from 'react-router/lib/createMemoryHistory';
import createRoutes from 'routes';
import { Provider } from 'react-redux';
import ApiClient from 'lib/ApiClient';
import createStore from 'common/store/create';
import { trigger } from 'redial';
import Html from 'lib/Html';
import { initDb, getDb } from './helpers/database';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { getS3Instance } from './helpers/storage';
import debug from 'debug';
import pretty from 'pretty-error';
import httpStatus from 'http-status';

const app = express();
const S3Client = getS3Instance();

if (process.env.NODE_ENV !== 'production') {
  /* eslint global-require: "off" */
  require('../webpack.dev').default(app);
}

const MongoStore = sessionStore(session);

app.use(compression());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(express.static('client'));
app.use(express.static('server/uploads'));
app.use(express.static('dist'));
app.set('views', 'server/views');
app.set('view engine', 'jade');
app.set('jwtsecret', secrets['app:secret']);
global.appRoot = path.resolve(__dirname);
global.debug = debug;

// connect to mongodb
let conn = initDb();
app.use((req, res, next) => {
  const domain = req.hostname;
  if (domain.indexOf('127.0.0.1') === -1) {
    const subDomains = domain.split('.');
    // seed default database
    if (subDomains.length > 2) {
      conn = initDb(subDomains[0]);
    }
  }
  next();
});

seedData(conn);

// const Scheduler = new Agenda({db: {address: url, collection: "AgendaTasks"}});
// const JobInstance = new Jobs(Scheduler);
// JobInstance.register();

// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(session({
  secret: secrets['app:secret'],
  genid: () => v4(),
  store: new MongoStore({ mongooseConnection: getDb() }),
  resave: true,
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    maxAge: 604800000,
    expires: new Date(Date.now() + 604800000),
  },
}));

const storage = multerS3({
  s3: S3Client,
  bucket: 'eworm',
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => cb(null, `${Math.random().toString(36)
    .slice(2, 10)}0${Date.now()}${path.extname(file.originalname)}`),
});

const limits = {
  fieldSize: 52428800,
};

const upload = multer({ storage, limits });

// initialize router
router(app, upload);

app.use((req, res) => {
  function getLoggedUser() {
    return new Promise((resolve) => {
      if (req.session.token) {
        jwt.verify(req.session.token, config.secret, (err, user) => {
          // if(err) reject(err);
          if (user) {
            resolve(Immutable.Map({
              isWaiting: false,
              user: {
                ...user,
                address: user.address.map(
                  (address) => ({ ...address, editable: false, isActive: false })
                ),
                socketID: null,
              },
              shouldRedirect: false,
              redirectLocation: '',
              message: '',
              isAuthenticated: true,
              authSuccess: false,
              token: req.session.token,
            }));
          }
        });
      } else {
        resolve(Immutable.Map({
          isWaiting: false,
          user: null,
          shouldRedirect: false,
          redirectLocation: '',
          message: '',
          isAuthenticated: false,
          authSuccess: false,
          token: null,
        }));
      }
    });
  }

  const client = new ApiClient(req);
  const history = createHistory(req.originalUrl);

  function hydrateOnClient(store) {
    res.send(`<!doctype html>
      ${renderToString(<Html store={store} />)}`);
  }

  getLoggedUser().then((Account) => {
    const store = createStore(client, {
      Account,
      SourceRequest: {
        protocol: req.headers['x-forwarded-proto'] || req.protocol,
        host: req.headers.host,
      },
    });

    const location = req.url;
    const routes = createRoutes(store);

    // hack for System.import

    // if (typeof System.import === 'undefined') {
    //   System.import = (path) => Promise.resolve((require(path)));
    // }

    match({ history, routes, location }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (error) {
        debug.log('ROUTER ERROR:', pretty.render(error));
        res.status(500);
        hydrateOnClient(store);
      } else if (renderProps) {
        const { components } = renderProps;
        const { dispatch } = store;
        const locals = {
          dispatch,
          store,
          client,
          path: renderProps.location.pathname,
          query: renderProps.location.query,
          params: renderProps.params,
        };

        trigger('fetch', components, locals)
          .then(() => {
            const component = (<Provider store={store}>
              <RouterContext {...renderProps} />
            </Provider>);

            res.status(200);

            global.navigator = { userAgent: req.headers['user-agent'] };

            res.send(`<!doctype html>
              ${renderToString(
                <Html
                  component={component}
                  store={store}
                />)}`
            );
          })
          .catch((err) => {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
          });
      } else {
        res.status(404).send('Not found');
      }
    });
  }, (err) => res.status(500).send(`An Error Occured: ${err}`));
});

export default app;
