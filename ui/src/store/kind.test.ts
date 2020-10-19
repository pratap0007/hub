import { KindStore, Kind } from './kind';
import { ResourceStore } from './resources';
import { FakeHub } from '../api/testutil';
import { when } from 'mobx';
import { getSnapshot } from 'mobx-state-tree';

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe('Kind', () => {
  it('can create a kind object', (done) => {
    const store = Kind.create({
      id: 4,
      name: 'kind1'
    });
    expect(store.name).toBe('kind1');

    done();
  });
});

describe('Kind Store', () => {
  it('can create a store', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({})
      }
    );

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        expect(store.kindStore.count).toBe(1);
        expect(store.kindStore.list[0].name).toBe('Task');
        expect(getSnapshot(store.kindStore.list)).toMatchSnapshot();

        done();
      }
    );
  });

  it('can toggle the selected kind', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({})
      }
    );

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        store.kindStore.list[0].toggle();
        expect(store.kindStore.list[0].selected).toBe(true);

        done();
      }
    );
  });

  it('can return the kind which are selected', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({})
      }
    );

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        store.kindStore.list[0].toggle();

        expect(store.kindStore.kinds[0]).toBe('Task');

        done();
      }
    );
  });

  it('can clear all selected kinds', (done) => {
    const store = ResourceStore.create(
      {},
      {
        api,
        kindStore: KindStore.create({})
      }
    );

    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);

        store.kindStore.list[0].toggle();
        store.kindStore.clear();

        expect(store.kindStore.list).toEqual(
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
