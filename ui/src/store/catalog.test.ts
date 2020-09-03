import { CatalogStore, Catalog } from "./catalog";
import { RootStore } from "./rootStore";
import { FakeHub } from "../api/testutil";
const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe("Catalog store", () => {
  it("can create a store and add a type", done => {
    const store = Catalog.create({
      name: "abc",
      selected: false
    });

    expect(store.name).toBe("abc");

    done();
  });

  it("it can toggle a type", done => {
    const store = CatalogStore.create();
    store.add({ name: "x" });
    store.add({ name: "y" });
    store.toggleCatalogType("x");
    expect(store.catalogList[0].selected).toBe(true);

    done();
  });
});
describe("test catalog store view and actions", () => {
  it("it can test catalog store view and actions", done => {
    const store = RootStore.create(
      {},
      {
        api: api,
        kindStore: CatalogStore.create({})
      }
    );
    

    done();
  });
});
