// import { ResourceStore } from "./resources";
import { RootStore } from "./rootStore";
// import { FakeHub } from "../api/testutil";

// const TESTDATA_DIR = `${__dirname}/testdata`;
// const api = new FakeHub(TESTDATA_DIR);

describe("rootStore", () => {
  it("can create a rootStore and get all resources", done => {
    const rootstore = RootStore.create();
    rootstore.resourcestore.loadResources();
    expect(rootstore.alldashboardresource).toMatchObject([]);
    done();
  });
});
