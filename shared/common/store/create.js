import { createStore , applyMiddleware, compose } from 'redux';
import configurePromise from 'common/middleware/promise';
import { install, combineReducers } from 'redux-loop';
import createReducers from 'common/reducers/create';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';


export default function create(client, data) {
    const middleware = [configurePromise(client), thunk];

    if (process.env.NODE_ENV !== 'production') {
        middleware.push(createLogger());
    }

    let finalCreateStore;
    finalCreateStore = applyMiddleware(...middleware)(createStore);

    const asyncReducers = {};
    const reducers = createReducers(asyncReducers);

    let store = finalCreateStore(reducers, data, install());

    if (process.env.NODE_ENV === 'development') {
        if (module.hot) {
            module.hot.accept('common/reducers/create', () => store.replaceReducer(require('common/reducers/create').default))
        }
    }

    return store;
}
