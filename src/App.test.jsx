import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducer';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store = createStore(rootReducer, compose(
    applyMiddleware(thunk)
  ));
  const Index = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );
  ReactDOM.render(<Index />, div);
  ReactDOM.unmountComponentAtNode(div);
});
