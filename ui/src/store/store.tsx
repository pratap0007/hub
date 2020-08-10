import React from "react";
import { Resources } from "../models/resources";
import { getSnapshot } from "mobx-state-tree";
// import { API_URL } from "./../config.js";

export const StoreContext = React.createContext(Resources.create());

const fetcher = () => window.fetch(`https://api-tekton-hub-staging.apps.openshift-web.p0s5.p1.openshiftapps.com/resources`)
    .then((response) => response.json());


export const StoreProvider = ({ children }: any) => {
    const store = Resources.create();


    setInterval(function () {
        console.log("---==", getSnapshot(store));
    }, 60000);
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};
