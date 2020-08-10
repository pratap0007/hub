import {types} from 'mobx-state-tree';

export const  SearchStore = types.model("SearchStore",{
searchtext: types.optional(types.string,'')
})
.views(self => ({
    get searchedtext(){
        const {searchtext} = self;
        return searchtext;
    }
}))
.actions(self => ({
    setSearchText(text:string){
        self.searchtext = text;
    },
    clearSearchText(){
        self.searchtext= '';
    }
}))