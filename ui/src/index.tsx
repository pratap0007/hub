import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Hub } from './api';
import { getSnapshot } from 'mobx-state-tree';
import { KindStore } from "./store/kind";
import { CatalogStore } from "./store/catalog";
import { CategoryStore } from "./store/category";
import { ResourceStore } from './store/resources';

const store = ResourceStore.create({}, {
  api: new Hub(),
  kindStore: KindStore.create({}),
  catalogStore: CatalogStore.create({}),
  categoryStore: CategoryStore.create({}, { api: new Hub() })

});
setInterval(function () {

  console.log("categorylist", getSnapshot(store.categoryStore.categories));
  console.log("kindlist", getSnapshot(store.kindStore.list));
  console.log("cataloglist", getSnapshot(store.catalogStore.list));

  console.log("resourcelist", getSnapshot(store.resourceList));
  console.log(store.count)


  // store.kindStore.add({ "name": "Pipeline" })
  // console.log("kindlist", getSnapshot(store.kindStore.list));
  store.kindStore.list[0].toggle()
  store.categoryStore.categories[3].toggle()
  console.log(store.list)

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