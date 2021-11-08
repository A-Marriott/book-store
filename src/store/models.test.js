import { init } from "@rematch/core";
import { basket, search } from "./models";
import { fetchBooks, fetchBook } from "./service";
import MockDate from "mockdate";

jest.mock("./service");

describe("Models tests", () => {
  beforeEach(() => {
    MockDate.reset();
  });
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

        expect(store.getState().search.results).toEqual([]);
        expect(store.getState().search.noResults).toEqual(true);
      });

      it("Fetch books returns 2 results", async () => {
        fetchBooks.mockImplementation(() => ({
          items: ["Harry Potter", "Hunger Games"],
        }));
        await store.dispatch.search.fetchBooks();
        expect(store.getState().search.results).toEqual([
          "Harry Potter",
          "Hunger Games",
        ]);
        expect(store.getState().search.noResults).toEqual(false);
      });

      it("fetch book updates book", async () => {
        fetchBook.mockImplementation(() => ({
          book: "Harry Potter",
        }));
        await store.dispatch.search.fetchBook({ id: null });
        expect(store.getState().search.book).toEqual({ book: "Harry Potter" });
      });

      describe("Recently viewed books - when searching a book", () => {
        beforeEach(() => {
          store = init({
            models: {
              search: {
                ...search,
                state: {
                  recentlyViewedBooks: [
                    { id: "Harry Potter" },
                    { id: "Hunger Games" },
                  ],
                },
              },
            },
          });
        });

        it("Adds the book to recentlyViewedBooks", async () => {
          store.dispatch.search.setBook({ id: "Twilight" });
          expect(store.getState().search.recentlyViewedBooks).toEqual([
            { id: "Harry Potter" },
            { id: "Hunger Games" },
            { id: "Twilight" },
          ]);
        });

        it("Removes the oldest book from recentlyViewedBooks if the array length is over 3", async () => {
          store.dispatch.search.setBook({ id: "Twilight" });
          store.dispatch.search.setBook({ id: "Sapiens" });
          expect(store.getState().search.recentlyViewedBooks).toEqual([
            { id: "Hunger Games" },
            { id: "Twilight" },
            { id: "Sapiens" },
          ]);
        });

        it("Does not add the book if the book is already in recentlyViewedBooks", async () => {
          store.dispatch.search.setBook({ id: "Hunger Games" });
          expect(store.getState().search.recentlyViewedBooks).toEqual([
            { id: "Harry Potter" },
            { id: "Hunger Games" },
          ]);
        });
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
      it("Given I add The Bench to the basket on Fridays then the book should be discounted by 25%", async () => {
        MockDate.set("2021-11-05");
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
      MockDate.set("2021-04-25");
      await store.dispatch.basket.addVoucherCode("APRIL2021");
      expect(store.getState().basket.discountedPrice).toEqual(16);
    });
  });
  describe("discount codes", () => {
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

    it("applying a valid discount code on an invalid date - should not apply a discount", async () => {
      MockDate.set("2021-05-25");
      await store.dispatch.basket.addVoucherCode("APRIL2021");
      expect(store.getState().basket.discountedPrice).toBe(20);
    });

    it("applying a valid discount code on an invalid date - should set expired to true", async () => {
      MockDate.set("2021-05-25");
      await store.dispatch.basket.addVoucherCode("APRIL2021");
      expect(store.getState().basket.expired).toBe(true);
    });

    it("applying an invalid discount code - should set invalidCode to true", async () => {
      await store.dispatch.basket.addVoucherCode("FAIL");
      expect(store.getState().basket.invalidCode).toBe(true);
    });
  });
});
