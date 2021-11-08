import { fetchBooks, fetchBook } from "./service";

const setRecentlyViewedBooks = (recentlyViewedBooks, book) => {
  const booksArray = recentlyViewedBooks;
  const recentlyViewedBookIds = recentlyViewedBooks.map((b) => b.id);
  if (!recentlyViewedBookIds.includes(book.id)) {
    booksArray.push(book);
  }
  if (booksArray.length > 3) {
    booksArray.shift();
  }
  return booksArray;
};

// state.recentlyviewed = []
// submit search, push book to array
// if length is greater than 3, remove oldest item
// ignore adding if item is already in array
// display this on page somehow

export const search = {
  state: {
    book: {},
    results: [],
    noResults: false,
    recentlyViewedBooks: [],
  },
  reducers: {
    setBook(state, payload) {
      return {
        ...state,
        book: payload,
        recentlyViewedBooks: setRecentlyViewedBooks(
          state.recentlyViewedBooks,
          payload
        ),
      };
    },
    update(state, payload) {
      return {
        ...state,
        results: payload,
        noResults: false,
      };
    },
    noSearchResults(state, payload) {
      return {
        ...state,
        results: [],
        noResults: true,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchBook({ id }) {
      const response = await fetchBook(id);
      dispatch.search.setBook(response);
    },
    async fetchBooks(payload) {
      const response = await fetchBooks(payload);
      if (response.totalItems === 0) {
        dispatch.search.noSearchResults();
      } else {
        dispatch.search.update(response.items);
      }
    },
  }),
};
