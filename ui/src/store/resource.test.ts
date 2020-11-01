import { RootStore, resource, catalog, kind } from './resource';
import { getSnapshot } from 'mobx-state-tree';
import { values, when } from 'mobx';
import fuzzysort from 'fuzzysort';
import { FakeHub } from '../api/testutil';
import { CategoryStore } from './category';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Store Object', () => {
  it('can create a catalog object', () => {
    const store = catalog.create({
      id: '1',
      name: 'tekton',
      type: 'community'
    });

    expect(store.name).toBe('tekton');
  });
  it('can create a kind object', () => {
    const store = kind.create({
      id: 1,
      name: 'Task'
    });

    expect(store.name).toBe('Task');
  });
  it('can create a resource object', () => {
    const store = resource.create({
      id: '5',
      name: 'buildah',
      catalog: '1',
      kind: 'Task',
      latestVersion: {
        id: 5,
        version: '0.1',
        displayName: 'buildah',
        description:
          "Buildah task builds source into a container image and then pushes it to a container registry.\nBuildah Task builds source into a container image using Project Atomic's Buildah build tool.It uses Buildah's support for building from Dockerfiles, using its buildah bud command.This command executes the directives in the Dockerfile to assemble a container image, then pushes that image to a container registry.",
        minPipelinesVersion: '',
        rawURL:
          'https://raw.githubusercontent.com/Pipelines-Marketplace/catalog/master/task/buildah/0.1/buildah.yaml',
        webURL:
          'https://github.com/Pipelines-Marketplace/catalog/tree/master/task/buildah/0.1/buildah.yaml',
        updatedAt: '2020-07-17 12:26:26.835302 +0000 UTC'
      },
      tags: ['1'],
      rating: 5
    });

    expect(store.name).toBe('buildah');
  });
});

describe('Store functions', () => {
  it('creates a store', (done) => {
    const store = RootStore.create({}, { api });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        expect(store.resources.get('1')?.name).toBe('ansible-runner');
        expect(store.catalog.get('1')?.name).toBe('tekton');

        // expect(getSnapshot(store)).toMatchSnapshot();
        // expect(getSnapshot(store.resources)).toMatchSnapshot();
        // expect(getSnapshot(store.catalog)).toMatchSnapshot();
        // expect(getSnapshot(store.kind)).toMatchSnapshot();

        done();
      }
    );
  });

  it('can toggle a selected  catalog', (done) => {
    const store = RootStore.create({}, { api });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        store.catalog.get('1')?.toggle();

        expect(store.catalog.get('1')?.selected).toBe(true);
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

        // console.log(getSnapshot(store.kind));
        store.kind.get('Task')?.toggle();
        // console.log(getSnapshot(store.kind));
        expect(store.kind.get('Task')?.selected).toBe(true);
        // console.log('kindd', store.selectedKind);
        done();
      }
    );
  });

  it('filter resources based on selected category and catalog', (done) => {
    const store = RootStore.create({}, { api });
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        store.catalog.get('1')?.toggle();
        store.kind.get('Task')?.toggle();
        store.setSearch('aws');
        console.log(store.selectedCatalog);
        console.log(store.selectedKind);

        const { resources } = store;
        const { search } = store;

        const catalogList = new Set(store.selectedCatalog);
        const kindList = new Set(store.selectedKind);
        const tagList = new Set(['2']);

        const temp: any = [];
        store.resources.forEach((r: any) => {
          // console.log(store.kind.has(String(r.kind.name)));
          // console.log(store.catalog.has(String(r.catalog.id)));
          if (kindList.has(String(r.kind.name)) && catalogList.has(String(r.catalog.id))) {
            temp.push(getSnapshot(r));
          }
        });

        // console.log(temp);

        const filtered =
          search !== ''
            ? fuzzysort
                .go(search, temp, {
                  keys: ['name', 'displayName']
                })
                .map((resource: any) => resource.obj)
            : temp;
        console.log('filtered resources', filtered);
        done();
      }
    );
  });
});
