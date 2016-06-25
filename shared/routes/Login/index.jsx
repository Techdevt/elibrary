if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import injectAsyncReducer from 'common/store/injectAsyncReducer';

export default function createRoutes (store) {
  return {
    path: 'login',
    name: 'Login',
    getComponents (location, cb) {
      require.ensure([
        './components/Login'
      ], (require) => {
        let LoginPage = require('./components/Login').default
        // let loginReducer = require('./reducer').default
        // injectAsyncReducer(store, 'posts', postReducer)
        cb(null, LoginPage)
      })
    }
  };
}