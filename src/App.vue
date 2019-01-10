<template>
    <div id="app">
        <header-layout></header-layout>
        <main class="container">
            <router-view/>
            <loader></loader>
        </main>
        <footer>
            <div class="inside container p-0">
                <div class="logo">
                    <div class="powered-by">
                        Powered by
                    </div>
                    <div>
                        <a href="https://itam.games" target="_blank">
                            <img src="./assets/itam-logo.png"
                                 class="itam-logo">
                        </a>
                    </div>
                </div>
                <div class="sns">
                    <a href="https://t.me/itamgames" target="_blank">
                        <img src="./assets/telegram.png"
                             srcset="./assets/telegram@2x.png 2x, ./assets/telegram@3x.png 3x"
                             class="layer">
                    </a>
                    <a href="https://medium.com/itam" target="_blank">
                        <img src="./assets/medium.png"
                             srcset="./assets/medium@2x.png 2x, ./assets/medium@3x.png 3x"
                             class="layer">
                    </a>
                    <a href="https://www.facebook.com/itamgames" target="_blank">
                        <img src="./assets/facebook.png"
                             srcset="./assets/facebook@2x.png 2x, ./assets/facebook@3x.png 3x"
                             class="layer">
                    </a>
                </div>
                <div class="last">
                    © 2018 ITAM GAMES. All Rights Reserved.
                </div>
            </div>
        </footer>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import headerLayout from './layout/header.layout.vue';
    import loader from './components/loader/loader.component.vue';

    @Component({
        components: {
            headerLayout,
            loader,
        },
    })
    export default class App extends Vue {
    }
</script>

<style scoped lang="scss">
    footer {
        height: 199px;
        position: relative;
        display: block;
        background-color: #e6e6e6;
        padding: 45px 10px 25px;
        color: #4d4d4d;
        font-size: 12px;

        .inside {
            position: relative;
            .logo {
                .powered-by {
                    font-weight: normal;
                    font-style: normal;
                    font-stretch: normal;
                    line-height: normal;
                    letter-spacing: normal;
                    margin-bottom: 6px;
                }

                .itam-logo {
                    width: 169px;
                    height: 33px;
                    object-fit: contain;
                }
            }

            .last {
                margin-top: 51px;
            }

            .layer {
                width: 34px;
                height: 34px;
                object-fit: contain;
            }

            .sns {
                position: absolute;
                right: 0;
                top: 0px;

                a {
                    margin-right: 10px;

                    &:last-child {
                        margin-right: 0px;
                    }
                }
            }
        }
    }

    @media (min-width: 576px) {
        footer {
            padding: 45px 0px 25px;

            .sns {
                position: absolute;
                right: 0;
                top: 0px;

                a {
                    margin-right: 25px;
                }
            }
        }
    }
</style>
