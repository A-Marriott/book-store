import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import {init} from "@rematch/core";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Router, useParams} from "react-router-dom";


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
            });

            it("Given I search for QWERYABCDEF then it should see no results returned", async () => {
                const noResults = await findByText(/No results!/i);
                expect(noResults).toBeInTheDocument();
            });
        })
        describe("Getting results from searched query", () => {
            beforeEach(() => {
                store = init({
                    models: {
                        search: {
                            state: {
                                results: [{
                                    volumeInfo: {title: "Harry Potter"},
                                    saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
                                },
                                    {
                                        volumeInfo: {title: "Hunger Games"},
                                        saleInfo: {retailPrice: {amount: 3.08, currencyCode: "GBP"}},
                                    },],
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
        })
    })
    describe("Redirect to book details page when click book", () => {
        beforeEach(() => {
            store = init({
                models: {
                    search: {
                        state: {
                            results: [{
                                volumeInfo: {title: "Harry Potter"}, id: "E_3rgsdfg",
                                saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
                            },
                                {
                                    volumeInfo: {title: "Hunger Games"}, id: "E_3rDwAAQBAJ",
                                    saleInfo: {retailPrice: {amount: 3.08, currencyCode: "GBP"}},
                                },],
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

// Book component test