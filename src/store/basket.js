const calculateTotal = (books) => {
  const bookPrices = books.map((book) => {
    return book.saleInfo.retailPrice.amount;
  });
  return bookPrices.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
};

const removeBookFromBasket = (books, book) => {
  const idOfBooks = books.map((b) => b.id);
  const index = idOfBooks.indexOf(book.id);
  console.log(index);
  let newBooks = books;
  newBooks.splice(index, 1);
  return newBooks;
};

// add discounted price key to each book
// use this to get initial discounted price

// const discount
// 50% discount if statement - e.g. if day is friday

export const basket = {
  state: {
    totalPrice: 0,
    // discountedPrice: 0,
    books: [],
  },
  reducers: {
    addBook(state, payload) {
      const updatedBooks = [...state.books, payload];
      return {
        ...state,
        books: updatedBooks,
        totalPrice: calculateTotal(updatedBooks),
      };
    },
    removeBook(state, payload) {
      const updatedBooks = removeBookFromBasket(state.books, payload);
      return {
        ...state,
        books: updatedBooks,
        totalPrice: calculateTotal(updatedBooks),
      };
    },
  },
};
