
import React from 'react'
import ReactDOM from 'react-dom'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducers from '../shared/reducers'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import jss from 'jss'
import preset from 'jss-preset-default'
import App from '../shared'

// One time setup with default plugins and settings.
jss.setup(preset())

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
const store = createStore(reducers, preloadedState, composeWithDevTools(
  applyMiddleware()
))

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
    () => {
      // We don't need the static css any more once we have launched our application.
      const ssStyles = document.getElementById('server-side-styles')
      ssStyles.parentNode.removeChild(ssStyles)
    }
  )
}

render(App)

if (module.hot) {
  module.hot.accept('../shared', () => render(App))
  module.hot.accept('../shared/reducers', () => {
    const nextRootReducer = require('../shared/reducers').default
    store.replaceReducer(nextRootReducer)
  })
}
