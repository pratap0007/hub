import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Hub } from './api';
import { RootStore } from './store/rootStore';
import { getSnapshot } from 'mobx-state-tree';

export const StoreContext = React.createContext(RootStore.create());

const store = RootStore.create({}, { api: new Hub() });

setInterval(function () {


  console.log("resourcelist", getSnapshot(store.resourceStore.list))
  console.log("cataloglist", getSnapshot(store.resourceStore.catalogStore.list));
  console.log("kindlist", getSnapshot(store.resourceStore.kindStore.list));

  // console.log("filterresource", store.allDashboardResource);
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