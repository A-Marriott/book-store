import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import {init} from "@rematch/core";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";

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
                            effects: {fetchBooks: jest.fn()},
                        },
                    },
                });
                const results = render(
                    <Provider store={store}>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </Provider>
                );
                findByText = results.findByText;
            })

            it("Given I search for QWERYABCDEF then it should see no results returned", async () => {
                const noResults = await findByText(/No results!/i);
                expect(noResults).toBeInTheDocument();
            })
        })
        describe("Getting results from searched query", () => {
            beforeEach(() => {
                store = init({
                    models: {
                        search: {
                            state: {
                                results: [{volumeInfo: {title: "Harry Potter"}},
                                    {volumeInfo: {title: "Hunger Games"}}],
                                noResults: false,
                            },
                            effects: {fetchBooks: jest.fn()},
                        },
                    },
                });
                const results = render(
                    <Provider store={store}>
                        <BrowserRouter>
                            <App/>
                        </BrowserRouter>
                    </Provider>
                );
                findByText = results.findByText;
            })

            it("Given I search for a query then it should see results", async () => {
                const firstBook = await findByText(/Harry Potter/i);
                expect(firstBook).toBeInTheDocument();
                const secondBook = await findByText(/Hunger Games/i);
                expect(secondBook).toBeInTheDocument();

            })
        })
    })
    describe("Redirect to book details page when click book", () => {
        beforeEach(() => {
            store = init({
                models: {
                    search: {
                        state: {
                            results: [{volumeInfo: {title: "Hunger Games"}, id: "E_3rDwAAQBAJ"}],
                            noResults: false,
                        },
                        effects: {fetchBooks: jest.fn()},
                    },
                },
            });
            const results = render(
                <Provider store={store}>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </Provider>
            );
            findByText = results.findByText;
        })

        it("Given I search for a query then it should see results", async () => {
            const link = await findByText(/Hunger Games/i);
            await fireEvent.click(link)
            expect(window.location.pathname).toBe('/book/E_3rDwAAQBAJ');
        })
    })
})

// {
//   "kind": "books#volumes",
//     "totalItems": 0
// }
