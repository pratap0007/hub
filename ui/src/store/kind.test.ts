import { KindStore, Kind } from "./kind";

describe("ResourceKind", () => {
  it("can create a store and add a kind", done => {
    const store = Kind.create({
      name: "bcd"
    });
    expect(store.name).toBe("bcd");

    done();
  });

  it("it can toggle a kind", () => {
    const store = KindStore.create();
    store.selectedKind("pipeline");
    expect(store.resourcekindlist[1].selected).toBe(true);
  });
});
