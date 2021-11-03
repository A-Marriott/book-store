import { init } from "@rematch/core";
import { search } from "./models";
// import * from "./models";
import { mockComponent } from "react-dom/test-utils";

import { fetchBooks } from "./service";
jest.mock("./service");

describe("Book store models", () => {
  let store;
  describe("Search model", () => {
    beforeEach(() => {
      store = init({
        models: {
          search: {
            ...search,
          },
        },
      });
      fetchBooks.mockImplementation(() => ({
        items: ["Harry Potter", "Hunger Games"],
      }));
    });

    it("The store is initialized with 0 search results", async () => {
      await store.dispatch.search.fetchBooks();
      expect(store.getState().search.results).toEqual([
        "Harry Potter",
        "Hunger Games",
      ]);
    });
  });
});
