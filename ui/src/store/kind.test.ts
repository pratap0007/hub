import { Kind, KindStore } from './kind';
import { getSnapshot } from 'mobx-state-tree';

describe('Store Object', () => {
  it('can create a kind object', () => {
    const store = Kind.create({
      name: 'Task'
    });

    expect(store.name).toBe('Task');
  });

  it('creates a kind store', (done) => {
    const store = KindStore.create({});

    const item = {
      name: 'Task'
    };

    store.add(item.name);

    expect(store.list.get('Task')?.name).toBe('Task');
    expect(getSnapshot(store.list)).toMatchSnapshot();

    done();
  });

  it('should toggle a selected kind', (done) => {
    const store = KindStore.create({});

    const item = {
      name: 'Task'
    };

    store.add(item.name);
    store.list.get('Task')?.toggle();

    expect(store.selected.length).toBe(1);
    expect(store.list.get('Task')?.selected).toBe(true);

    done();
  });

  it('should clear all the selected kind', (done) => {
    const store = KindStore.create({});

    const item = {
      name: 'Task'
    };

    store.add(item.name);
    store.list.get('Task')?.toggle();

    store.clear();
    expect(store.list.get('Task')?.selected).toBe(false);

    done();
  });
});
