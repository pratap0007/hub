import React from 'react';
import { observer } from 'mobx-react';
import CategoryFilter from '../CategoryFilter/CategoryFilter';
import { ICategoryStore } from '../../store/category';

interface store {
  store: ICategoryStore;
}

const App = observer(({ store }: store) => (
  <div className="App">
    <CategoryFilter store={store} />
  </div>
));

export default App;
