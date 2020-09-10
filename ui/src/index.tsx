import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Hub } from './api';
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