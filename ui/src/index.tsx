import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import App from './components/App/App';
import { Hub } from './api';
import * as serviceWorker from './serviceWorker';

import { RootStore } from './store/rootStore';

const api = new Hub();

const store = RootStore.create(
  {
    category: {},
    resources: {
      catalog: {},
      kind: {}
    }
  },
  {
    api
  }
);

ReactDOM.render(
  <Provider>
    <App store={store.category} />,
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
