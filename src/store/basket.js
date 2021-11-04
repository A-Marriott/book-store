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
    calculateTotal(state, payload) {
      const bookPrices = state.books.map((book) => {
        return book.saleInfo.retailPrice.amount;
      });
      const total = bookPrices.reduce(
        (previousValue, currentValue) => previousValue + currentValue
      );
      return {
        ...state,
        totalPrice: total,
      };
    },
  },
  effects: (dispatch) => ({
    addBookSuccess(payload) {
      dispatch.basket.addBook(payload);
      dispatch.basket.calculateTotal();
    },
  }),
};
