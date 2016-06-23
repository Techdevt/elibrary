import React       from 'react';
import { render }  from 'react-dom';
import routes      from 'routes';
import { Provider } from 'react-redux';
import immutifyState from 'lib/immutifyState';
import createStore from 'lib/redux/create';
import ApiClient   from 'lib/ApiClient';
import { Router, browserHistory, match } from 'react-router';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { trigger } from 'redial';

const initialState = immutifyState(window.__INITIAL_STATE__);

const client = new ApiClient();
const history = useScroll(() => browserHistory)();
const store = createStore(history, client, initialState);

const { dispatch } = store;
const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;
const container = document.getElementById('App');

match({ routes, location }, () => {
  render((
    <Provider store={store}>
        <Router history={history} routes={routes} />
    </Provider>
  ), container);
});

browserHistory.listen(location => {
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    const { components } = renderProps;
    const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        dispatch,
        client,
        store
      };

    if (window.__INITIAL_STATE__) {
      delete window.__INITIAL_STATE__;
    } else {
      trigger('fetch', components, locals);
    }
    trigger('defer', components, locals);
  });
});

Promise.prototype.finally = function(onResolveOrReject) {
  return this.catch(function(reason){
    return reason;
  }).then(onResolveOrReject);
};

Promise.prototype.always = function(onResolveOrReject) {
  return this.then(onResolveOrReject,
    function(reason) {
      onResolveOrReject(reason);
    });
};
