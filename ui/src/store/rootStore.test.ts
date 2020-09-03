import { RootStore } from "./rootStore";
// import { FakeHub } from "../api/testutil";

// const TESTDATA_DIR = `${__dirname}/testdata`;
// const api = new FakeHub(TESTDATA_DIR);

describe("rootStore", () => {
  it("can create a rootStore and get all resources", done => {
    const rootstore = RootStore.create();
    rootstore.resourceStore.load();
    expect(rootstore.resourceStore.count).toBe(0);
    done();
  });
});
