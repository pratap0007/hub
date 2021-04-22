import React from 'react';
import { useObserver } from 'mobx-react';
import { useMst } from '../../store/root';
import Filter from '../../components/Filter';

/* This componnet return Filter component with categories store */
const CategoryFilter: React.FC = () => {
  const { categories } = useMst();
  return useObserver(() => <Filter store={categories} header="Category" />);
};

export default CategoryFilter;
