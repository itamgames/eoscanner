import { EosService } from '@/services/eos.service';



export default {
    state: {
        accounts: [],
    },
    actions: {
        async getAccounts({commit, dispatch}: any, publicKey: string) {
            dispatch('clearAccounts');
            const accounts = await EosService.Instance.getKeyAccounts(publicKey);
            commit('setAccounts', accounts);
        },
        clearAccounts({commit}: any) {
            commit('setAccounts', []);
        },
    },
    getters: {
        accounts: (state: any) => state.accounts,
    },
    mutations: {
        setAccounts(state: any, accounts: string[]) {
            state.accounts = [...accounts];
        },
    },
};
