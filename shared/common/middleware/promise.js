import { logoutUser } from 'common/actions/Auth';
import AppLoading     from 'lib/appLoading';

//tap into xhr requests...show app loading effect
export default function promiseMiddleware(client) {
  return ({dispatch, getState}) => {
      return next => action => {
        if (typeof action === 'function') {
          return action(dispatch, getState);
        }
        let _AppLoading;
        if(process.env.BROWSER) {
            _AppLoading = new AppLoading();
            _AppLoading.start();
        }

        const { promise, type, ...rest } = action;
        
        if (!promise) return next(action);
     
        const SUCCESS = type;

        const REQUEST = type + '_REQUEST';
        const FAILURE = type + '_FAILURE';

        next({ ...rest, type: REQUEST });

        const actionPromise = promise(client);
        actionPromise
          .then(
            (res) => {
              if(process.env.BROWSER) _AppLoading.stop();
              next({...rest, res, type: SUCCESS})
            },
            (error) => {
              if(process.env.BROWSER) _AppLoading.stop();
              if(error.status === 403) {
                dispatch(logoutUser());
              }
              next({...rest, error, type: FAILURE})
            }
          )
          .catch(error => {
            if(process.env.BROWSER) _AppLoading.stop();
            console.error('MIDDLEWARE ERROR:', error);
            if(error.status === 403) {
                dispatch(logoutUser());
            }
            return next({...rest, error, type: FAILURE});
          });
          return actionPromise;
      };
  };
}