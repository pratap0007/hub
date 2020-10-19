import React from 'react';
import { useObserver } from 'mobx-react';
import Filter from '../Filter/Filter';
import { ICatalogStore } from '../../store/catalog';

interface store {
  store: ICatalogStore;
}

const CatalogFilter: React.FC<store> = (props: store) => {
  const store = props.store;
  return useObserver(() => <Filter store={store} header="Support Tier" />);
};

export default CatalogFilter;
