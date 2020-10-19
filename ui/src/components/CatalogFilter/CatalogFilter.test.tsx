import React from 'react';
import { shallow } from 'enzyme';
import { when } from 'mobx';
import { FakeHub } from '../../api/testutil';
import { KindStore } from '../../store/kind';
import { CatalogStore } from '../../store/catalog';
import { ResourceStore } from '../../store/resources';
import { CategoryStore } from '../../store/category';
import CatalogFilter from './CatalogFilter';
import Filter from '../Filter/Filter';

const TESTDATA_DIR = `src/store/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('CatalogFilter', () => {
  it('finds the filter component and matches the count', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );

    when(
      () => !store.isLoading,
      () => {
        const component = shallow(<CatalogFilter store={store.catalogStore} />);

        expect(component.find(Filter).length).toEqual(1);

        done();
      }
    );
  });
});
