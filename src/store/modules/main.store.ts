import { EosService } from '@/services/eos.service';
import axios from 'axios';
import { CoinMarketCapService } from '@/services/coin-market-cap.service';

const sort = require('fast-sort');

export default {
    state: {
        global: {},
        info: {},
        market: {
            marketCap: 0,
            price: 0,
        },
        ram: {
            ram: 0,
            eos: 0,
            kbEOS: 0,
            reservedRamRate: 0,
        },
        eos: {},
        nameBids: [],
        bps: [],
        stakeRate: 0,
    },
    actions: {
        async mainInit({commit, dispatch}: any) {
            dispatch('loading');
            try {
                await dispatch('getInfo');
                await dispatch('getGlobal');
                await dispatch('getRAM');
                await dispatch('getEosInfo');
                await dispatch('getMarket');
                await dispatch('getStakeRate');
            } catch (e) {
                throw e;
            } finally {
                dispatch('unLoading');
            }
        },
        async getInfo({commit}: any) {
            const info = await EosService.Instance.getInfo();
            commit('setInfo', info);
        },
        async getRAM({commit, state}: any) {
            const global = state.global;

            const ramInfo: any = (await EosService.Instance.tableRows('rammarket'))[0];
            const ram = Number(ramInfo.base.balance.replace('RAM', ''));
            const eos = Number(ramInfo.quote.balance.replace('EOS', ''));
            const kbEOS = eos / ram * 1024;
            const reservedRamRate = Number((global.total_ram_bytes_reserved / global.max_ram_size * 100).toFixed(2));

            commit('setRAM', {ram, eos, kbEOS, reservedRamRate});
        },
        async getGlobal({commit}: any) {
            const global: any = (await EosService.Instance.tableRows('global'))[0];
            commit('setGlobal', global);
        },
        async getEosInfo({commit}: any) {
            const coin: any = await EosService.Instance.getCurrency();
            commit('setEosInfo', {
                supply: Number(coin.supply.replace('EOS', '')),
                max: Number(coin.max_supply.replace('EOS', '')),
            });
        },
        async getMarket({commit}: any) {
            const coin: any = await CoinMarketCapService.Instance.getCoin('1765');
            const price = Number(coin.quotes.USD.price);
            const marketCap = Number(coin.quotes.USD.market_cap);
            commit('setMarket', {price, marketCap});
        },
        async getNameBids({commit}: any) {
            const result = await EosService.Instance.tableRows('namebids');
            const nameBids = sort(result.map((nameBid: any) => ({
                newName: nameBid.newname,
                bidder: nameBid.high_bidder,
                bid: nameBid.high_bid / 10000,
            }))).desc((nameBid: any) => nameBid.bid);
            commit('setNameBids', nameBids);
        },
        async getBps({commit, state}: any) {
            const result: any = await EosService.Instance.getProducers();
            const totalBpVote = state.global.total_producer_vote_weight;
            const bps = result.map((bp: any) => {
                const votes = Number(bp.total_votes);
                const rate = votes / totalBpVote * 100;
                return {
                    name: bp.owner,
                    votes,
                    url: bp.url,
                    rate,
                };
            });

            commit('setBps', bps);
        },
        getStakeRate({commit, state}: any) {
            const rate = ((state.global.total_activated_stake / 10000) / 1000000000) * 100;
            commit('setStakeRate', rate.toFixed(2));
        },
    },
    getters: {
        info: (state: any) => state.info,
        global: (state: any) => state.global,
        market: (state: any) => state.market,
        nameBids: (state: any) => state.nameBids,
        bps: (state: any) => state.bps,
        eos: (state: any) => state.eos,
        ram: (state: any) => state.ram,
        stakeRate: (state: any) => Number(state.stakeRate),
    },
    mutations: {
        setMarket(state: any, market: { price: number, marketCap: number }) {
            state.market = {...market};
        },
        setNameBids(state: any, nameBids: any[]) {
            state.nameBids = [...nameBids];
        },
        setBps(state: any, bps: any[]) {
            state.bps = [...bps];
        },
        setEosInfo(state: any, eos: any) {
            state.eos = {...eos};
        },
        setGlobal(state: any, global: any) {
            state.global = {...global};
        },
        setRAM(state: any, ram: any) {
            state.ram = {...ram};
        },
        setInfo(state: any, info: any) {
            state.info = {...info};
        },
        setStakeRate(state: any, stakeRate: any) {
            state.stakeRate = stakeRate;
        },
    },
};
