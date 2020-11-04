import { RootStore, Resource, Catalog, kind } from './resource';
import { getSnapshot, isValidReference } from 'mobx-state-tree';
import { when } from 'mobx';
import { FakeHub } from '../api/testutil';
import fuzzysort from 'fuzzysort';
import { CategoryStore } from './category';
import { CatalogStore } from './catalog';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Store Object', () => {
  it('can create a catalog object', () => {
    const store = Catalog.create({
      id: 1,
      name: 'tekton',
      type: 'community'
    });

    expect(store.name).toBe('tekton');
  });
  it('can create a kind object', () => {
    const store = kind.create({
      name: 'Task'
    });

    expect(store.name).toBe('Task');
  });
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
        catalogStore: CatalogStore.create({})
      }
    );

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        expect(store.catalogStore.list.get('1')?.name).toBe('tekton');

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
        catalogStore: CatalogStore.create({})
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
    const store = RootStore.create({}, { api });

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

  it('can toggle a selected kind', (done) => {
    const store = RootStore.create({}, { api, catalogStore: CatalogStore.create({}) });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        done();
      }
    );
  });

  fit('filter resources based on selected category and catalog', (done) => {
    const store = RootStore.create(
      {},
      {
        api,
        categoryStore: CategoryStore.create({}, { api }),
        catalogStore: CatalogStore.create({})
      }
    );
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        store.categoryStore.list.get('2')?.toggle();

        // store.catalogStore.list.get('1')?.toggle();
        store.setSearch('Ansible Runner');

        store.kind.get('Task')?.toggle();
        expect(store.filteredResources.length).toBe(1);
        expect(store.filteredResources[0].name).toBe('ansible-runner');

        done();
      }
    );
  });
});
