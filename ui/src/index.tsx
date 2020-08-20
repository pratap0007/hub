import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Resources } from "./store/resources";
import { Hub } from './api';
import { getSnapshot } from 'mobx-state-tree';

export const StoreContext = React.createContext(Resources.create());

const store = Resources.create({}, { api: new Hub() });


setInterval(function () {
  console.log(store.count)
  console.log("list", getSnapshot(store.resouresData))
}, 6000);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
