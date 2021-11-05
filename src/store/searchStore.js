import { fetchBooks, fetchBook } from "./service";

export const search = {
  state: {
    book: {},
    results: [],
    noResults: false,
  },
  reducers: {
    setBook(state, payload) {
      return {
        ...state,
        book: payload,
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
