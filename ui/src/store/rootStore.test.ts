import { when } from 'mobx';
import { RootStore } from './rootStore';
import { FakeHub } from '../api/testutil';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Root Store', () => {
  fit('It creates a rootstore', (done) => {
    const store = RootStore.create(
      {
        category: {},
        resources: {
          catalog: {},
          kind: {}
        }
      },
      {
        api
      }
    );

    expect(store.resources.isLoading).toBe(true);

    when(
      () => !store.resources.isLoading,
      () => {
        expect(store.resources.isLoading).toBe(false);

        expect(store.resources.list.size).toBe(5);
        expect(store.category.list.size).toBe(5);
        expect(store.resources.kind.list.size).toBe(1);
        expect(store.resources.catalog.list.size).toBe(1);

        done();
      }
    );
  });
});
