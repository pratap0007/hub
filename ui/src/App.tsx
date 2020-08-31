import React from 'react';
import './App.css';
import Category from './components/Category'
import {observer} from 'mobx-react';

const App = observer(({store}: any) => (
  <div className="App">
    <Category store={store} />
  </div>
))


export default App;