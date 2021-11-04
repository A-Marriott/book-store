import {fireEvent, render, screen} from '@testing-library/react';
import App from './App';
import Book from "./components/Book";
import {init} from "@rematch/core";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Router, useParams} from "react-router-dom";
import {fetchBook} from "./store/service";
import {createMemoryHistory} from 'history'

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
    describe("Book details page", () => {
        beforeEach(() => {
            fetchBook.mockImplementation(() => {
                {
                    volumeInfo: {
                        title: "Harry Potter"
                    }
                }
            })
            // {
            //     volumeInfo: {title: "Harry Potter"},
            //  saleInfo: {retailPrice: {amount: 2.99, currencyCode:"GBP"}},
            // }
        });
    });

    it("Given I search for a query then it should see results", async () => {
        const renderWithRouter = (ui, {route ='/book/E_3rDwAAQBAJ'} = {}) => {
            window.history.pushState({}, 'Test page', route)

            return render(ui, {wrapper: BrowserRouter})
        }
        const { findByText, history, findByLabelText } = renderWithRouter(
            <Route path={'/book/E_3rDwAAQBAJ'}> // Note the EMPTY param
                <Book />
            </Route>,
            {
                route: routes.admin.users.user.root(testId),
            });

        // const history = createMemoryHistory()
        // const route = '/book/1o7D0m_osFEC'
        // history.push(route)
        // const {findByText} = render(
        //     <Router history={history}>
        //         <Book />
        //     </Router>,
        // )
        // //  render(<Book />);
        // const title = await findByText("Harry Potter");
        // expect(title).toBeVisible();
    });
})
