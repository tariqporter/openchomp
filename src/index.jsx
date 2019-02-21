import React from 'react';
import ReactDOM from 'react-dom';
import { JssProvider } from 'react-jss';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducer';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const styleNode = document.createComment("jss-insertion-point");
document.head.insertBefore(styleNode, document.head.firstChild);

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  // We define a custom insertion point that JSS will look for injecting the styles in the DOM.
  insertionPoint: 'jss-insertion-point',
});

const store = createStore(rootReducer, compose(
  applyMiddleware(thunk)
));

const Index = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <Provider store={store}>
      <App />
    </Provider>
  </JssProvider>
);

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
