import React from 'react';
import { useObserver } from 'mobx-react';
import Filter from '../../components/Filter';
import { useMst } from '../../store/root';

/* This componnet return Filter component with kinds store */
const KindFilter: React.FC = () => {
  const { resources } = useMst();
  return useObserver(() => <Filter store={resources.kinds} header="Kind" />);
};

export default KindFilter;
