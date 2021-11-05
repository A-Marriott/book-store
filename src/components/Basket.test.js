import { fireEvent, render, screen } from "@testing-library/react";
import Basket from "./Basket";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// const mockFetchBook = jest.fn();

describe("Basket page", () => {
  let store;
  let findByText;
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
                saleInfo: { retailPrice: { amount: 3.1, currencyCode: "GBP" } },
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
});
