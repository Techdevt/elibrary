import React from 'react';
import { render } from 'react-dom';
import createRoutes from 'routes';
import { Provider } from 'react-redux';
import immutifyState from 'lib/immutifyState';
import createStore from 'common/store/create';
import ApiClient from 'lib/ApiClient';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { trigger } from 'redial';
// import AppLoading     from 'lib/appLoading';

const initialState = immutifyState(window.__INITIAL_STATE__);

const client = new ApiClient();
// const _AppLoading = new AppLoading();
const history = useScroll(() => browserHistory)();
const store = createStore(client, initialState);
const routes = createRoutes(store);

const { dispatch } = store;
const { pathname, search, hash } = window.location;
const $location = `${pathname}${search}${hash}`;
const container = document.getElementById('App');

match({ routes, location: $location }, () => {
  render((
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  ), container);
});

browserHistory.listen(() => {
  // dispatch route changing //pageTransitioning
  // _AppLoading.start();
  match({ routes, location: $location }, (error, redirectLocation, renderProps) => {
    const { components } = renderProps;
    const locals = {
      path: renderProps.location.pathname,
      query: renderProps.location.query,
      params: renderProps.params,
      dispatch,
      client,
      store,
    };

    // dispatch route changed: pageTransitioning false
    // _AppLoading.stop();
    if (window.__INITIAL_STATE__) {
      delete window.__INITIAL_STATE__;
    } else {
      trigger('fetch', components, locals);
    }
    trigger('defer', components, locals);
  });
});
