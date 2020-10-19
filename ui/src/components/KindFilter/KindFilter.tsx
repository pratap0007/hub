import React from 'react';
import { useObserver } from 'mobx-react';
import Filter from '../Filter/Filter';
import { IKindStore } from '../../store/kind';

interface store {
  store: IKindStore;
}

const KindFilter: React.FC<store> = (props: store) => {
  const store = props.store;
  return useObserver(() => <Filter store={store} header="Kind" />);
};

export default KindFilter;
