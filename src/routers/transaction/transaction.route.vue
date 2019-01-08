<template>
    <div v-if="isShow">
        <section v-if="!isNotFound" class="row">
            <div class="row mt-3">
                <h5 class="col-12 route-title">
                    <small>Transaction</small>
                    <br>
                    {{info.id}}
                </h5>
                <div class="col-12 row mt-3 mb-3">
                    <div class="col-sm-6 info-box">
                        <div class="label">Block</div>
                        <div class="value">{{info.block_num | comma}}</div>
                    </div>
                    <div class="col-sm-6 info-box">
                        <div class="label">Block Time</div>
                        <div class="value">{{info.block_time | timezone}}</div>
                    </div>
                    <div class="col-sm-6 info-box">
                        <div class="label">Status</div>
                        <div class="value">{{info.trx.receipt.status}}</div>
                    </div>
                    <div class="col-sm-6 info-box">
                        <div class="label">Expiration Time</div>
                        <div class="value" v-if="info.trx.trx.expiration">{{info.trx.trx.expiration | timezone}}</div>
                        <div class="value" v-else>-</div>
                    </div>
                    <div class="col-sm-6 info-box">
                        <div class="label">CPU</div>
                        <div class="value">{{info.trx.receipt.cpu_usage_us | comma}}</div>
                    </div>
                    <div class="col-sm-6 info-box">
                        <div class="label">NET</div>
                        <div class="value">{{info.trx.receipt.net_usage_words | comma}}</div>
                    </div>
                </div>
                <div class="actions col-12 row mt-5 mb-3">
                    <h5 class="col-12">
                        <small>Actions</small>
                    </h5>
                    <div class="col-12 row header pt-2 pb-2">
                        <div class="col-2">ID</div>
                        <div class="col-2">TYPE</div>
                        <div class="col-8">INFO</div>
                    </div>
                    <div v-for="(action, index) of actions" :key="index"
                         class="col-12 row body pt-3 justify-content-center align-items-center border-top">
                        <div class="col-sm-2 id  pb-3">
                            <div class="text-black-50 label">ID:</div>
                            {{action.receipt.global_sequence}}
                        </div>
                        <div class="col-sm-2 type pb-3">
                            <div class="text-black-50 label">TYPE:</div>
                            {{action.act.name}}
                        </div>
                        <div class="col-sm-8 pb-3">
                            <div class="text-black-50 label">INFO:</div>
                            <div v-if="action.act.name === 'transfer'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.from)">{{action.act.data.from}}</span>
                                    ->
                                    <span class="text-primary"
                                          @click="move(action.act.data.to)">{{action.act.data.to}}</span>
                                </div>
                                <div class="eos"> {{action.act.data.quantity | comma}}</div>
                                <div class="text-black-50">
                                    (Memo: {{action.act.data.memo}})
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'newaccount'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.creator)">{{action.act.data.creator}}</span>
                                    ->
                                    <span class="text-primary" @click="move(action.act.data.name)">{{action.act.data.name}}</span>
                                </div>
                                <div class="eos">
                                    Create New Account
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'delegatebw'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.from)">{{action.act.data.from}}</span>
                                    ->
                                    <span class="text-primary" @click="move(action.act.data.receiver)">{{action.act.data.receiver}}</span>
                                </div>
                                <div class="eos">
                                    CPU: {{action.act.data.stake_cpu_quantity | comma}} / NET:
                                    {{action.act.data.stake_net_quantity | comma}}
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'undelegatebw'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.from)">{{action.act.data.from}}</span>
                                    ->
                                    <span class="text-primary" @click="move(action.act.data.receiver)">{{action.act.data.receiver}}</span>
                                </div>
                                <div class="eos">
                                    CPU: {{action.act.data.unstake_cpu_quantity | comma}} / NET:
                                    {{action.act.data.unstake_net_quantity | comma}}
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'buyrambytes'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.payer)">{{action.act.data.payer}}</span>
                                    ->
                                    <span class="text-primary" @click="move(action.act.data.receiver)">{{action.act.data.receiver}}</span>
                                </div>
                                <div class="eos">
                                    RAM: {{action.act.data.bytes | byte | comma}}
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'buyram'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.payer)">{{action.act.data.payer}}</span>
                                    ->
                                    <span class="text-primary" @click="move(action.act.data.receiver)">{{action.act.data.receiver}}</span>
                                </div>
                                <div class="eos">
                                    {{action.act.data.quant | comma}}
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'refund'">
                                <div>
                                    <span class="text-primary" @click="move(action.act.data.owner)">{{action.act.data.owner}}</span>
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'voteproducer'">
                                <div>
                                    <span class="text-primary"
                                          v-for="(producer, index) of action.act.data.producers"
                                          :key="index">
                                        <span v-if="index > 0">,</span>
                                        {{producer}}
                                    </span>
                                </div>
                            </div>
                            <div v-else-if="action.act.name === 'regproducer'">
                                <div>
                                    <div class="text-primary">{{action.act.data.producer}}</div>
                                    <div><a class="text-success" :href="action.act.data.url">{{action.act.data.url}}</a>
                                    </div>
                                    <div class="text-black-50">(location: {{action.act.data.location}})
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div>
                                    {{action.act.data}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section v-else class="p-5 text-center">
            No Transaction Found :(
        </section>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class Main extends Vue {
        isShow: boolean = false;
        isNotFound: boolean = false;
        info: any = {};
        actions: any[] = [];

        created() {
            this.init();
        }

        async init() {
            this.actions = [];
            this.isNotFound = false;
            this.isShow = false;
            try {
                const params: any = this.$route.params;
                await this.$store.dispatch('getTransaction', params.id);
                this.info = this.$store.getters.transaction;
                this.actions = this.$store.getters.transactionActions;
            } catch (e) {
                this.isNotFound = true;
            } finally {
                this.isShow = true;
            }
        }

        move(account: string) {
            this.$router.push(`/account/${account}`);
        }

        @Watch('$route')
        onRouteChanged(to: any, from: any) {
            if (to.params.id !== from.params.id) {
                this.init();
            }
        }
    }
</script>
<style scoped lang="scss">
    .info-box {
        margin-top: 5px;
        margin-bottom: 5px;
        .label {
            color: rgba(0, 0, 0, 0.5);
            font-size: 1em;
        }

        .value {
            font-size: 1em;
            font-weight: 600;
        }
    }

    .actions {
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
    }

    @media (min-width: 576px) {
        .actions {
            .header {
                display: flex;
            }

            .label {
                display: none;
            }
        }
    }
</style>