import { types } from "mobx-state-tree";

export const SearchStore = types
  .model("SearchStore", {
    searchText: types.optional(types.string, "")
  })
  .views(self => ({
    get searchedText() {
      const { searchText } = self;
      return searchText;
    }
  }))
  .actions(self => ({
    setSearchText(text: string) {
      self.searchText = text;
    },
    clearSearchText() {
      self.searchText = "";
    }
  }));
