if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import App from 'containers/App';
import Home from 'routes/Home';
import injectAsyncReducer from 'common/store/injectAsyncReducer';

const createRoutes = (store) => {
  const root = {
    path: '/',
    component: App,
    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./Login').default(store),
          // require('./Post').default(store), // add async reducer
          // require('./NotFound').default
        ])
      })
    },

    indexRoute: {
      name: 'Home',
      component: Home
    }
  }

  return root
};

export default createRoutes;