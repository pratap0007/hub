import { RootStore, Resource, Catalog, kind } from './resource';
import { getSnapshot } from 'mobx-state-tree';
import { when } from 'mobx';
import { FakeHub } from '../api/testutil';

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
  fit('creates a store', (done) => {
    const store = RootStore.create({}, { api });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        // expect(store.resources.size).toBe(5);

        // expect(store.resources.get(1)?.name).toBe('ansible-runner');
        // expect(store.catalog.get(1)?.name).toBe('tekton');

        expect(getSnapshot(store.resources)).toMatchSnapshot();

        done();
      }
    );
  });

  it('creates a catalog store', (done) => {
    const store = RootStore.create({}, { api });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        expect(getSnapshot(store.catalog)).toMatchSnapshot();

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
    const store = RootStore.create({}, { api });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        console.log(getSnapshot(store.resources));
        console.log(getSnapshot(store.catalog));
        console.log(getSnapshot(store.kind));
        // store.catalog.get('1')?.toggle();
        // expect(store.catalog.get('1')?.selected).toBe(true);

        store.catalog.forEach((c) => {
          if (c.selected === true) {
            store.resources.forEach((r) => {
              if (r.catalog.id == c.id) {
                // console.log(r.id);
              }
            });
          }
        });
        done();
      }
    );
  });
});
