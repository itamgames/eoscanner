<template>
    <div v-if="isShow">
        <section v-if="accountInfo.account_name" class="row info">
            <div class="account col-12">
                <h4 class="route-title">
                    <small>Account</small>
                    <br>
                    {{accountInfo.account_name}}
                </h4>
                <div class="balance detail-info row">
                    <h5 class="col-12">
                        Balance<br>
                        <small>(total: {{balance.total | comma}} EOS)</small>
                    </h5>
                    <div class="col-sm-4 text-center">
                        <circle-progress class="mx-auto" :rate="balance.rate.unstaked"
                                         :title="balance.rate.unstaked.toFixed(2) + '%'"
                                         :diameter="130"></circle-progress>
                        <div class="title">
                            {{balance.unstaked | comma}} EOS
                        </div>
                        <div class="sub-title">
                            Unstake
                        </div>
                    </div>
                    <div class="col-sm-4 text-center">
                        <circle-progress class="mx-auto" :rate="balance.rate.staked"
                                         :title="balance.rate.staked.toFixed(2) + '%'"
                                         :diameter="130"></circle-progress>
                        <div class="title">
                            {{balance.staked | comma}} EOS
                        </div>
                        <div class="sub-title">
                            Stake
                        </div>
                    </div>
                    <div class="col-sm-4 text-center">
                        <circle-progress class="mx-auto" :rate="balance.rate.refund"
                                         :title="balance.rate.refund.toFixed(2) + '%'"
                                         :diameter="130"></circle-progress>
                        <div class="title">
                            {{balance.refund | comma}} EOS
                        </div>
                        <div class="sub-title">
                            Refund
                        </div>
                    </div>
                </div>
                <div class="resource detail-info row">
                    <h5 class="col-12">
                        Resource
                    </h5>
                    <div class="col-sm-4 text-center">
                        <circle-progress class="mx-auto" :rate="resource.cpu.rate"
                                         :title="resource.cpu.rate.toFixed(2) + '%'"
                                         :diameter="130"></circle-progress>
                        <div class="title">
                            {{resource.cpu.used | us | comma}} / {{resource.cpu.max | us | comma}}
                        </div>
                        <div class="sub-title">
                            CPU ({{resource.cpu.eos | comma}})
                        </div>
                    </div>
                    <div class="col-sm-4 text-center">
                        <circle-progress class="mx-auto" :rate="resource.bandwidth.rate"
                                         :title="resource.bandwidth.rate.toFixed(2) + '%'"
                                         :diameter="130"></circle-progress>
                        <div class="title">
                            {{resource.bandwidth.used | byte | comma}} /
                            {{resource.bandwidth.max | byte | comma}}
                        </div>
                        <div class="sub-title">
                            Bandwidth ({{resource.bandwidth.eos | comma}})
                        </div>
                    </div>
                    <div class="col-sm-4 text-center">
                        <circle-progress class="mx-auto" :rate="resource.ram.rate"
                                         :title="resource.ram.rate.toFixed(2) + '%'"
                                         :diameter="130"></circle-progress>
                        <div class="title">
                            {{resource.ram.used | byte | comma}} / {{resource.ram.max | byte | comma}}
                        </div>
                        <div class="sub-title">
                            Memory
                        </div>
                    </div>
                </div>
                <div class="custom-tokens row">
                    <h5 class="col-12">
                        Tokens
                    </h5>
                    <div class="col-sm-3 mt-2 mb-2 text-center">
                        <div class="col-12 p-3 custom-token">
                            <div class="sub-title">EOS<br><small>(eosio.token)</small></div>
                            <div class="title">{{balance.total | comma}}</div>
                            <div class="title">(${{balance.total * balance.price | comma(2)}})</div>
                        </div>
                    </div>
                    <div class="col-sm-3 mt-2 mb-2 text-center" v-for="(customToken, index) of arrayCustomTokens"
                         :key="index">
                        <div class="col-12 p-3 custom-token">
                            <div class="sub-title">{{customToken.symbol}}<br><small>({{customToken.contractName}})</small></div>
                            <div class="loader" v-if="customToken.balance === null"></div>
                            <div v-else>
                                <div class="title">{{customToken.balance | comma}}</div>
                                <div class="title" v-if="customToken.price">
                                    (${{customToken.balance * customToken.price | comma(2)}})
                                </div>
                                <div class="title" v-else>-</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="tabs row mt-5">
                    <div class="col-12">
                        <ul class="nav nav-tabs" style="width: 100%">
                            <li class="nav-item" @click="actived('actions')">
                                <div class="nav-link" :class="{active: active === 'actions'}">Actions</div>
                            </li>
                            <li class="nav-item" @click="actived('contract')">
                                <div class="nav-link " :class="{active: active === 'contract'}">Contract</div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="actions row mt-3 mb-3" v-if="active === 'actions'">
                    <div class="col-12 mb-3">
                        <select class="custom-select" v-model="actionType"
                                @change="filterActions('type', actionType)">
                            <option selected value="">All</option>
                            <option v-for="(type, index) of actionTypes" :key="index" :value="type.value">
                                {{type.title}}
                            </option>
                        </select>
                    </div>
                    <div class="col-12">
                        <div class="col-12 row m-0 header pt-2 pb-2">
                            <div class="col-2">ID</div>
                            <div class="col-3">DATE</div>
                            <div class="col-2">TYPE</div>
                            <div class="col-5">INFO</div>
                        </div>
                        <div v-for="(action, index) of actions" :key="index"
                             class="col-12 row body m-0 pt-3 justify-content-center align-items-center border-top">
                            <div class="col-sm-2 id  pb-3">
                                <div class="text-black-50 label">ID:</div>
                                <router-link :to="`/transaction/${action.trxId}`">
                                    {{action.actionId}}
                                </router-link>
                            </div>
                            <div class="col-sm-3 time pb-3">
                                <div class="text-black-50 label">DATE:</div>
                                {{action.expiration | timezone}}
                            </div>
                            <div class="col-sm-2 type pb-3">
                                <div class="text-black-50 label">TYPE:</div>
                                {{action.name}}
                                <div class="type-detail" v-if="action.name === 'transfer'">
                                    <span class="text-info"
                                          v-if="action.data.from === accountInfo.account_name">(Sent)</span>
                                    <span class="text-success" v-else>(Received)</span>
                                </div>
                                <div class="type-detail" v-if="action.name === 'newaccount'">
                                    <span class="text-primary"
                                          v-if="action.data.creator === accountInfo.account_name">(Created)</span>
                                    <span class="text-secondary" v-else>(Received)</span>
                                </div>
                            </div>
                            <div class="col-sm-5 pb-3">
                                <div class="text-black-50 label">INFO:</div>
                                <div v-if="action.name === 'transfer' && action.data.quantity">
                                    <div>
                                        <span class="text-primary"
                                              @click="move(action.data.from)">{{action.data.from}}</span>
                                        ->
                                        <span class="text-primary"
                                              @click="move(action.data.to)">{{action.data.to}}</span>
                                    </div>
                                    <div class="eos"> {{action.data.quantity | comma}}</div>
                                    <div class="text-black-50">
                                        (Memo: {{action.data.memo}})
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'newaccount'">
                                    <div>
                                        <span class="text-primary" @click="move(action.data.creator)">{{action.data.creator}}</span>
                                        ->
                                        <span class="text-primary"
                                              @click="move(action.data.name)">{{action.data.name}}</span>
                                    </div>
                                    <div class="eos">
                                        Create New Account
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'delegatebw'">
                                    <div>
                                        <span class="text-primary"
                                              @click="move(action.data.from)">{{action.data.from}}</span>
                                        ->
                                        <span class="text-primary" @click="move(action.data.receiver)">{{action.data.receiver}}</span>
                                    </div>
                                    <div class="eos">
                                        CPU: {{action.data.stake_cpu_quantity | comma}} / NET:
                                        {{action.data.stake_net_quantity | comma}}
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'undelegatebw'">
                                    <div>
                                        <span class="text-primary"
                                              @click="move(action.data.from)">{{action.data.from}}</span>
                                        ->
                                        <span class="text-primary" @click="move(action.data.receiver)">{{action.data.receiver}}</span>
                                    </div>
                                    <div class="eos">
                                        CPU: {{action.data.unstake_cpu_quantity | comma}} / NET:
                                        {{action.data.unstake_net_quantity | comma}}
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'buyrambytes'">
                                    <div>
                                        <span class="text-primary" @click="move(action.data.payer)">{{action.data.payer}}</span>
                                        ->
                                        <span class="text-primary" @click="move(action.data.receiver)">{{action.data.receiver}}</span>
                                    </div>
                                    <div class="eos">
                                        RAM: {{action.data.bytes | byte | comma}}
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'buyram'">
                                    <div>
                                        <span class="text-primary" @click="move(action.data.payer)">{{action.data.payer}}</span>
                                        ->
                                        <span class="text-primary" @click="move(action.data.receiver)">{{action.data.receiver}}</span>
                                    </div>
                                    <div class="eos">
                                        {{action.data.quant | comma}}
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'refund'">
                                    <div>
                                        <span class="text-primary" @click="move(action.data.owner)">{{action.data.owner}}</span>
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'voteproducer'">
                                    <div>
                                        <span class="text-primary"
                                              v-for="(producer, index) of action.data.producers"
                                              :key="index">
                                            {{producer}}
                                        </span>
                                    </div>
                                </div>
                                <div v-else-if="action.name === 'regproducer'">
                                    <div>
                                        <div class="text-primary">{{action.data.producer}}</div>
                                        <div><a class="text-success" :href="action.data.url">{{action.data.url}}</a>
                                        </div>
                                        <div class="text-black-50">(location: {{action.data.location}})
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <div>
                                        {{action.data}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 text-center border-top pt-3">
                            <!--No associated actions found.-->
                            Under Construction
                        </div>
                    </div>
                </div>
                <div class="contract row mt-3 mb-3" v-else>
                    <div v-if="!contract" class="col-12 text-center pt-3">
                        No associated smart contract found.
                    </div>
                    <div class="col-12" v-else>
                        <div>
                            <button class="btn btn-sm btn-outline-secondary mr-2"
                                    :class="{active: contractActive === 'structs'}"
                                    @click="contractActived('structs')">
                                Structs
                            </button>
                            <button class="btn btn-sm btn-outline-secondary mr-2"
                                    :class="{active: contractActive === 'actions'}"
                                    @click="contractActived('actions')">
                                Actions
                            </button>
                            <button class="btn btn-sm btn-outline-secondary mr-2"
                                    :class="{active: contractActive === 'tables'}"
                                    @click="contractActived('tables')">
                                Tables
                            </button>
                            <button class="btn btn-sm btn-outline-secondary"
                                    v-if="contract.ricardian_clauses.length > 0"
                                    :class="{active: contractActive === 'ricardian'}"
                                    @click="contractActived('ricardian')">
                                Ricardian
                            </button>
                        </div>
                        <div class="mt-2" v-if="contractActive === 'structs'">
                            <div class="col-12 row m-0 header pt-2 pb-2">
                                <div class="col-3">NAME</div>
                                <div class="col-9">FIELD</div>
                            </div>
                            <div v-for="(struct, index) of contract.structs" :key="index"
                                 class="col-12 row body m-0 pt-3 justify-content-center align-items-center border-top">
                                <div class="col-sm-3 id  pb-3">
                                    <div class="text-black-50 label">NAME:</div>
                                    {{struct.name}}
                                </div>
                                <div class="col-sm-9 row pb-3">
                                    <div class="text-black-50 label">FIELD:</div>
                                    <div class="col-sm-3 mt-1 mb-1 mr-1 p-2 border rounded"
                                         v-for="(field, index) of struct.fields"
                                         :key="index">
                                        <div>name: <span class="type">{{field.name}}</span></div>
                                        <div>type: <span class="type">{{field.type}}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-if="contractActive === 'actions'">
                            <div class="col-12 row m-0 header pt-2 pb-2">
                                <div class="col-2">NAME</div>
                                <div class="col-2">TYPE</div>
                                <div class="col-8">RICARDIAN</div>
                            </div>
                            <div v-for="(action, index) of contract.actions" :key="index"
                                 class="col-12 row body m-0 pt-3 justify-content-center align-items-center border-top">
                                <div class="col-sm-2 pb-3">
                                    <div class="text-black-50 label">NAME:</div>
                                    {{action.name}}
                                </div>
                                <div class="col-sm-2 pb-3">
                                    <div class="text-black-50 label">TYPE:</div>
                                    {{action.type}}
                                </div>
                                <div class="col-sm-8 pb-3">
                                    <div class="text-black-50 label">RICARDIAN:</div>
                                    {{action.ricardian_contract}}
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-if="contractActive === 'tables'">
                            <div class="col-12 row m-0 header pt-2 pb-2">
                                <div class="col-2">NAME</div>
                                <div class="col-2">INDEX TYPE</div>
                                <div class="col-3">KEY NAMES</div>
                                <div class="col-3">KEY TYPE</div>
                                <div class="col-2">TYPE</div>
                            </div>
                            <div v-for="(table, index) of contract.tables" :key="index"
                                 @click="openTable(table)"
                                 class="col-12 row body m-0 pt-3 justify-content-center align-items-center border-top pointer">
                                <div class="col-sm-2 pb-3">
                                    <div class="text-black-50 label">NAME:</div>
                                    {{table.name}}
                                </div>
                                <div class="col-sm-2 pb-3">
                                    <div class="text-black-50 label">INDEX TYPE:</div>
                                    {{table.index_type}}
                                </div>
                                <div class="col-sm-3 pb-3">
                                    <div class="text-black-50 label">KEY NAMES:</div>
                                    <div class="mb-3" v-for="(keyName, index) of table.key_names"
                                         :key="index">
                                        <span>{{keyName}}</span>
                                    </div>
                                </div>
                                <div class="col-sm-3 pb-3">
                                    <div class="text-black-50 label">KEY TYPE:</div>
                                    <div class="mb-3" v-for="(keyType, index) of table.key_types"
                                         :key="index">
                                        <span>{{keyType}}</span>
                                    </div>
                                </div>
                                <div class="col-sm-2 pb-3">
                                    <div class="text-black-50 label">TYPE:</div>
                                    {{table.type}}
                                </div>
                            </div>
                        </div>
                        <div class="mt-2" v-if="contractActive === 'ricardian'">
                            <div class="col-12 row m-0 header pt-2 pb-2">
                                <div class="col-3">ID</div>
                                <div class="col-9">BODY</div>
                            </div>
                            <div v-for="(ricardian, index) of contract.ricardian_clauses" :key="index"
                                 class="col-12 row body m-0 pt-3 justify-content-center align-items-center border-top">
                                <div class="col-sm-3 pb-3">
                                    <div class="text-black-50 label">ID:</div>
                                    {{ricardian.id}}
                                </div>
                                <div class="col-sm-9 pb-3">
                                    <div class="text-black-50 label">BODY:</div>
                                    {{ricardian.body}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section v-else class="p-5 text-center">
            No Account Found :(
        </section>
        <modal name="openModal" height="auto" :scrollable="true"
               @before-open="isOpendModal"
               @before-close="closeTable">
            <div class="p-3">
                <h4 class="text-center">{{selectedTable.name}}</h4>
                <div>Only up to 1000 table data can be shown.</div>
                <div class="p-1 table">
                    <tree-view :data="tableData" :options="{maxDepth: 1}"></tree-view>
                </div>
                <div class="text-center">
                    <button class="btn btn-danger"
                            :class="{active: contractActive === 'structs'}"
                            @click="closeTable">
                        Close
                    </button>
                </div>
            </div>
        </modal>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import circleProgress from '../../components/circle-progress/circle-progress.component.vue';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'arrayCustomTokens',
                'accountInfo',
                'balance',
                'resource',
                'actionTypes',
                'contract',
                'actions',
                'totalPageGroup',
            ]),
        },
        components: {
            circleProgress,
        },
    })
    export default class Main extends Vue {
        isShow: boolean = false;
        interval: any = '';
        actionType: string = '';
        filter: any = {
            page: 1,
        };
        active: 'actions' | 'contract' = 'actions';
        contractActive: string = 'structs';
        selectedTable: any = '';
        tableData: any = '';
        accountName: string = '';

        created() {
            this.init();
        }

        beforeDestroy() {
            clearInterval(this.interval);
        }

        actived(type: 'actions' | 'contract') {
            this.active = type;
        }

        contractActived(type: 'actions' | 'contract') {
            this.contractActive = type;
        }

        async openTable(table: any) {
            this.$store.dispatch('loading', true);
            this.selectedTable = table;
            const params: any = this.$route.params;
            this.tableData = await this.$store.dispatch('getTable', {account: params.account, table: table.name});
            this.$modal.show('openModal');
        }

        isOpendModal() {
            setTimeout(() => this.$store.dispatch('unLoading'));
        }

        closeTable() {
            this.tableData = '';
            this.$modal.hide('openModal');
        }

        async init() {
            this.isShow = false;
            const params: any = this.$route.params;
            const accountName = params.account;
            this.accountName = accountName;
            try {
                await this.$store.dispatch('accountInit', accountName);
            } finally {
                this.isShow = true;
            }

            this.interval = setInterval(() => {
                this.$store.dispatch('getAccountInfo', accountName);
            }, 100000);
        }

        move(account: string) {
            this.$router.push(`/account/${account}`);
        }

        @Watch('$route')
        onRouteChanged(to: any, from: any) {
            if (to.params.account !== from.params.account) {
                clearInterval(this.interval);
                this.actionType = '';
                this.active = 'actions';
                this.contractActive = 'structs';
                this.init();
            }
        }
    }
