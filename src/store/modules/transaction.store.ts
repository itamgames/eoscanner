import { EosService } from '@/services/eos.service';


export default {
    state: {
        transaction: {},
        transactionActions: [],
    },
    actions: {
        async getTransaction({commit, dispatch}: any, id: string) {
            dispatch('loading');
            try {
                commit('clearTransactionState');
                const result: any = await EosService.Instance.getTransaction(id);
                if (result.id !== id) {
                    throw new Error('not Found');
                }

                const actions = result.traces;
                const uniqueActions: any[] = [];

                for (const action of actions) {
                    let isPush = true;
                    for (const uniqueAction of uniqueActions) {
                        if (action.act.name === uniqueAction.act.name) {
                            isPush = false;
                            break;
                        }
                    }

                    if (isPush) {
                        uniqueActions.push(action);
                    }
                }
                commit('setTransactionActions', uniqueActions);
                commit('setTransaction', result);
            } catch (e) {
                throw e;
            } finally {
                dispatch('unLoading');
            }
        },
    },
    getters: {
        transaction: (state: any) => state.transaction,
        transactionActions: (state: any) => state.transactionActions,
    },
    mutations: {
        setTransactionActions(state: any, transactionActions: any[]) {
            state.transactionActions = [...transactionActions];
        },
        setTransaction(state: any, transaction: {}) {
            state.transaction = {...transaction};
        },
        clearTransactionState(state: any) {
            state.transaction = {};
            state.actions = {};
        },
    },
};
