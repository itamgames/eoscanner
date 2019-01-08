import transaction from './transaction.route.vue';

export default [
    {
        path: '/transaction/:id',
        name: 'transaction',
        component: transaction,
        meta: {
            title: 'Transaction - EOSCANNER',
        },
    },
];