</script>
<style scoped lang="scss">
    div {
        word-break: break-all;
    }

    .detail-info {
        padding: 15px 0;

        h5 {
            margin-bottom: 20px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
        }

        .sub-title {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.5);
        }

        > div {
            margin-bottom: 10px;
        }

        &.resource {
            .title {
                font-size: 16px;
            }
        }
    }

    .custom-tokens {
        .custom-token {
            border: 1px solid #ddd;
            border-radius: 10px;

            .title {
                font-size: 16px;
                font-weight: bold;
            }

            .sub-title {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.5);
            }
        }
    }

    .actions, .contract {
        .header {
            display: none;
            color: rgba(0, 0, 0, 0.7);
            font-weight: bold;
        }

        .custom-select {
            max-width: 300px;
        }

        .body {
            .eos, .type {
                font-weight: bold;
            }

            .text-black-50 {
                word-break: break-all;
            }

            .text-primary {
                cursor: pointer;
            }
        }

        .label {
            font-weight: normal;
            display: block;
        }

        .type-detail {
            font-size: 80%;
        }
    }

    .loader {
        margin: 5px auto 0;
        border: 3px solid #cccccc;
        border-top: 3px solid rgba(0, 0, 0, 0.9);
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
    }

    .table {
        border: 1px solid #ddd;
        border-radius: 5px;
    }

    .pointer {
        cursor: pointer;
    }

    .paging {
        font-size: 22px;
        color: rgba(0, 0, 0, .8);

        .icon {
            cursor: pointer;
            &:hover {
                color: #007bff;
            }

            &.disable {
                color: #ddd;
                cursor: inherit;
            }
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (min-width: 576px) {
        .actions, .contract {
            .header {
                display: flex;
            }

            .label {
                display: none;
            }
        }
    }
</style>
