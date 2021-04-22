import React from 'react';
import { useObserver } from 'mobx-react';
import Filter from '../../components/Filter';
import { useMst } from '../../store/root';

/*This componnet return Filter component with catalog store */
const CatalogFilter: React.FC = () => {
  const { resources } = useMst();
  return useObserver(() => <Filter store={resources.catalogs} header="Catalog" />);
};

export default CatalogFilter;
