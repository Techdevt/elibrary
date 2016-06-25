import { logoutUser } from 'common/actions/Auth';

export default function promiseMiddleware(client) {
  return ({dispatch, getState}) => {
      return next => action => {
        if (typeof action === 'function') {
          return action(dispatch, getState);
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
            (res) => next({...rest, res, type: SUCCESS}),
            (error) => {
              if(error.status === 403) {
                dispatch(logoutUser());
              }
              next({...rest, error, type: FAILURE})
            }
          )
          .catch(error => {
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