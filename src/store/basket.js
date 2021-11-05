const calculateTotal = (books) => {
  const bookPrices = books.map((book) => {
    return book.saleInfo.retailPrice.amount;
  });
  return bookPrices.reduce(
      (previousValue, currentValue) => previousValue + currentValue
  );
};

const removeBookFromBasket = (books, book) => {
  const index = books.indexOf(book);
  return books.splice(index, 1);
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
    removeBook(state, payload) {
      return {
        ...state,
        books: removeBookFromBasket(state.books, payload),
        totalPrice: removeBookFromBasket(state.books, payload),
      }
    }
  },
};
