import { CatalogStore, Catalog } from "./catalog";

describe("CatalogType", () => {
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
    store.toggleCatalogType("official");
    expect(store.catalogList[0].selected).toBe(true);

    done();
  });
});
