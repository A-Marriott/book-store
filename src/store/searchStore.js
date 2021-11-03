import {fetchBooks} from "./service";

export const search = {
    state: {
        results: [],
        noResults: false,
    },
    reducers: {
        update(state, payload) {
            return {
                results: payload,
                noResults: false,
            };
        },
        noSearchResults(state, payload) {
            return {
                results: [],
                noResults: true,
            }
        }
    },
    effects: (dispatch) => ({
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
