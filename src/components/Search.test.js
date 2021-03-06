/* eslint-disable testing-library/await-async-query */
import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const mockAddBook = jest.fn();

describe("App starts", () => {
  let store;
  let findByText;
  describe("Search page", () => {
    describe("No results from database", () => {
      beforeEach(() => {
        store = init({
          models: {
            search: {
              state: {
                results: [],
                noResults: true,
              },
              effects: { fetchBooks: jest.fn() },
            },
            basket: {
              state: {},
              effects: { addBook: jest.fn() },
            },
          },
        });
        const results = render(
          <Provider store={store}>
            <BrowserRouter>
              <Search />
            </BrowserRouter>
          </Provider>
        );
        findByText = results.findByText;
      });

      it("Given I search for QWERYABCDEF then it should see no results returned", async () => {
        const noResults = await findByText(/No results!/i);
        expect(noResults).toBeInTheDocument();
      });
    });
    describe("Getting results from searched query", () => {
      beforeEach(() => {
        store = init({
          models: {
            search: {
              state: {
                results: [
                  {
                    volumeInfo: { title: "Harry Potter" },
                    id: "E_3rgsdfg",
                    saleInfo: {
                      retailPrice: { amount: 2.99, currencyCode: "GBP" },
                    },
                  },
                  {
                    volumeInfo: { title: "Hunger Games" },
                    id: "E_3rDwAAQBAJ",
                    saleInfo: {
                      retailPrice: { amount: 3.08, currencyCode: "GBP" },
                    },
                  },
                ],
                noResults: false,
                book: {},
              },
              effects: { fetchBooks: jest.fn() },
            },
            basket: {
              state: {},
              effects: { addBook: mockAddBook },
            },
          },
        });
        const results = render(
          <Provider store={store}>
            <BrowserRouter>
              <Search />
            </BrowserRouter>
          </Provider>
        );
        findByText = results.findByText;
      });

      it("Given I search for a query then it should see results", async () => {
        const firstBook = await findByText(/Harry Potter/i);
        expect(firstBook).toBeInTheDocument();
        const secondBook = await findByText(/Hunger Games/i);
        expect(secondBook).toBeInTheDocument();
      });

      it("Given I search for a query then it should see price of results", async () => {
        const firstBook = await findByText(/2.99 GBP/i);
        expect(firstBook).toBeInTheDocument();
      });

      it("should add book to the basket", async () => {
        fireEvent.click(screen.getByTestId("add-book-button-0"));
        expect(mockAddBook).toHaveBeenCalledTimes(1);
      });
    });
    describe("With recently viewed books", () => {
      beforeEach(() => {
        store = init({
          models: {
            search: {
              state: {
                recentlyViewedBooks: [
                  {
                    volumeInfo: { title: "Harry Potter" },
                    id: "E_3rgsdfg",
                    saleInfo: {
                      retailPrice: { amount: 2.99, currencyCode: "GBP" },
                    },
                  },
                ],
                noResults: true,
              },
              effects: { fetchBooks: jest.fn() },
            },
            basket: {
              state: {},
              effects: { addBook: jest.fn() },
            },
          },
        });
        const results = render(
          <Provider store={store}>
            <BrowserRouter>
              <Search />
            </BrowserRouter>
          </Provider>
        );
        findByText = results.findByText;
      });

      it("Should display recently viewed books", async () => {
        const book = await findByText(/Harry Potter/i);
        expect(book).toBeInTheDocument();
      });
    });
  });
  describe("Redirect to basket details page when click basket", () => {
    beforeEach(() => {
      store = init({
        models: {
          search: {
            state: {
              results: [
                {
                  volumeInfo: { title: "Harry Potter" },
                  id: "E_3rgsdfg",
                  saleInfo: {
                    retailPrice: { amount: 2.99, currencyCode: "GBP" },
                  },
                },
                {
                  volumeInfo: { title: "Hunger Games" },
                  id: "E_3rDwAAQBAJ",
                  saleInfo: {
                    retailPrice: { amount: 3.08, currencyCode: "GBP" },
                  },
                },
              ],
              noResults: false,
              book: {},
            },
            effects: { fetchBooks: jest.fn(), fetchBook: jest.fn() },
          },
          basket: {
            state: {
              totalPrice: 0,
            },
          },
        },
      });
      const results = render(
        <Provider store={store}>
          <BrowserRouter>
            <Search />
          </BrowserRouter>
        </Provider>
      );
      findByText = results.findByText;
    });

    it("Given I search for a query then the id should be passed to book page", async () => {
      const link = await findByText(/Hunger Games/i);
      fireEvent.click(link);
      expect(window.location.pathname).toBe("/book/E_3rDwAAQBAJ");
    });
  });
});
