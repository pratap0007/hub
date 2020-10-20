import React from 'react';
import App from './App';
import { shallow } from 'enzyme';
import { FakeHub } from '../../api/testutil';
import { CategoryStore } from '../../store/category';
import { KindStore } from '../../store/kind';
import { CatalogStore } from '../../store/catalog';
import { ResourceStore } from '../../store/resources';
import LeftPane from '../LeftPane/LeftPane';
import Footer from '../Footer/Footer';

const TESTDATA_DIR = `src/store/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('App', () => {
  it('should find the LeftPane component and match the count', () => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    const component = shallow(<App store={store} />);

    expect(component.find(LeftPane).length).toEqual(0);
  });

  it('should find the Footer component and match the count', () => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    const component = shallow(<App store={store} />);

    expect(component.find(Footer).length).toEqual(1);
  });
});
