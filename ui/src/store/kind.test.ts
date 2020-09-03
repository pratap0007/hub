import { KindStore, Kind } from "./kind";
import { ResourceStore } from "./resources";
import { FakeHub } from "../api/testutil";
import { when } from "mobx";
const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe("KindStore", () => {
  it("can create a store and add a kind", done => {
    const store = Kind.create({
      name: "kind1"
    });
    expect(store.name).toBe("kind1");

    done();
  });

  it("it can toggle a kind", () => {
    const store = KindStore.create();
    store.add({ name: "a" });
    store.add({ name: "b" });
    store.toggleKind("a");
    expect(store.kindList[0].selected).toBe(true);
    expect(store.count).toBe(2);
    expect(store.selectedkind[0]).toBe("a");
  });
});
describe("desc", () => {
  it("it can load kinds in tore", done => {
    const store = ResourceStore.create({}, { api });
    when(
      () => !store.isLoading,
      () => {
        expect(store.isLoading).toBe(false);
        expect(store.kindStore.count).toBe(5);

        // expect(store.categories[0].selected).toBe(true);

        done();
      }
    );
  });
});
