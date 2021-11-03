import {init} from "@rematch/core";
import {search} from "./models";
// import * from "./models";
import {mockComponent} from "react-dom/test-utils";

import {fetchBooks} from "./service";

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
        });

        it("The store is initialized with 0 search results", async () => {
            fetchBooks.mockImplementation(() => ({
                totalItems: 0,
            }));
            await store.dispatch.search.fetchBooks();
            expect(store.getState().search).toEqual({
                results: [],
                noResults: true,
            });
        });

        it("The store is initialized with 2 search results", async () => {
            fetchBooks.mockImplementation(() => ({
                items: ["Harry Potter", "Hunger Games"],
            }));
            await store.dispatch.search.fetchBooks();
            expect(store.getState().search).toEqual({
                results: ["Harry Potter",
                    "Hunger Games",],
                noResults: false,
            });
        });

    });
});
