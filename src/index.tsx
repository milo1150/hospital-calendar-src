import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css'; // Ant CSS
import './styles/style.css'; // Global CSS

/* REDUX */
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducers/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
// import { logger } from 'redux-logger';

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware())
  // composeWithDevTools(applyMiddleware(logger))
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
