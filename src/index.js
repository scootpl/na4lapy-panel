import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import {TOKEN_KEY} from './config';
import axios from 'axios';
import {syncHistoryWithStore, push} from 'react-router-redux';
/* eslint-disable */
import configureStore from './store/configureStore';
/* eslint-enable */

import 'materialize-css/dist/css/materialize.css';
import 'materialize-css/dist/js/materialize.js';

import './styles/index.sass';

import routes from './routes';
import {filterInitialState} from './initialStates';

const store = configureStore(filterInitialState);

const history = syncHistoryWithStore(browserHistory, store);

axios.defaults.validateStatus = status => {
  return (status >= 200 && status < 400) ;
};

axios.interceptors.request.use(config => {

  let token = localStorage.getItem(TOKEN_KEY);
  if (token && token.length >= 0 ) {
    config.headers['X-Auth-Token'] = token;
  }
  return config;
});

axios.interceptors.response.use( (response) => {
  console.log(response);
  return response;
}, (error) => {
  let response = error.response
  //Unauthorized, token expired
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    store.dispatch(push("/"));
  }
  return response;
}

);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, document.getElementById('app')
);
