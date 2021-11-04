export const basket = {
    state: {
        totalPrice: 0,
        books: [],
    },
    reducers: {
        addBook(state, payload) {
            return {
                ...state,
                books: [...state.books, payload],
            };
        },
    },
}
