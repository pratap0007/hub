import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


import { Resources } from "./models/resources";

export const StoreContext = React.createContext(Resources.create());

const ResourceFetcher = () =>
  window.fetch(`https://api-tekton-hub-staging.apps.openshift-web.p0s5.p1.openshiftapps.com/resources`)
    .then((response) => response.json())

const store = Resources.create({}, { fetch: ResourceFetcher });


setInterval(function () {
  console.log(store.count)
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
