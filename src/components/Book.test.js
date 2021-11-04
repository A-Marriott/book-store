import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import Book from "./Book";
import {fetchBook} from "../store/service";

jest.mock('../store/service');

jest.mock("react-router-dom", () => ({
    useParams: () => ({
        id: "E_3rDwAAQBAJ",
    }),
}));

describe("Book details page", () => {
    beforeEach(() => {
        fetchBook.mockImplementation(() => (
            {
                volumeInfo: {title: "Harry Potter", description: "TESTTESTTEST"},
                saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
            }
        ));
    });

    it("fetchBook is called with id", async () => {
        await act(() =>
            waitFor(() =>
                render(<Book/>)
            ));
        expect(fetchBook).toHaveBeenCalledWith("E_3rDwAAQBAJ");
    })

    it("should display basket title", async () => {
        const {findByText} = render(<Book/>);
        const title = await findByText("Title: Harry Potter");
        expect(title).toBeVisible();
    });

    it("should display price", async () => {
        const {findByText} = render(<Book/>);
        const price = await findByText("Price: 2.99 GBP");
        expect(price).toBeVisible();
    });

    it("should display price", async () => {
        const {findByText} = render(<Book/>);
        const price = await findByText("Description: TESTTESTTEST");
        expect(price).toBeVisible();
    });
});

//
// import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
// import Book from "./Book";
// import {fetchBook} from "../store/service";
// import {init} from "@rematch/core";
// import {Provider} from "react-redux";
// import {BrowserRouter} from "react-router-dom";
// import App from "../App";
//
// jest.mock('../store/service');
//
// jest.mock("react-router-dom", () => ({
//     useParams: () => ({
//         id: "E_3rDwAAQBAJ",
//     }),
// }));
//
// const mockAddBook = jest.fn();
//
//
// describe("Book details page", () => {
//     let store;
//     let findByText;
//
//     beforeEach(() => {
//         store = init({
//             models: {
//                 search: {
//                     state: {
//                         results: [{
//                             volumeInfo: {title: "Harry Potter"}, id: "E_3rgsdfg",
//                             saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
//                         },
//                             {
//                                 volumeInfo: {title: "Hunger Games"}, id: "E_3rDwAAQBAJ",
//                                 saleInfo: {retailPrice: {amount: 3.08, currencyCode: "GBP"}},
//                             },],
//                         noResults: false,
//                     },
//                     effects: {fetchBooks: jest.fn()},
//                 },
//                 basket: {
//                     state: {
//                         books: [{
//                             volumeInfo: {title: "Harry Potter", description: "TESTTESTTEST"},
//                             saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
//                         }]
//                     }
//                 }
//             },
//         });
//         const results = render(
//             <Provider store={store}>
//                 <BrowserRouter>
//                     <Book/>
//                 </BrowserRouter>
//             </Provider>
//         );
//         findByText = results.findByText;
//         fetchBook.mockImplementation(() => (
//             {
//                 volumeInfo: {title: "Harry Potter", description: "TESTTESTTEST"},
//                 saleInfo: {retailPrice: {amount: 2.99, currencyCode: "GBP"}},
//             }
//         ));
//     });
//
//     it("fetchBook is called with id", async () => {
//         await act(() =>
//             waitFor(() =>
//                 render(<Book/>)
//             ));
//         expect(fetchBook).toHaveBeenCalledWith("E_3rDwAAQBAJ");
//     })
//
//     it("should display basket title", async () => {
//         const {findByText} = render(<Book/>);
//         const title = await findByText("Title: Harry Potter");
//         expect(title).toBeVisible();
//     });
//
//     it("should display price", async () => {
//         const {findByText} = render(<Book/>);
//         const price = await findByText("Price: 2.99 GBP");
//         expect(price).toBeVisible();
//     });
//
//     it("should display price", async () => {
//         const {findByText} = render(<Book/>);
//         const price = await findByText("Description: TESTTESTTEST");
//         expect(price).toBeVisible();
//     });
//
//     it("should add book to the basket", async () => {
//         const {findByText} = render(<Book/>);
//         const button = await findByText("Add to basket")
//         await fireEvent.click(button)
//         expect(button).toHaveBeenCalled(1);
//     });
// });
