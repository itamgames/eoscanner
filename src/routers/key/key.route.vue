<template>
    <div v-if="isShow">
        <section v-if="!isNotFound" class="row info">
            <div class="col-12 row mt-3">
                <h5 class="col-12 route-title">
                    <small>Key</small><br>
                    {{key}}
                </h5>
                <div class="col-6 col-sm-3 mt-2 mb-2" v-for="account of accounts" :key="account">
                    <div class="account border rounded col-12  p-3" @click="move(account)">
                        <div class="label">Account:</div>
                        <div>{{account}}</div>
                    </div>
                </div>
            </div>
        </section>
        <section v-else class="p-5 text-center">
            No Key Found :(
        </section>
    </div>
</template>
<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';

    @Component
    export default class Main extends Vue {
        isShow: boolean = false;
        isNotFound: boolean = false;
        accounts: string[] = [];
        key: string = '';

        created() {
            this.init();
        }

        async init() {
            this.accounts = [];
            try {
                const params: any = this.$route.params;
                this.key = params.key;
                await this.$store.dispatch('getAccounts', params.key);
                this.accounts = this.$store.getters.accounts;
            } catch (e) {
                this.isNotFound = true;
            } finally {
                this.isShow = true;
                if (this.$store.getters.accounts.length === 0) {
                    this.isNotFound = true;
                }
            }
        }

        move(account: string) {
            this.$router.push(`/account/${account}`);
        }

        @Watch('$route')
        onRouteChanged(to: any, from: any) {
            if (to.params.key !== from.params.key) {
                this.init();
            }
        }
    }
</script>
<style scoped lang="scss">

    .label {
        color: rgba(0, 0, 0, 0.5);
        font-weight: normal;
    }

    .account {
        font-weight: bold;
        cursor: pointer;
    }
</style>