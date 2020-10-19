import { ResourceStore, Resource } from './resources';
import { FakeHub } from '../api/testutil';
import { when } from 'mobx';
import { getSnapshot } from 'mobx-state-tree';
import { KindStore, Kind } from './kind';
import { CatalogStore } from './catalog';
import { CategoryStore } from './category';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Resources', () => {
  it('it can create a resource object', (done) => {
    const store = Resource.create({
      id: 5,
      name: 'buildah',
      catalog: {
        id: 1,
        type: 'official'
      },
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
      tags: [
        {
          id: 1,
          name: 'image-build'
        }
      ],
      rating: 5
    });

    expect(store.name).toBe('buildah');
    done();
  });
});

describe('Store functions', () => {
  it('can create a store', (done) => {
    const store = ResourceStore.create({}, { api });
    expect(store.count).toBe(0);
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.count).toBe(5);
        expect(store.isLoading).toBe(false);

        expect(store.resources[0].name).toBe('buildah');
        expect(getSnapshot(store.resources)).toMatchSnapshot();

        done();
      }
    );
  });

  it('can search a resource', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    expect(store.count).toBe(0);
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.count).toBe(5);
        expect(store.isLoading).toBe(false);

        store.setSearchInput('argo');
        expect(store.searchInput).toBe('argo');
        expect(store.list.length).toBe(1);

        done();
      }
    );
  });

  it('can filter resources based on slected kinds,catalogs and categories', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({}),
        catalogStore: CatalogStore.create({}),
        categoryStore: CategoryStore.create({}, { api })
      }
    );
    expect(store.count).toBe(0);
    expect(store.isLoading).toBe(true);

    when(
      () => !store.isLoading,
      () => {
        expect(store.count).toBe(5);
        expect(store.isLoading).toBe(false);

        store.kindStore.add(Kind.create({ id: 5, name: 'Pipeline' }));
        store.kindStore.list[0].toggle();
        store.catalogStore.list[0].toggle();
        store.categoryStore.list[3].toggle();

        expect(store.list.length).toBe(2);

        done();
      }
    );
  });
});
