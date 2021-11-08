const calculateTotal = (books) => {
  if (books.length === 0) {
    return 0;
  }
  const bookPrices = books.map((book) => {
    return book.saleInfo.retailPrice.amount;
  });
  return bookPrices.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
};

const calculateDiscountedTotal = (books, voucher) => {
  if (books.length === 0) {
    return 0;
  }
  const date = new Date();
  const bookPrices = books.map((book) => {
    if (book.id === "59UqEAAAQBAJ" && date.getDay() === 5) {
      return book.saleInfo.retailPrice.amount * 0.75;
    }
    return book.saleInfo.retailPrice.amount;
  });
  const total = bookPrices.reduce(
    (previousValue, currentValue) => previousValue + currentValue
  );
  return calculateDiscountedPrice(total, books, voucher, date);
};

const removeBookFromBasket = (books, book) => {
  const idOfBooks = books.map((b) => b.id);
  const index = idOfBooks.indexOf(book.id);
  let newBooks = books;
  newBooks.splice(index, 1);
  return newBooks;
};

const calculateDiscountedPrice = (total, books, voucher, date) => {
  if (voucher === "APRIL2021" && date.getMonth() === 3) {
    return total * 0.8;
  } else if (books.length >= 3) {
    return total * 0.9;
  } else {
    return total;
  }
};

const expiredVoucher = (voucher) => {
  const date = new Date();
  if (voucher === "APRIL2021" && date.getMonth() !== 3) {
    return true;
  }
  return false;
};

const invalidVoucher = (voucher) => {
  if (voucher !== "APRIL2021") {
    return true;
  }
  return false;
};

export const basket = {
  state: {
    totalPrice: 0,
    discountedPrice: 0,
    books: [],
    voucherCode: "",
    expired: false,
    invalidCode: false,
  },
  reducers: {
    addVoucherCode(state, payload) {
      const isExpired = expiredVoucher(payload);
      const isInvalid = invalidVoucher(payload);
      return {
        ...state,
        voucherCode: payload,
        discountedPrice: calculateDiscountedTotal(state.books, payload),
        expired: isExpired,
        invalidCode: isInvalid,
      };
    },
    addBook(state, payload) {
      const updatedBooks = [...state.books, payload];
      return {
        ...state,
        books: updatedBooks,
        totalPrice: calculateTotal(updatedBooks),
        discountedPrice: calculateDiscountedTotal(
          updatedBooks,
          state.voucherCode
        ),
      };
    },
    removeBook(state, payload) {
      const updatedBooks = removeBookFromBasket(state.books, payload);
      return {
        ...state,
        books: updatedBooks,
        totalPrice: calculateTotal(updatedBooks),
        discountedPrice: calculateDiscountedTotal(
          updatedBooks,
          state.voucherCode
        ),
      };
    },
  },
};
