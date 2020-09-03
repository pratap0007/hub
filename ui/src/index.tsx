import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Hub } from './api';
import { RootStore } from './store/rootStore';
import { getSnapshot } from 'mobx-state-tree';
import { KindStore } from "./store/kind";
import { CatalogStore } from "./store/catalog";
import { CategoryStore } from "./store/category";

export const StoreContext = React.createContext(RootStore.create());

const store = RootStore.create({}, {
  api: new Hub(),
  kindStore: KindStore.create({}),
  catalogStore: CatalogStore.create({}),
  categoryStore: CategoryStore.create({}, { api: new Hub() })

});
setInterval(function () {

  store.resourceStore.kindStore.toggleKind('Task');
  store.resourceStore.catalogStore.toggleCatalogType('official');
  store.resourceStore.categoryStore.list[3].toggle();
  // console.log("999", getSnapshot(store.resourceStore.catalogStore.catalogList))
  // store.resourceStore.setSearchText('arg');
  // console.log("searchtext", store.resourceStore.searchedText);
  console.log("selectedtags", store.resourceStore.categoryStore.tags)
  console.log("resourcelist", getSnapshot(store.resourceStore.resources));
  console.log("selectedkind", store.resourceStore.kindStore.selectedkind);
  console.log("selectedcatalog", store.resourceStore.catalogStore.selectedCatalogType);
  console.log("filteredresources", store.resourceStore.list);
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