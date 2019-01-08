import Vue from 'vue';
import Router from 'vue-router';
const headful = require('headful').default;

import main from './main/main.router';
import account from './account/account.router';
import key from './key/key.router';
import transaction from './transaction/transaction.router';

Vue.use(Router);

const router: Router = new Router({
    mode: 'history',
    routes: [
        ...main,
        ...account,
        ...key,
        ...transaction,
    ],
});

router.beforeResolve((to, from, next) => {
    if (to.meta.title) {
        headful({title: to.meta.title});
    } else {
        headful({title: 'EOScanner - EOS Block Explorer'});
    }
    next();
});

export default router;
