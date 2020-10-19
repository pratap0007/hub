import React from 'react';
import LeftPane from './LeftPane';
import { shallow } from 'enzyme';
import { FakeHub } from '../../api/testutil';
import { CategoryStore } from '../../store/category';
import { KindStore } from '../../store/kind';
import { CatalogStore } from '../../store/catalog';
import { ResourceStore } from '../../store/resources';
import KindFilter from '../KindFilter/KindFilter';
import CatalogFilter from '../CatalogFilter/CatalogFilter';
import CategoryFilter from '../CategoryFilter/CategoryFilter';

const TESTDATA_DIR = `src/store/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('LeftPane', () => {
  it('should find the categoryFilter component and match the count', () => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    const component = shallow(<LeftPane store={store} />);

    expect(component.find(CategoryFilter).length).toEqual(1);
  });

  it('should find the KindFilter component and match the count', () => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    const component = shallow(<LeftPane store={store} />);

    expect(component.find(KindFilter).length).toEqual(1);
  });

  it('should find the CatalogFilter component and match the count', () => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    const component = shallow(<LeftPane store={store} />);

    expect(component.find(CatalogFilter).length).toEqual(1);
  });
});
