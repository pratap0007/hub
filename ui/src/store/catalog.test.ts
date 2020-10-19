import { getSnapshot } from 'mobx-state-tree';
import { when } from 'mobx';
import { CatalogStore, CatalogType } from './catalog';
import { CategoryStore } from './category';
import { FakeHub } from '../api/testutil';
import { KindStore } from './kind';
import { ResourceStore } from './resources';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Catalog', () => {
  it('can create a catalog object', (done) => {
    const store = CatalogType.create({
      id: 3,
      name: 'official'
    });
    expect(store.name).toBe('official');

    done();
  });
});

describe('Catalog Store', () => {
  it('can create a store', (done) => {
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
        expect(store.isLoading).toBe(false);

        expect(store.catalogStore.count).toBe(1);
        expect(store.catalogStore.list[0].name).toBe('official');
        expect(getSnapshot(store.catalogStore.list)).toMatchSnapshot();

        done();
      }
    );
  });

  it('can toggle the selected catalog', (done) => {
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

        store.catalogStore.list[0].toggle();
        expect(store.catalogStore.list[0].selected).toBe(true);

        done();
      }
    );
  });

  it('can return the catalogType which are selected', (done) => {
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
        expect(store.isLoading).toBe(false);

        store.catalogStore.list[0].toggle();

        expect(store.catalogStore.catalogs[0]).toBe('official');

        done();
      }
    );
  });

  it('can clear all selected catalog', (done) => {
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
        expect(store.isLoading).toBe(false);

        store.catalogStore.list[0].toggle();
        store.catalogStore.clear();

        expect(store.catalogStore.list).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              selected: false
            })
          ])
        );

        done();
      }
    );
  });
});
