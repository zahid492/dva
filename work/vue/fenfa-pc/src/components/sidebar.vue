<template>
    <div class="aside-box">
        <el-row class="sidebar">
            <el-col :span="24">
                <div class="logo-box">
                    <img src="../assets/logo.png" alt="" class="logo">
                    <div class="title">
                        任务系统
                    </div>
                    <div class="line"></div>
                </div>
            </el-col>
            <el-col :span="24">
                <el-menu
                        default-active="/home"
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        text-color="#fff"
                        router
                        active-text-color="#ffd04b">

                    <el-menu-item index="/home">
                        <i class="el-icon-menu"></i>
                        <span slot="title" :class="{menuactive:$route.path==='/home'}">我的任务</span>
                    </el-menu-item>
                    <el-menu-item index="/my">
                        <i class="el-icon-location"></i>
                        <span slot="title" :class="{menuactive:$route.path==='/my'}">我的战绩</span>
                    </el-menu-item>
                    <el-menu-item-group style="padding-left:30px;">
                        <el-menu-item
                                :index="`/wan/${pathId.sentence}`"
                                :class="{menuactive:($route.path===`/wan/${pathId.sentence}` || $route.path.includes('juzix'))}"
                                v-if="userinfo && userinfo.similarSentencePairCount>0">撰写句子对
                        </el-menu-item>

                        <el-menu-item
                                :index="`/wan/${pathId.rewrite}`"
                                :class="{menuactive:($route.path===`/wan/${pathId.rewrite}`|| $route.path.includes('gaixiex'))}"
                                v-if="userinfo && userinfo.rewriteTaskCount>0">改写句子对
                        </el-menu-item>

<!--                        <el-menu-item-->
<!--                                :index="`/wan/${pathId.synonym}`"-->
<!--                                :class="{menuactive:($route.path===`/wan/${pathId.synonym}` || $route.path.includes('tongyix'))}"-->
<!--                                v-if="userinfo && userinfo.synonymTaskCount>0">同义词-->
<!--                        </el-menu-item>-->

                        <el-menu-item
                                :index="`/wan/${pathId.scoring}`"
                                :class="{menuactive:($route.path===`/wan/${pathId.scoring}`|| $route.path.includes('pingjiax'))}"
                                v-if="userinfo && userinfo.scoringTaskCount>0">评价句子对
                        </el-menu-item>

                        <el-menu-item
                                :index="`/wan/${pathId.audit}`"
                                :class="{menuactive:($route.path===`/wan/${pathId.audit}`|| $route.path.includes('shenhex'))}"
                                v-if="userinfo && userinfo.similarSentencePairReviewTaskCount>0">审核句子对
                        </el-menu-item>
                    </el-menu-item-group>

                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapGetters} from "vuex";
    import {pathId} from "@/utils/type";

    import {
        Container,
        Aside,
        Main,
        Col,
        Row,
        Menu,
        Submenu,
        MenuItem,
        MenuItemGroup,
    } from 'element-ui';

    Vue.use(Container);
    Vue.use(Aside);
    Vue.use(Main);
    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    export default {
        name: "sidebar",
        data: function(){
            return {
                pathId: pathId
            }
        },
        computed: {
            ...mapGetters(["userinfo"]),
        },
    }
</script>

<style>

    .el-aside {
        width: 250px !important;
        height: 100vh;
        background: none;
        box-shadow: 0px 4px 30px 0px rgba(54, 107, 213, 0.1);
        position: relative;
    }

    .el-menu-item {
        background: none !important;
        color: #838590 !important;
        font-size: 20px;
    }

    .el-submenu__title {
        background: #FFFFFF !important;
        color: #838590 !important;
        font-size: 20px;
    }

    .el-menu {
        border: none;
        background: #FFFFFF !important;
        text-align: left;
        padding-left: 28px;
        padding-right: 38px;
    }

    .el-menu-item-group ul li {
        font-size: 16px;
        color: #4D4D4D;
    }

    .el-submenu__icon-arrow {
        font-size: 16px;
    }

    .menuactive {
        color: #ffd04b !important;
    }

</style>
<style lang="scss" scope>
    .sidebar {
        width: 250px;
        height: 100vh;
        background: #FFFFFF;
        position: fixed;
        top: 0;
        left: 0;
    }

    .logo-box {
        width: 100%;

        .logo {
            margin-top: 44px;
            width: 127px;
        }

        .title {
            margin-top: 15px;
            font-size: 18px;
            font-weight: normal;
            color: #808080;
        }

        .line {
            width: 180px;
            height: 1px;
            background: rgba(210, 210, 210, 1);
            margin: 24px 0 40px 35px;
        }
    }
</style>