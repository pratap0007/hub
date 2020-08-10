import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ResourceStore } from "./store/resources";
import { Hub } from './api';
import { RootStore } from './store/rootStore';
import { getSnapshot } from 'mobx-state-tree';

export const StoreContext = React.createContext(ResourceStore.create());

const store = RootStore.create({}, { api: new Hub() });


setInterval(function () {

  // store.categorystore.toggleSelectedCategory(5);
  // store.categorystore.toggleSelectedCategory(4);
  // store.catalogtypestore.setSelectedCatalogType('official');
  // store.catalogtypestore.setSelectedCatalogType('community');
  // console.log("ppp", store.catalogtypestore.catalogType);
  // store.resourcekindstore.setSelectedKind('Task');
  // store.searchstore.setSearchText("arg");
  // store.resourcekindstore.setSelectedKind('Pipeline');
  // console.log("nnn", store.resourcekindstore.resourceKind);

  console.log("categorylist", getSnapshot(store.categorystore.categories))
  console.log("filterresource", store.alldashboardresource);
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
