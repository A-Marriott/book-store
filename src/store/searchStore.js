import { fetchBooks } from "./service";

export const search = {
  state: {
    results: [],
  },
  reducers: {
    update(state, payload) {
      return { results: payload };
    },
  },
  effects: (dispatch) => ({
    async fetchBooks(payload) {
      const response = await fetchBooks(payload);
      dispatch.search.update(response.items);
    },
  }),
};
