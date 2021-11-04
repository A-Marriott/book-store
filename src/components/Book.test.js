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
