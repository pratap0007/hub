import React from 'react';
import renderer from 'react-test-renderer';
import SearchBar from './SearchBar';
import { IResourceStore, ResourceStore } from '../../store/resources';
import { when } from 'mobx';
import { shallow, mount } from 'enzyme';
import { CatalogStore } from '../../store/catalog';
import { CategoryStore } from '../../store/category';
import { KindStore } from '../../store/kind';

import { FakeHub } from '../../api/testutil';
const TESTDATA_DIR = `src/store/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('searchBar', () => {
  it('should render componnet correctly', (done) => {
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
        expect(store.count).toBe(5);
        expect(store.isLoading).toBe(false);

        const component = shallow(<SearchBar store={store} />);
        expect(component).toMatchSnapshot();

        done();
      }
    );
  });

  it('set text input and trigger event', (done) => {
    const onSearchChange = jest.fn();
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
        const wrapper = shallow(<SearchBar store={store} />);
        const event = {
          preventDefault() {},
          target: {
            value: 'This is just for test'
          }
        };

        const onSearchChange = jest.fn();

        wrapper.find('.search-bar').simulate('change', { target: { value: '2018-01-04' } });
        expect(onSearchChange).toHaveBeenCalledTimes(1);
        done();
      }
    );
  });
});
