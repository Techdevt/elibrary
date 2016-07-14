if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes() {
  return {
    path: 'login',
    name: 'Login',
    getComponents(location, cb) {
      require.ensure([
        './components/Login',
      ], (require) => {
        const LoginPage = require('./components/Login').default;
        // let loginReducer = require('./reducer').default
        // injectAsyncReducer(store, 'posts', postReducer)
        cb(null, LoginPage);
      });
    },
  };
}
