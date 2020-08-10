import { SearchStore } from "./search";

describe("SearchStore", () => {
  it("can create a store and set a search text", done => {
    const store = SearchStore.create();
    store.setSearchText("argo");
    expect(store.searchedtext).toBe("argo");
    store.clearSearchText();
    expect(store.searchedtext).toBe("");

    done();
  });
});
