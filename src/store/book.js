export const book = {
    state: {
        title: '',
        author: '',
        description: '',
    },
    reducers: {
        update(state, payload) {
            return {
                title: payload.title,
            };
        },
    },
};
