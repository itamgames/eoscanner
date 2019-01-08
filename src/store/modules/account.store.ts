import { EosService } from '@/services/eos.service';
import { CoinMarketCapService } from '@/services/coin-market-cap.service';
import { ApiService } from '@/services/api.service';

const sort = require('fast-sort');

export default {
    state: {
        accountInfo: {},
        actions: {},
        balance: {
            unstaked: '',
            staked: '',
            refund: '',
            total: '',
            rate: {
                staked: 0,
                unstaked: 0,
                refund: 0,
            },
            price: 0,
        },
        resource: {},
        customTokens: {},
        contract: null,
        actionTypes: [
            {title: 'Transfer', value: 'transfer'},
            {title: 'Delegate', value: 'delegatebw'},
            {title: 'Undelegate', value: 'undelegatebw'},
            {title: 'Refund', value: 'refund'},
            {title: 'Create Account', value: 'newaccount'},
            {title: 'Buy RAM', value: 'buyram'},
            {title: 'Buy RAM Bytes', value: 'buyrambytes'},
            {title: 'Sell RAM', value: 'sellram'},
        ],
        totalPageGroup: 1,
    },
    actions: {
        async accountInit({commit, dispatch}: any, account: string) {
            dispatch('loading');
            dispatch('contractInfo', account);
            try {
                commit('clearAccountState');
                await dispatch('getAccountInfo', account);
                await dispatch('getActions', {accountName: account});
            } catch (e) {
                throw e;
            } finally {
                dispatch('unLoading');
            }
        },
        async contractInfo({commit}: any, account: string) {
            const contract = await EosService.Instance.getContract(account);
            commit('setContract', contract.fc.abi);
        },
        async getAccountInfo({commit}: any, account: string) {
            const info = await EosService.Instance.getAccountInfo(account);

            const balance: any = {};
            const refundReq = info.refund_request;
            const unstaked = info.core_liquid_balance ? Number(info.core_liquid_balance.replace('EOS', '')) : 0;
            const staked = info.voter_info ? info.voter_info.staked / 10000 : 0;
            let refund = 0;
            if (refundReq) {
                refund = Number(refundReq.net_amount.replace('EOS', '')) +
                    Number(refundReq.cpu_amount.replace('EOS', ''));
            }

            balance.unstaked = unstaked;
            balance.staked = staked;
            balance.refund = refund;
            balance.total = refund + unstaked + staked;
            balance.price = await CoinMarketCapService.Instance.getCoinPrice('1765');

            balance.rate = {};
            balance.rate.staked = balance.total ? staked / balance.total * 100 : 0;
            balance.rate.unstaked = balance.total ? unstaked / balance.total * 100 : 0;
            balance.rate.refund = balance.total ? refund / balance.total * 100 : 0;

            const totalResources = info.total_resources;
            const resource = {
                cpu: {
                    max: info.cpu_limit.max,
                    used: info.cpu_limit.used,
                    rate: info.cpu_limit.used / info.cpu_limit.max * 100,
                    eos: totalResources.cpu_weight,
                },
                bandwidth: {
                    max: info.net_limit.max,
                    used: info.net_limit.used,
                    rate: info.net_limit.used / info.net_limit.max * 100,
                    eos: totalResources.net_weight,
                },
                ram: {
                    max: info.ram_quota,
                    used: info.ram_usage,
                    rate: info.ram_usage / info.ram_quota * 100,
                },
            };

            commit('setResource', resource);
            commit('setAccountInfo', info);
            commit('setBalance', balance);
        },
        async getActions({commit, dispatch, state}: any, {accountName, type, value, page}: any) {
            dispatch('getCustomTokens', accountName);
            const params: any = {};
            if (type === 'type') {
                params.actionType = value;
            } else if (type === 'contractName') {
                params.contractName = value;
            }

            const result: any = await ApiService.Instance.getActions(accountName, page, params);

            commit('setActions', result);
        },
        async getCustomTokens({commit, dispatch}: any, accountName: any) {
            const accountInfo: any = await ApiService.Instance.getTokens(accountName);

            const tokens = [];
            for (const token of accountInfo.balances) {
                if (token.currency !== 'EOS' && Number(token.amount) > 0) {
                    let price = 0;
                    if (token.currency === 'EOSDAC') {
                        price = await CoinMarketCapService.Instance.getCoinPrice('2644');
                    } else if (token.currency === 'IQ') {
                        price = await CoinMarketCapService.Instance.getCoinPrice('2930');
                    }

                    tokens.push({
                        contractName: token.contract,
                        symbol: token.currency,
                        balance: token.amount,
                        price,
                    });
                }
            }

            commit('setCustomTokens', tokens);
        },
        async getTable({commit, dispatch}: any, {account, table}: any) {
            return await EosService.Instance.tableRows(table, account, account, 1000);
        },
    },
    getters: {
        accountInfo: (state: any) => state.accountInfo,
        actions: (state: any) => state.actions,
        customTokens: (state: any) => state.customTokens,
        arrayCustomTokens: (state: any) => {
            let customTokens: any[] = [];
            for (const key of Object.keys(state.customTokens)) {
                customTokens.push(state.customTokens[key]);
            }

            if (customTokens.length > 0) {
                customTokens = sort(customTokens).desc((customToken: any) => Number(customToken.balance));
            }

            return customTokens;
        },
        balance: (state: any) => state.balance,
        actionTypes: (state: any) => state.actionTypes,
        resource: (state: any) => state.resource,
        contract: (state: any) => state.contract,
        totalPageGroup: (state: any) => state.totalPageGroup,
    },
    mutations: {
        setAccountInfo(state: any, accountInfo: any) {
            state.accountInfo = {...accountInfo};
        },
        setActions(state: any, actionsInfo: any) {
            state.actions = [...actionsInfo.actions];
            state.totalPageGroup = Math.ceil(actionsInfo.count / 50);
        },
        setCustomTokens(state: any, customTokens: any) {
            state.customTokens = customTokens;
        },
        setBalance(state: any, balance: any) {
            state.balance = balance;
        },
        setResource(state: any, resource: any) {
            state.resource = {...resource};
        },
        clearAccountState(state: any) {
            state.accountInfo = {};
            state.actions = {};
            state.balance = {};
            state.resource = {};
            state.customTokens = {};
            state.contract = null;
        },
        setContract(state: any, contract: any) {
            state.contract = contract;
        },
    },
};
