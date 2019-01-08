<template>
    <header class="p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <div class="container p-0 d-flex flex-column flex-md-row align-items-center ">
            <router-link class="my-0 mr-md-auto font-weight-normal" to="/">
                <img src="../assets/logo-text.png" srcset="../assets/logo-text@2x.png 2x, ../assets/logo-text@3x.png 3x" class="logo-text">
            </router-link>
            <div class="search col-md-6">
                <form @submit.prevent="anySearch">
                    <input v-model="search" placeholder="account / public key / tx"/>
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Header extends Vue {
        search: string = '';

        anySearch() {
            const search = this.search;
            if (search) {
                if (search.length === 53 && search.indexOf('EOS') === 0) {
                    // key
                    this.$router.push(`/key/${search}`);
                } else if (search.length === 64) {
                    // tx
                    this.$router.push(`/transaction/${search}`);
                } else {
                    // account
                    this.$router.push(`/account/${search}`);
                }

                this.search = '';
            }
        }
    }
</script>

<style scoped lang="scss">
    header {
        z-index: 9999;
        position: relative;
        background-color: #f8f9fa !important;

        .logo {
            width: 150px;
        }

        .logo-text {
            width: 126px;
            height: 17px;
        }

        .search {
            position: relative;
            border-radius: 5px;
            border: 1px solid #ced4da;
            text-align: left;
            background-color: #fff;
            padding: 0 5px;
            margin-top: 10px;

            input {
                width: calc(100% - 35px);
                padding: 10px;
                height: 40px;
                border: 0px;
            }
            button {
                text-align: center;
                background-color: transparent;
                border: 0px;
                height: 40px;
                font-size: 1.2em;
            }
        }
    }

    @media (min-width: 576px) {
        .search {
            margin-top: 0px;
        }
    }
</style>
