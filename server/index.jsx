import express                   from 'express';
import path                      from 'path';
import bodyParser                from 'body-parser';
import morgan                    from 'morgan';
import compression               from 'compression';
import router                    from './router';
import { v4 }                    from 'uuid';
import jwt                       from 'jsonwebtoken';
import session                   from 'express-session';
import sessionStore              from 'connect-mongo';
import { Map }                   from 'immutable';
import mongoose                  from 'mongoose';
import seedData                  from '../config/seed';
import { config, secrets }       from '../config';
import React                     from 'react';
import { renderToString }        from 'react-dom/server';
import { RouterContext, match }  from 'react-router';
import createHistory             from 'react-router/lib/createMemoryHistory';
import createRoutes              from 'routes';
import { Provider }              from 'react-redux';
import ApiClient                 from 'lib/ApiClient';
import createStore               from 'common/store/create';
import { trigger }               from 'redial';
import Html                      from 'lib/Html';
import { initDb, getDb }         from './helpers/database';

const app = express();
 
if (process.env.NODE_ENV !== 'production') {
  require('../webpack.dev').default(app);

  // //development::enable chai immutable
  // let chai = require('chai');
  // let chaiImmutable = require('chai-immutable');

  // chai.use(chaiImmutable);
}

let MongoStore = sessionStore(session);

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
app.set('jwtsecret', secrets["app:secret"]);
global.appRoot = path.resolve(__dirname);

//connect to mongodb
let conn = initDb();
app.use((req, res, next) => {
	const domain = req.hostname;
  if(domain.indexOf('127.0.0.1') === -1) {
      const subDomains = domain.split('.');
      //seed default database
      if(subDomains.length > 2) {
        conn = initDb(subDomain[0]);
      }
  }
  next();
});

seedData(conn);

// const Scheduler = new Agenda({db: {address: url, collection: "AgendaTasks"}});
// const JobInstance = new Jobs(Scheduler);
// JobInstance.register();

// app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(session({ 
  secret: secrets["app:secret"],
  genid: function() {
    return v4()
  },
  store: new MongoStore({ mongooseConnection: getDb() }),
  resave: true,
  saveUninitialized : false,
  unset: 'destroy',
  cookie: {
      maxAge: 604800000,
      expires: new Date(Date.now() + 604800000) 
    }
  }));

//initialize router
router(app);

app.use((req, res) => {
  function getLoggedUser() {
    return new Promise(function(resolve, reject) {
      if(req.session.token) {
        jwt.verify(req.session.token, config.secret, function(err, user) {
          //if(err) reject(err);
          if(user) {
            resolve(Map({
                isWaiting: false,
                user: {
                  ...user,
                  address: user.address.map((address) => ({...address, editable: false, isActive: false})),
                  socketID: null
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
          resolve(Map({
            isWaiting: false,
            user: null,
            shouldRedirect: false,
            redirectLocation: '',
            message: '',
            isAuthenticated: false,
            authSuccess: false,
            token: null
          }));
      }
    });
  }

  const client = new ApiClient(req);
  const history = createHistory(req.originalUrl);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      renderToString(<Html store={store}/>));
  }

  getLoggedUser().then(function(Account) {

    const store = createStore(client, { Account: Account, SourceRequest: {
      protocol: req.headers['x-forwarded-proto'] || req.protocol,
      host: req.headers.host
    }});

    const location = req.url;
    const routes = createRoutes(store);
    
      //hack for System.import

      // if (typeof System.import === 'undefined') {
      //   System.import = (path) => Promise.resolve((require(path)));
      // }

      match({ history, routes, location }, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          res.redirect(redirectLocation.pathname + redirectLocation.search);
        } else if (error) {
          console.error('ROUTER ERROR:', pretty.render(error));
          res.status(500);
          hydrateOnClient();
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
              const initialState = store.getState();
              
              const component = (
                <Provider store={store}>
                  <RouterContext {...renderProps} />
                </Provider>
              );
              
              res.status(200);

              global.navigator = {userAgent: req.headers['user-agent']};
              
              res.send('<!doctype html>\n' +
              renderToString(<Html component={component} store={store}/>));
            })
            .catch((err) => {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
            });
        } else {
          res.status(404).send('Not found');
        }
     });
  }, err => res.status(500).send('An Error Occured')); 
});

export default app;
