import { RootStore, resource, catalog, kind } from './resource';
import { getSnapshot } from 'mobx-state-tree';
import { when } from 'mobx';
import { FakeHub } from '../api/testutil';

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

  it('can toggle a selected kind', (done) => {
    const store = RootStore.create({}, { api });

    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.resources.size).toBe(5);

        console.log(getSnapshot(store.catalog));
        store.catalog.get('1')?.toggle();
        console.log(getSnapshot(store.catalog));
        expect(store.catalog.get('1')?.selected).toBe(true);

        store.catalog.forEach((c) => {
          if (c.selected === true) {
            store.resources.forEach((r) => {
              if (r.catalog.id == c.id) {
                console.log(r.id);
              }
            });
          }
        });
        done();
      }
    );
  });
});
