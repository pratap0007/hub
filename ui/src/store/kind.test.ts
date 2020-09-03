import { KindStore, Kind } from "./kind";
import { ResourceStore } from "./resources";
import { RootStore } from "./rootStore";
import { FakeHub } from "../api/testutil";
import { when } from "mobx";
import { getSnapshot, getEnv } from "mobx-state-tree";
const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe("create kind store", () => {
  it("can create a store and add a kind", done => {
    const store = Kind.create({
      name: "kind1"
    });
    expect(store.name).toBe("kind1");

    done();
  });
});
describe("kind store view and actions", () => {
  it("it can test kind store and toggle a kind", done => {
    const store = RootStore.create(
      {},
      {
        api: api,
        kindStore: KindStore.create({})
      }
    );

    when(
      () => !store.resourceStore.isLoading,
      () => {
        console.log("in kind store functionality");
        expect(store.resourceStore.isLoading).toBe(false);
        expect(getEnv(store).kindStore.count).toBe(8);
        store.resourceStore.kindStore.list[0].toggle();
        expect(store.resourceStore.kindStore.selectedkind).toBe("Tasks");

        // expect(store.categories[0].selected).toBe(true);

        done();
      }
    );
  });
});
