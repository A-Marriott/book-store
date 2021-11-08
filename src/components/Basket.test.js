import { fireEvent, render, screen } from "@testing-library/react";
import Basket from "./Basket";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

const mockRemoveBook = jest.fn();
const mockAddVoucherCode = jest.fn();

describe("Basket page", () => {
  describe("books in basket", () => {
    let store;
    beforeEach(async () => {
      store = init({
        models: {
          basket: {
            state: {
              books: [
                {
                  volumeInfo: {
                    title: "Harry Potter",
                    description: "TESTTESTTEST",
                  },
                  saleInfo: {
                    retailPrice: { amount: 2.99, currencyCode: "GBP" },
                  },
                },
                {
                  volumeInfo: {
                    title: "Hunger Games",
                    description: "TESTTESTTEST",
                  },
                  saleInfo: {
                    retailPrice: { amount: 3.1, currencyCode: "GBP" },
                  },
                },
                {
                  volumeInfo: { title: "LOTR", description: "TESTTESTTEST" },
                  saleInfo: {
                    retailPrice: { amount: 99.99, currencyCode: "GBP" },
                  },
                },
              ],
              totalPrice: 95.95,
            },
            effects: {
              removeBook: mockRemoveBook,
            },
          },
          search: {
            state: {},
            effects: {},
          },
        },
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <Basket />
          </BrowserRouter>
        </Provider>
      );
    });

    it("should display books titles", async () => {
      const firstTitle = await screen.findByText("Title: Harry Potter");
      expect(firstTitle).toBeVisible();
      const secondTitle = await screen.findByText("Title: Hunger Games");
      expect(secondTitle).toBeVisible();
      const thirdTitle = await screen.findByText("Title: LOTR");
      expect(thirdTitle).toBeVisible();
    });

    it("should display books prices", async () => {
      const firstPrice = await screen.findByText("Price: 2.99 GBP");
      expect(firstPrice).toBeVisible();
      const secondPrice = await screen.findByText("Price: 3.1 GBP");
      expect(secondPrice).toBeVisible();
      const thirdPrice = await screen.findByText("Price: 99.99 GBP");
      expect(thirdPrice).toBeVisible();
    });

    it("should display total price", async () => {
      const totalPrice = await screen.findByText("Total price: 95.95");
      expect(totalPrice).toBeVisible();
    });

    it("given I click remove book in the basket then I should see the book removed from the basket", async () => {
      fireEvent.click(screen.getByTestId("remove-book-button-0"));
      expect(mockRemoveBook).toHaveBeenCalledTimes(1);
    });
  });

  describe("basket is empty", () => {
    let store;
    beforeEach(async () => {
      store = init({
        models: {
          basket: {
            state: {
              books: [],
              totalPrice: 0,
            },
            effects: {},
          },
          search: {
            state: {},
            effects: {},
          },
        },
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <Basket />
          </BrowserRouter>
        </Provider>
      );
    });
    it("Given I have nothing in my basket when I navigate to checkout page then my basket should be empty and total is zero", async () => {
      const totalPrice = await screen.findByText("Your basket is empty");
      expect(totalPrice).toBeVisible();
    });
  });

  describe("discounts", () => {
    let store;
    beforeEach(async () => {
      store = init({
        models: {
          basket: {
            state: {
              books: [],
              totalPrice: 0,
              expired: true,
              invalidCode: true,
            },
            effects: { addVoucherCode: mockAddVoucherCode },
          },
          search: {
            state: {},
            effects: {},
          },
        },
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <Basket />
          </BrowserRouter>
        </Provider>
      );
    });
    it("pressing submit calls addVoucher", async () => {
      fireEvent.click(screen.getByTestId("submit"));
      expect(mockAddVoucherCode).toHaveBeenCalledTimes(1);
    });
    it("displays a voucher expiration message if you enter a valid code on an invalid date", async () => {
      const errorMessage = await screen.getByText("Voucher code expired");
      expect(errorMessage).toBeVisible();
    });
    it("displays a voucher invalid message if you enter an invalid code", async () => {
      const errorMessage = await screen.getByText("Voucher code invalid");
      expect(errorMessage).toBeVisible();
    });
  });
});
