<template>
    <div v-if="isShow">
        <section class="row info">
            <h5 class="col-12 text-center">
                Block
            </h5>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{info.last_irreversible_block_num | comma}}
                </div>
                <div class="title font-weight-bold">
                    Irreversible Blocks
                </div>
            </div>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{info.head_block_num | comma}}
                </div>
                <div class="title font-weight-bold">
                    Head Blocks
                </div>
            </div>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{info.head_block_producer}}
                </div>
                <div class="title font-weight-bold">
                    Head Block Producer
                </div>
            </div>
            <h5 class="col-12 text-center mt-4 border-top pt-4">
                Market
            </h5>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{Number(eos.supply.toFixed(0)) | comma}} EOS
                </div>
                <div class="title font-weight-bold">
                    Total Supply
                </div>
            </div>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    $ {{market.marketCap | comma}}
                </div>
                <div class="title font-weight-bold">
                    Market Cap
                </div>
            </div>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    $ {{market.price | comma}}
                </div>
                <div class="title font-weight-bold">
                    Price(USD)
                </div>
            </div>
            <h5 class="col-12 text-center mt-4 border-top pt-4">
                RAM Exchange
            </h5>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{ram.eos | comma}} EOS
                </div>
                <div class="title font-weight-bold">
                    EOS
                </div>
            </div>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{ram.ram | byte | comma}}
                </div>
                <div class="title font-weight-bold">
                    RAM
                </div>
            </div>
            <div class="col-sm-4 text-center mt-2">
                <div class="value font-weight-bold">
                    {{ram.kbEOS | comma}} EOS
                </div>
                <div class="title font-weight-bold">
                    EOS(for 1KB RAM)
                </div>
            </div>
        </section>
        <section class="progress-box row mt-4 border-top pt-5 pb-5">
            <div class="col-6 text-center">
                <circle-progress class="mx-auto" :rate="stakeRate" :title="stakeRate + '%'"
                                 :diameter="130"></circle-progress>
                <div class="title">Voting</div>
            </div>
            <div class="col-6 text-center">
                <circle-progress class="mx-auto" :rate="ram.reservedRamRate" :title="ram.reservedRamRate + '%'"
                                 :diameter="130"></circle-progress>
                <div class="title">Reserved RAM</div>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import circleProgress from '../../components/circle-progress/circle-progress.component.vue';
import { mapGetters } from 'vuex';

@Component({
    computed: {
        ...mapGetters([
            'info',
            'global',
            'market',
            'eos',
            'ram',
            'stakeRate',
        ]),
    },
    components: {
        circleProgress,
    },
})
export default class Main extends Vue {
    isShow: boolean = false;
    interval15: any = '';
    interval2: any = '';

    created() {
        this.init();
    }

    async init() {
        await this.$store.dispatch('mainInit');
        this.isShow = true;
        // 15초마다 실행
        this.interval15 = setInterval(() => {
            this.$store.dispatch('getEosInfo');
            this.$store.dispatch('getMarket');
        }, 15000);
        // 2초마다 실행
        this.interval2 = setInterval(() => {
            this.$store.dispatch('getInfo');
            this.$store.dispatch('getGlobal');
            this.$store.dispatch('getRAM');
        }, 2000);
    }

    beforeDestroy() {
        clearInterval(this.interval15);
        clearInterval(this.interval2);
    }
}
</script>

<style scoped lang="scss">
    h5 {
        color: rgba(0, 0, 0, .6);
    }

    .info {
        .value {
            color: rgba(0, 0, 0, .7);
            font-size: 1.4em;
        }
        .title {
            color: rgba(0, 0, 0, .3);
            font-size: 1.1em;
        }
    }

    .progress-box {
        .title {
            margin-top: 5px;
        }
    }
</style>
