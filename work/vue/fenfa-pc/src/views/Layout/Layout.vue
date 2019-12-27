<template>
    <div class="Layout">
        <el-container>
            <el-aside width="200px">
                <sidebar></sidebar>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Vue from "vue";
    import {Container, Aside, Main} from "element-ui";
    import sidebar from "@/components/sidebar.vue";

    Vue.use(Container);
    Vue.use(Aside);
    Vue.use(Main);

    export default {
        components: {
            sidebar
        },
    };
</script>
<style>
    .el-main {
        background: #f2f3f8 !important;
    }
</style>
