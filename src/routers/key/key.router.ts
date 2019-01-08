import key from './key.route.vue';

export default [
    {
        path: '/key/:key',
        name: 'key',
        component: key,
        meta: {
            title: 'Key - EOSCANNER',
        },
    },
];
