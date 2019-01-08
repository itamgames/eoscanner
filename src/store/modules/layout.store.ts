export default {
    state: {
        loading: false,
        opacity: false,
    },
    actions: {
        loading({commit}: any, opacity?: boolean) {
            commit('loading', opacity);
        },
        unLoading({commit}: any) {
            commit('unLoading');
        },
    },
    getters: {
        loading: (state: any) => state.loading,
        opacity: (state: any) => state.opacity,
    },
    mutations: {
        loading(state: any, opacity: boolean) {
            state.opacity = opacity ? true : false;
            state.loading = true;
        },
        unLoading(state: any) {
            state.loading = false;
        },
    },
};
