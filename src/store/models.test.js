import { init } from "@rematch/core";
import { basket, search } from "./models";
import { mockComponent } from "react-dom/test-utils";

import { fetchBooks, fetchBook } from "./service";

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

      it("Fetch books returns no results", async () => {
        fetchBooks.mockImplementation(() => ({
          totalItems: 0,
        }));
        await store.dispatch.search.fetchBooks();
        expect(store.getState().search).toEqual({
          results: [],
          noResults: true,
          book: {},
        });
      });

      it("Fetch books returns 2 results", async () => {
        fetchBooks.mockImplementation(() => ({
          items: ["Harry Potter", "Hunger Games"],
        }));
        await store.dispatch.search.fetchBooks();
        expect(store.getState().search).toEqual({
          results: ["Harry Potter", "Hunger Games"],
          noResults: false,
          book: {},
        });
      });

      it("fetch book updates book", async () => {
        fetchBook.mockImplementation(() => ({
          book: "Harry Potter",
        }));
        await store.dispatch.search.fetchBook({ id: null });
        expect(store.getState().search.book).toEqual({ book: "Harry Potter" });
      });
    });
  });
  describe("Basket model", () => {
    let store;
    beforeEach(() => {
      store = init({
        models: {
          basket: {
            ...basket,
          },
        },
      });
    });

    it("The book and total price update when book is added to basket", async () => {
      const book = {
        volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 2.99, currencyCode: "GBP" } },
      };
      await store.dispatch.basket.addBook(book);
      expect(store.getState().basket.books).toEqual([book]);
      expect(store.getState().basket.totalPrice).toEqual(2.99)
    });
  });
});
