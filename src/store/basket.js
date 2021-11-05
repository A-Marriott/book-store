const calculateTotal = (books) => {
  const bookPrices = books.map((book) => {
    return book.saleInfo.retailPrice.amount;
  });
  return bookPrices.reduce(
      (previousValue, currentValue) => previousValue + currentValue
  );
};

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
        totalPrice: calculateTotal([...state.books, payload]),
      };
    },
  },
};
