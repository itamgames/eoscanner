import Vue from 'vue';
import Vuex from 'vuex';
import main from './modules/main.store';
import account from './modules/account.store';
import layout from './modules/layout.store';
import key from './modules/key.store';
import transaction from './modules/transaction.store';
import { EosService } from '@/services/eos.service';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        main,
        layout,
        account,
        key,
        transaction,
    },
});
