import React from 'react';
import './App.css';
import { StoreProvider } from './store/store'
import List from './List';


function App() {
  return (
    <StoreProvider>
      <div>
        list of resources things .
      </div>
      <List />
    </StoreProvider>

  );
}

export default App;
