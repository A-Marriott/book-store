export const basket = {
    state: {
        totalPrice: 0,
        books: [],
    },
    reducers: {
        addBooks(state, payload) {
            return {
                ...state,
                books: [...state.books, payload],
            };
        },
    },
};
