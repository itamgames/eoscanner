import account from './account.route.vue';

export default [
    {
        path: '/account/:account',
        name: 'account',
        component: account,
        meta: {
            title: 'Account - EOSCANNER',
        },
    },
];
