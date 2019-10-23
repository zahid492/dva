<template>
    <el-menu :default-active="$route.path"
             class="el-menu-vertical account-list"
             router
             :collapse="isCollapse">
        <el-menu-item index="/recommend" class="item">
            <img src="../../assets/side-icon1.png" alt="" class="side-icon">
            <span slot="title" class="text">新闻列表</span>
        </el-menu-item>
        <el-menu-item index="/maintain-list" class="item">
            <img src="../../assets/side-icon2.png" alt="" class="side-icon">
            <span slot="title" class="text">任务列表</span>
        </el-menu-item>
        <el-menu-item index="/project" class="item" v-if="isSuper">
            <img src="../../assets/side-icon3.png" alt="" class="side-icon">
            <span slot="title" class="text">项目管理</span>
        </el-menu-item>
        <el-menu-item index="/distributor-manage" class="item" v-if="isSuper">
            <img src="../../assets/side-icon4.png" alt="" class="side-icon">
            <span slot="title" class="text">供应商管理</span>
        </el-menu-item>
        <el-menu-item index="/account-list" class="item" v-if="isSuper">
            <img src="../../assets/side-icon5.png" alt="" class="side-icon">
            <span slot="title" class="text">用户管理</span>
        </el-menu-item>

        <!--<el-menu-item index="/sub/client" class="item">-->
            <!--<img src="../../assets/side-icon6.png" alt="" class="side-icon">-->
            <!--<span slot="title" class="text">客户端（临时）</span>-->
        <!--</el-menu-item>-->
        <!--<el-menu-item index="/sub/distributor" class="item">-->
            <!--<img src="../../assets/side-icon6.png" alt="" class="side-icon">-->
            <!--<span slot="title" class="text">供应商端（临时）</span>-->
        <!--</el-menu-item>-->
    </el-menu>
</template>

<script>
    import Vue from "vue";
    import {mapGetters} from "vuex";
    import store from '@/store/index';

    import {
        Menu,
        Submenu,
        MenuItem
    } from "element-ui";

    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    export default {
        name: "SideMenu",
        data() {
            return {
                isCollapse: false,
            }
        },
        computed: {
            ...mapGetters(["isSuper"]),
        },
        methods: {

        }
    }
</script>
<style>
    .el-col-8 {
        padding-right: 30px;
    }
    .iconfont {
        margin-right: 5px;
    }
     .el-menu-item.is-active {
    color: #409EFF !important;
    background-color: #ecf5ff !important;
    }
    .is-active .text{
    color: #409EFF !important;
    }
</style>

<style lang="scss" scoped>
    .el-menu {
        border-right: solid 1px #e5e7f3 !important;
    }
    .el-menu-item {
        padding: 0 !important;
    }
    .account-list {
        height: 98vh;
        width: 160px;
        position: fixed;
        top: 77px;
        left: 0;
        z-index: 99;
        .item {
            height: 100px;
            width: 100%;
            border-top: 1px solid transparent;
            .text {
                display: block;
                color: #69778F;
                font-size: 12px;
                height: 13px;
                line-height: 13px;
            }
            .is-active {
                color: #409EFF !important;
                background-color: #ecf5ff !important;
            }
        }
        .active {
            background:rgba(241,246,253,1);
        }
        .side-icon {
            display: block;
            margin: 28px auto 10px;
        }
    }
</style>