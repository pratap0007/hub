import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import { CategoryStore } from './store/category';
import { Hub } from './api';
import { Provider } from 'mobx-react';
import * as serviceWorker from './serviceWorker';
import { RootStore } from './store/resource';
import { getSnapshot } from 'mobx-state-tree';

const api = new Hub();
export const store = RootStore.create({}, { api });

export const Store = CategoryStore.create({}, { api });

// console.log(getSnapshot(store.catalog));

// console.log(getSnapshot(store.catalog));

setInterval(() => {
  console.log(getSnapshot(Store));
  console.log(getSnapshot(store));
}, 5000);

ReactDOM.render(
  <Provider>
    <App store={Store} />,
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
