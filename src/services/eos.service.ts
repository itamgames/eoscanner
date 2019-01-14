import { StorageService } from '@/services/storage.service';

const EOS = require('eosjs');
const jstz = require('jstz');

export class EosService {
    private static instance: EosService = new EosService();
    private config: any = {};
    private contractName: string = 'eosio.token';
    private eos: any = null;
    private continent: string = jstz.determine().name().split('/')[0].toLocaleLowerCase().trim();
    private bps: any = {};

    constructor() {
        if (EosService.instance) {
            throw new Error('Error: Instantiation failed: Use EosService.getInstance() instead of new.');
        }
        EosService.instance = this;

        this.config.expireInSeconds = 60;
        this.config.broadcast = true;
        this.config.debug = false;
        this.config.sign = true;
        this.config.chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
        this.bps.asia = [
            'https://proxy.eosnode.tools',
            'https://user-api.eoseoul.io',
        ];
        this.bps.etc = [
            'https://proxy.eosnode.tools',
            'https://mainnet.eoscanada.com',
        ];
    }

    static get Instance(): EosService {
        return EosService.instance;
    }

    async settingMainNetBp() {
        const continent = await StorageService.get('continent');
        let bp = await StorageService.get('bp');
        if (continent !== this.continent || !bp) {
            bp = this.getBps()[0];
            await StorageService.set('continent', this.continent);
            await StorageService.set('bp', bp);
        }
        this.config.httpEndpoint = bp;
        this.eos = new EOS(this.config);
    }

    getBps() {
        let bps = this.bps[this.continent];
        if (!bps || bps.length === 0) {
            bps = this.bps.etc;
        }

        return bps;
    }

    /**
     * private key를 사용하여 계정들을 가지고 온다.
     *
     * @param {string} privateKey
     * @returns {Promise<Promise<any>>}
     */
    async getKeyAccounts(publicKey: string) {
        const result = await this.eos.getKeyAccounts({public_key: publicKey});
        return result.account_names;
    }

    /**
     * account에 코인이 얼마 있는지 체크한다.
     *
     * @param {string} account
     * @returns {Promise<Promise<any>>}
     */
    async getCurrencyBalance(account: string, code: string = this.contractName, symbol?: string) {
        const params: any = {account, code};
        if (symbol) {
            params.symbol = symbol;
        }
        return this.eos.getCurrencyBalance(params);
    }

    /**
     * account의 정보를 가지고 온다.
     *
     * @param {string} account
     * @returns {Promise<any>}
     */
    async getAccountInfo(account: string) {
        return this.eos.getAccount({account_name: account});
    }

    /**
     * 테이블 데이터를 가지고 온다.
     *
     * @param {string} table
     * @returns {Promise<any>}
     */
    async tableRows(table: string, scope: string = 'eosio', code: string = 'eosio', limit: number = 10000) {
        const result: any = await this.eos.getTableRows({
            scope,
            code,
            table,
            limit,
            json: true,
        });

        return result.rows;
    }

    /**
     * 서버정보를 가지고 온다.
     *
     * @returns {Promise<any>}
     */
    async getInfo() {
        return new Promise((resolve, reject) => {
            this.eos.getInfo((error: any, result: any) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result);
            });
        });
    }

    /**
     * EOS 정보를 검색한다.
     *
     * @returns {Promise<any>}
     */
    async getCurrency(contrectName: string = 'eosio.token', symbol: string = 'EOS') {
        return new Promise((resolve) => {
            this.eos.getCurrencyStats(contrectName, symbol, (error: any, result: any) => {
                resolve(result.EOS);
            });
        });
    }

    /**
     * bp를 가지고 온다.
     *
     * @returns {Promise<any>}
     */
    async getProducers() {
        const result: any = await this.eos.getProducers({json: true, limit: 100000});
        return result.rows;
    }

    /**
     * actions을 가지고 온다. EOS 뉴욕을 해야 전체 데이터를 가지고 온다.
     *
     * @param {string} account
     * @returns {Promise<Promise<any>>}
     */
    async getActions(account: string) {
        return this.eos.getActions({account_name: account, pos: -1, offset: -1000});
    }

    /**
     * 트렌젝션 정보를 가지고 온다.
     *
     * @param id
     * @returns {Promise<Promise<any>>}
     */
    async getTransaction(id: any) {
        return this.eos.getTransaction({id});
    }

    /**
     * 컨트렉트 정보를 가지고 온다.
     *
     * @param {string} account
     * @returns {Promise<any>}
     */
    async getContract(account: string) {
        return this.eos.contract(account);
    }
}
