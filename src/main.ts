import Vue from 'vue';
import App from './App.vue';
import router from './routers';
import store from './store';
import { EosService } from '@/services/eos.service';

import './filters/utils.filter';
import 'font-awesome/css/font-awesome.min.css';
import './style/index.scss';
import VModal from 'vue-js-modal';
// @ts-ignore
import TreeView from 'vue-json-tree-view';

Vue.use(TreeView);
Vue.use(VModal);
Vue.config.productionTip = false;
require('es6-promise/auto');

const main = async () => {
    await EosService.Instance.settingMainNetBp();
    new Vue({
        router,
        store,
        render: (h) => h(App),
    }).$mount('#app');
};
main();
