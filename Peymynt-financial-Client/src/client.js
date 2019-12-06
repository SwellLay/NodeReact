import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from "redux"
import { persistStore, autoRehydrate } from "redux-persist"
import thunk from "redux-thunk"
import { Provider } from 'react-redux';
import reducers from './reducers'
import { } from 'babel-polyfill'
import { Router } from 'react-router-dom'
import history from 'customHistory'
import Main from './routes'

import { AppContainer } from 'react-hot-loader'

export const store = createStore(
  reducers,
  applyMiddleware(thunk),
  compose(autoRehydrate()),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistingStore = persistStore(store, { blacklist: ["routing"] })

/**
 * Method used for check token is valid ot not
 */
export const requireAuth = async (nextState, replace) => {
  const authToken = localStorage.getItem("token")
  let business = nextState.businessReducer.business
  if (!authToken) {
    history.push('/login')
    window.location.reload(true)
    return false
  }else{
    if(business.length === 0){
      history.push('/onboarding')
    }
  }
  return true
}

/**
 * Persist the store, after rehydration after that rendering dom.
 */
persistStore(store, {}, () => {
  render(
    <AppContainer>
      <Provider store={store}>
        <Router history={history}>
          <Main />
        </Router>
      </Provider>
    </AppContainer>,
    document.getElementById('app-container')
  )
}); 