import { fireEvent, render, screen } from "@testing-library/react";
import Book from "./Book";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: "E_3rDwAAQBAJ",
  }),
}));

const mockAddBook = jest.fn();
const mockFetchBook = jest.fn();

describe("Book details page", () => {
  let store;
  let findByText;
  beforeEach(async () => {
    const mockBook = {
      volumeInfo: { title: "Harry Potter", description: "TESTTESTTEST" },
      saleInfo: { retailPrice: { amount: 2.99, currencyCode: "GBP" } },
    };

    store = init({
      models: {
        basket: {
          state: {},
          effects: {
            addBook: mockAddBook,
          },
        },
        search: {
          state: { book: mockBook },
          effects: {
            fetchBook: mockFetchBook,
          },
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Book
            addBook={mockAddBook}
            book={mockBook}
            fetchBook={mockFetchBook}
          />
        </BrowserRouter>
      </Provider>
    );
  });

  it("fetchBook is called with id", async () => {
    expect(mockFetchBook).toHaveBeenCalledWith(
      { id: "E_3rDwAAQBAJ" },
      expect.anything(),
      undefined
    );
  });

  it("should display basket title", async () => {
    const title = await screen.findByText("Title: Harry Potter");
    expect(title).toBeVisible();
  });

  it("should display price", async () => {
    const price = await screen.findByText("Price: 2.99 GBP");
    expect(price).toBeVisible();
  });

  it("should display price", async () => {
    const price = await screen.findByText("Description: TESTTESTTEST");
    expect(price).toBeVisible();
  });

  it("should add book to the basket", async () => {
    fireEvent.click(screen.getByTestId("add-book-button"));
    expect(mockAddBook).toHaveBeenCalledTimes(1);
  });
});
//
