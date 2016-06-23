import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createMiddleware from './middleware/promiseMiddleware';
import { install, combineReducers } from 'redux-loop';
import * as reducers             from 'reducers';
import thunk                     from 'redux-thunk';
import createLogger              from 'redux-logger';


export default function createStore(history, client, data) {
  const middleware = [createMiddleware(client), thunk];
  
  if(process.env.NODE_ENV !== 'production') {
  	middleware.push(createLogger());
  }

  let finalCreateStore;
  finalCreateStore = applyMiddleware(...middleware)(_createStore);



  const reducer = combineReducers(reducers);
  const store = finalCreateStore(reducer, data, install());
 
   return store;
}