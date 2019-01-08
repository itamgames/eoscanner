<template>
    <div class="loading" v-if="loading">
        <div class="overlay" :class="{'opacity-6': opacity}"></div>
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { mapGetters } from 'vuex';

    @Component({
        computed: {
            ...mapGetters([
                'loading',
                'opacity',
            ]),
        },
    })
    export default class Loading extends Vue {
    }
</script>

<style scoped lang="scss">
    .loading {
        position: fixed;
        height: 100%;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;

        .overlay {
            z-index: 999;
            position: fixed;
            height: 100%;
            width: 100%;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 1;
            visibility: visible;
            background-color: #fff;

            &.opacity-6 {
                opacity: 0.6;
            }
        }

        .lds-ring {
            display: inline-block;
            width: 100.55px;
            height: 100.55px;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            position: absolute;
            z-index: 1000;
        }
        .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 100px;
            height: 100px;
            margin: 6px;
            border: 10px solid #696969;
            border-radius: 50%;
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #696969 transparent transparent transparent;
        }
        .lds-ring div:nth-child(1) {
            animation-delay: -0.45s;
        }
        .lds-ring div:nth-child(2) {
            animation-delay: -0.3s;
        }
        .lds-ring div:nth-child(3) {
            animation-delay: -0.15s;
        }
        @keyframes lds-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .spinner {
            z-index: 1000;
            margin: auto;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            position: absolute;
            width: 50px;
            height: 40px;
            text-align: center;
            font-size: 10px;
        }

        .spinner > div {
            background-color: #4d4d4d;
            height: 100%;
            width: 4px;
            margin-left: 4px;
            display: inline-block;
            animation: sk-stretchdelay 1.2s infinite ease-in-out;
        }

        .spinner .rect2 {
            -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s;
        }

        .spinner .rect3 {
            -webkit-animation-delay: -1.0s;
            animation-delay: -1.0s;
        }

        .spinner .rect4 {
            -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s;
        }

        .spinner .rect5 {
            -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s;
        }

        @-webkit-keyframes sk-stretchdelay {
            0%, 40%, 100% {
                -webkit-transform: scaleY(0.4)
            }
            20% {
                -webkit-transform: scaleY(1.0)
            }
        }

        @keyframes sk-stretchdelay {
            0%, 40%, 100% {
                transform: scaleY(0.4);
                -webkit-transform: scaleY(0.4);
            }
            20% {
                transform: scaleY(1.0);
                -webkit-transform: scaleY(1.0);
            }
        }
    }
</style>
