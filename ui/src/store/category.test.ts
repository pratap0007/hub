import { FakeHub } from "../api/testutil";
import { CategoryStore, Category } from "./category";
import { when } from "mobx";
import { getSnapshot } from "mobx-state-tree";

const TESTDATA_DIR = `${__dirname}/testdata`;
const api = new FakeHub(TESTDATA_DIR);

describe("Category Object", () => {
	it("can create a category object", () => {
		const category = Category.create({
			id: 1,
			name: "test",
			tags: [
				{
					id: 1,
					name: "test-category",
				},
			],
		});

		expect(category.name).toBe("test");
		expect(category.id).toBe(1);
		expect(category.tags[0].name).toBe("test-category");
	});
});

describe("Store functions", () => {
	it("can create a store", (done) => {
		const store = CategoryStore.create({}, { api });
		expect(store.count).toBe(0);
		expect(store.isLoading).toBe(true);
		when(
			() => !store.isLoading,
			() => {
				expect(store.count).toBe(5);
				expect(store.isLoading).toBe(false);

				expect(store.categories[0].id).toBe(1);
				expect(store.categories[0].name).toBe("Build Tools");
				expect(getSnapshot(store)).toMatchSnapshot();

				done();
			}
		);
	});

	it("can toggle the selected category", (done) => {
		const store = CategoryStore.create({}, { api });
		expect(store.count).toBe(0);
		expect(store.isLoading).toBe(true);

		when(
			() => !store.isLoading,
			() => {
				expect(store.count).toBe(5);
				expect(store.isLoading).toBe(false);

				store.toggleSelectedCategory(1);
				store.toggleSelectedCategory(3);
				expect(store.categories[0].selected).toBe(true);

				done();
			}
		);
	});

	it("can return the tags for the categories which are selected", (done) => {
		const store = CategoryStore.create({}, { api });
		expect(store.count).toBe(0);
		expect(store.isLoading).toBe(true);

		when(
			() => !store.isLoading,
			() => {
				expect(store.count).toBe(5);
				expect(store.isLoading).toBe(false);

				store.toggleSelectedCategory(1);
				store.toggleSelectedCategory(2);

				const tags = store.filteredTags;
				expect(tags[0]).toBe("build-tool");

				done();
			}
		);
	});

	it("clears all the selected categories", (done) => {
		const store = CategoryStore.create({}, { api });
		expect(store.count).toBe(0);
		expect(store.isLoading).toBe(true);

		when(
			() => !store.isLoading,
			() => {
				expect(store.count).toBe(5);
				expect(store.isLoading).toBe(false);

				store.toggleSelectedCategory(1);
				store.toggleSelectedCategory(3);
				store.clearAll();

				expect(store.categories).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							selected: false,
						}),
					])
				);

				done();
			}
		);
	});
});
