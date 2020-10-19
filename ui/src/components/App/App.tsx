import React from 'react';
import { observer } from 'mobx-react';
import LeftPane from '../LeftPane/LeftPane';
import { IResourceStore } from '../../store/resources';
import '@patternfly/react-core/dist/styles/base.css';

interface store {
  store: IResourceStore;
}

const App = observer(({ store }: store) => (
  <div className="App">
    <LeftPane store={store} />
  </div>
));

export default App;
