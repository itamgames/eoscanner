<template>
    <radial-progress-bar :diameter="diameter"
                         :completed-steps="rate > 100 ? 100 : rate"
                         :total-steps="100"
                         :strokeWidth="8"
                         innerStrokeColor="#cccccc"
                         startColor="#1766eb"
                         stopColor="#1766eb">
        <div class="progress-rate">
            {{ title }}
        </div>
    </radial-progress-bar>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import radialProgressBar from './radial-progress-bar.component.vue';

@Component({
    components: {
        radialProgressBar,
    },
})
export default class CircleProgress extends Vue {
    @Prop() title!: string;
    @Prop() rate!: number;
    @Prop({default: 100}) diameter!: number;
}
</script>

<style scoped lang="scss">
    .progress-rate {
        font-size: 1em;
        color: #1766eb;
    }
</style>
