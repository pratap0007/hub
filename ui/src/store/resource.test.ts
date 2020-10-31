import { RootStore, Resource } from './resource';
import { getSnapshot } from 'mobx-state-tree';
import { when } from 'mobx';
import { FakeHub } from '../api/testutil';
import { CategoryStore } from './category';
import { CatalogStore } from './catalog';
import { KindStore } from './kind';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Store Object', () => {
  it('can create a resource object', () => {
    const store = Resource.create({
      id: 5,
      name: 'buildah',
      catalog: '1',
      kind: 'Task',
      latestVersion: 1,
      tags: ['1'],
      rating: 5
    });

    expect(store.name).toBe('buildah');
  });
});

describe('Store functions', () => {
  it('creates a store', (done) => {
    const store = RootStore.create(
      {},
      {
        api,
        categoryStore: CategoryStore.create({}, { api }),
        catalogStore: CatalogStore.create({}),
        kindStore: KindStore.create({})
      }
    );

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        expect(store.resources.size).toBe(5);

        expect(getSnapshot(store.resources)).toMatchSnapshot();

        done();
      }
    );
  });

  it('creates a catalog store', (done) => {
    const store = RootStore.create(
      {},
      {
        api,
        categoryStore: CategoryStore.create({}, { api }),
        catalogStore: CatalogStore.create({}),
        kindStore: KindStore.create({})
      }
    );
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        expect(store.resources.size).toBe(5);

        expect(getSnapshot(store.catalogStore)).toMatchSnapshot();

        done();
      }
    );
  });

  it('creates a kind store', (done) => {
    const store = RootStore.create(
      {},
      {
        api,
        categoryStore: CategoryStore.create({}, { api }),
        catalogStore: CatalogStore.create({}),
        kindStore: KindStore.create({})
      }
    );

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        expect(getSnapshot(store.kind)).toMatchSnapshot();

        done();
      }
    );
  });

  it('filter resources based on selected category, kind and catalog', (done) => {
    const store = RootStore.create(
      {},
      {
        api,
        categoryStore: CategoryStore.create({}, { api }),
        catalogStore: CatalogStore.create({}),
        kindStore: KindStore.create({})
      }
    );
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        store.catalogStore.list.get('1')?.toggle();
        store.kindStore.list.get('Task')?.toggle();
        store.setSearch('golang');

        store.filteredResources;

        expect(store.filteredResources.length).toBe(1);

        done();
      }
    );
  });

  it('makes sure to not add duplicate resources', (done) => {
    const store = RootStore.create(
      {},
      {
        api,
        categoryStore: CategoryStore.create({}, { api }),
        catalogStore: CatalogStore.create({}),
        kindStore: KindStore.create({})
      }
    );

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        const item: any = {
          id: 98,
          name: 'jenkins',
          catalog: 1,
          kind: 'Task',
          latestVersion: 104,
          tags: [57, 56],
          rating: 5,
          versions: [104]
        };

        store.addResources(item);
        expect(store.resources.size).toBe(5);

        expect(getSnapshot(store.resources)).toMatchSnapshot();

        done();
      }
    );
  });
});
