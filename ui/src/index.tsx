import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { CategoryStore } from './store/category';
import { Provider } from "mobx-react"
import { Hub } from './api';
import { getSnapshot } from 'mobx-state-tree';

const api = new Hub()
export const Store = CategoryStore.create({}, { api });
setInterval(() => {
  console.log(getSnapshot(Store))
}, 10000)
// console.log("oooo", getSnapshot(Store));

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
