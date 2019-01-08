import axios from 'axios';

export class ApiService {
    private static instance: ApiService = new ApiService();
    private url: string = 'https://doors.itam.games';

    constructor() {
        if (ApiService.instance) {
            throw new Error('Error: Instantiation failed: Use EosService.getInstance() instead of new.');
        }
        ApiService.instance = this;
    }

    static get Instance(): ApiService {
        return ApiService.instance;
    }

    async getActions(accountName: string,
                     nowPage: number = 0,
                     params?: { actionType?: string, contractName?: string },
    ) {
        nowPage = nowPage ? nowPage - 1 : nowPage;
        const result: any = await axios.get(`${this.url}/actions/get/${accountName}/${nowPage}`, {params});
        return result.data;
    }

    async getTokens(accountName: string) {
        const result: any = await axios.get(`https://api.light.xeos.me/api/account/eos/${accountName}`);
        return result.data;
    }

    async getActionTypes(accountName: string) {
        const result: any = await axios.get(`${this.url}/actions/types/${accountName}`);
        return result.data;
    }
}
