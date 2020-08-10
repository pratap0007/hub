import { SearchStore } from "./search";

describe("SearchStore", () => {
  it("can create a store and set a search text", done => {
    const store = SearchStore.create();
    store.setSearchText("argo");
    expect(store.searchedText).toBe("argo");
    store.clearSearchText();
    expect(store.searchedText).toBe("");

    done();
  });
});
