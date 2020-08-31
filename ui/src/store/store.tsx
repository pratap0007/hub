import React from "react";
import {CategoryStore} from "./category";
import {Hub} from "../api";

export const StoreContext = React.createContext(CategoryStore.create());

const api = new Hub()
export const StoreProvider = ({children}: any) => {
    const store = CategoryStore.create({}, {api});

    setInterval(function () {
        // console.log("---==", getSnapshot(store));
    });
    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};