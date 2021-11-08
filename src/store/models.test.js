import { init } from "@rematch/core";
import { basket, search } from "./models";
import { mockComponent } from "react-dom/test-utils";

import { fetchBooks, fetchBook } from "./service";
import MockDate from "mockdate";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Basket from "../components/Basket";

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
    const basketBooks = [
      {
        id: "dYzvb3FTCTsC",
        volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 2.99, currencyCode: "GBP" } },
      },
      {
        id: "xY10boAPObio",
        volumeInfo: { title: "Hunger Games", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 3.1, currencyCode: "GBP" } },
      },
    ];
    const book = {
      id: "dYzvb3FTCTsC",
      volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
      saleInfo: { retailPrice: { amount: 2.99, currencyCode: "GBP" } },
    };
    const remainingBook = {
      id: "xY10boAPObio",
      volumeInfo: { title: "Hunger Games", description: "TESTTESTTEST" },
      saleInfo: { retailPrice: { amount: 3.1, currencyCode: "GBP" } },
    };
    beforeEach(() => {
      store = init({
        models: {
          basket: {
            ...basket,
            state: {
              books: basketBooks,
              totalPrice: 0,
            },
          },
        },
      });
    });

    it("The book and total price update when book is added to basket", async () => {
      await store.dispatch.basket.addBook(book);
      expect(store.getState().basket.books).toEqual([...basketBooks, book]);
      expect(store.getState().basket.totalPrice).toEqual(9.08);
    });

    it("The books and total price update when book is removed from basket", async () => {
      await store.dispatch.basket.removeBook(book);
      expect(store.getState().basket.books).toEqual([remainingBook]);
    });
  });
  describe("Basket discounts", () => {
    describe("friday 25% off discount", () => {
      const book = {
        id: "59UqEAAAQBAJ",
        volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10.0, currencyCode: "GBP" } },
      };
      MockDate.set("2021-11-05");
      let store;
      beforeEach(async () => {
        store = init({
          models: {
            basket: {
              ...basket,
            },
          },
        });
      });
      it("Given I add The Bench to the basket on Fridays then the book should be discounted by 25% ", async () => {
        await store.dispatch.basket.addBook(book);
        expect(store.getState().basket.discountedPrice).toEqual(7.5);
      });
    });
  });
  describe("adding more than 3 books to the basket", () => {
    let store;
    const basketBooks = [
      {
        id: "dYzvb3FTCTsCfghj",
        volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
      },
      {
        id: "xY10boAPObiohjf",
        volumeInfo: { title: "Hunger Games", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
      },
    ];
    const book = {
      id: "dYzvb3FTCTsChjf",
      volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
      saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
    };
    beforeEach(() => {
      store = init({
        models: {
          basket: {
            ...basket,
            state: {
              books: basketBooks,
              totalPrice: 20,
            },
          },
        },
      });
    });

    it("should apply 10% discount", async () => {
      await store.dispatch.basket.addBook(book);
      expect(store.getState().basket.discountedPrice).toEqual(27);
    });
  });
  describe("applying valid discount code", () => {
    MockDate.set("2021-04-25");
    let store;
    const basketBooks = [
      {
        id: "dYzvb3FTCTsCfghj",
        volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
      },
      {
        id: "xY10boAPObiohjf",
        volumeInfo: { title: "Hunger Games", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
      },
    ];
    beforeEach(() => {
      store = init({
        models: {
          basket: {
            ...basket,
            state: {
              books: basketBooks,
              totalPrice: 20,
              discountedPrice: 20,
            },
          },
        },
      });
    });

    it("given today's date is 30th April 2021 when I add the voucher code APRIL2021 then the total should be discounted 20%", async () => {
      await store.dispatch.basket.addVoucherCode("APRIL2021");
      expect(store.getState().basket.discountedPrice).toEqual(16);
    });
  });
  describe("applying not valid discount code", () => {
    MockDate.set("2021-05-25");
    let store;
    const basketBooks = [
      {
        id: "dYzvb3FTCTsCfghj",
        volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
      },
      {
        id: "xY10boAPObiohjf",
        volumeInfo: { title: "Hunger Games", description: "TESTTESTTEST" },
        saleInfo: { retailPrice: { amount: 10, currencyCode: "GBP" } },
      },
    ];
    beforeEach(() => {
      store = init({
        models: {
          basket: {
            ...basket,
            state: {
              books: basketBooks,
              totalPrice: 20,
              discountedPrice: 20,
            },
          },
        },
      });
    });

    it("given today's date is 1st May 2021 when I add the voucher code APRIL2021 then the total should not be expired and a message voucher code expired should be displayed", async () => {
      await store.dispatch.basket.addVoucherCode("APRIL2021");
      const voucherExpiredMessage = await screen.findByText(
        "Voucher code expired"
      );
      expect(voucherExpiredMessage).toBeInTheDocument();
    });
  });
});
