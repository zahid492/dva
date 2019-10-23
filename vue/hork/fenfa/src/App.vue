<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    import {getInfo} from "@/utils/auth";
    import {mapMutations} from "vuex";
    import {
        getWxinfo,
    } from "@/utils/auth";

    export default {
        created() {
            getInfo();
            this.set_wxinfo(getWxinfo());
        },
        methods: {
            ...mapMutations(["set_wxinfo"])
        }
    }
</script>
<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

</style>
