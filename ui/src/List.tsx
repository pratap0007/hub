import React from 'react';
import { useObserver } from "mobx-react";
import { StoreContext } from "./store/store";
const List: React.FC = (props: any) => {
    const store = React.useContext(StoreContext);
    return useObserver(() => (
        <div>
            <h2> no of resources :{store.count}</h2>
        </div>
    ))

}
export default List;