import {init} from "@rematch/core";
import {basket, search} from "./models";
import {mockComponent} from "react-dom/test-utils";

import {fetchBooks, fetchBook} from "./service";

jest.mock("./service");

describe("Models tests", () => {
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
    describe("Basket model", () => {
        let store
        beforeEach(() => {
            store = init({
                models: {
                    basket: {
                        ...basket,
                    },
                },
            });
        });

        it("The store update when book is added to baasket", async () => {
            const book = {
                volumeInfo: {title: "Harry Potter", description: "TESTTESTTEST"},
                saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
            };
            await store.dispatch.basket.addBook(book);
            expect(store.getState().basket.books).toEqual([book])
        });
    });
});

