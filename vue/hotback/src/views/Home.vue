<template>

    <!--        <el-header>-->
    <!--            <el-row class="top-bar">-->
    <!--                <el-col :span="20">-->
    <!--                    <h2 class="title">妙笔热搜管理系统</h2>-->
    <!--                </el-col>-->
    <!--                <el-col :span="4">-->

    <!--                    <el-dropdown-->
    <!--                            @command="handleCommand"-->
    <!--                    >-->
    <!--                            <span class="el-dropdown-link user-msg grid-content"-->
    <!--                                  style="white-space: nowrap;">-->
    <!--                                    {{oidcUser && oidcUser.name}}-->
    <!--                                <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
    <!--                            </span>-->
    <!--                        <el-dropdown-menu slot="dropdown">-->
    <!--                            <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>-->
    <!--                        </el-dropdown-menu>-->
    <!--                    </el-dropdown>-->

    <!--                </el-col>-->
    <!--            </el-row>-->
    <!--        </el-header>-->
    <el-container>
        <el-aside width="200px">
            <el-row>
                <el-col :span="24">
                    <h3 class="title">妙笔自媒体管理系统</h3>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="24">
                    <el-menu
                            :default-active="path"
                            :default-openeds=opens

                            unique-opened
                            router
                            background-color="#001529"
                            text-color="#fff"
                            active-text-color="#ffd04b">

                        <el-submenu index="/mymedia">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>自媒体账号管理</span>
                            </template>

                            <el-menu-item index="/mymedia-platforms">
                                <i class="el-icon-menu"></i>
                                <span slot="title">平台列表</span>
                            </el-menu-item>

                            <el-menu-item index="/mymedia-accounts">
                                <i class="el-icon-menu"></i>
                                <span slot="title">账号列表</span>
                            </el-menu-item>

                            <el-menu-item index="/mymedia-articles">
                                <i class="el-icon-menu"></i>
                                <span slot="title">文章列表</span>
                            </el-menu-item>

                        </el-submenu>

                        <el-submenu index="/relation">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>对应关系</span>
                            </template>

                            <el-menu-item index="/relation-article">
                                <i class="el-icon-menu"></i>
                                <span slot="title">文章分类</span>
                            </el-menu-item>

                            <el-menu-item index="/relation-publish">
                                <i class="el-icon-menu"></i>
                                <span slot="title">发布类型</span>
                            </el-menu-item>

                        </el-submenu>

                        <el-submenu index="/statistic">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>统计分析</span>
                            </template>

                            <el-menu-item index="/statistic-account">
                                <i class="el-icon-menu"></i>
                                <span slot="title">账号</span>
                            </el-menu-item>

                            <el-menu-item index="/statistic-platform">
                                <i class="el-icon-menu"></i>
                                <span slot="title">平台</span>
                            </el-menu-item>

                        </el-submenu>

                        <el-submenu index="/logs">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>日志</span>
                            </template>

<!--                            <el-menu-item index="/logs-monitor">-->
<!--                                <i class="el-icon-menu"></i>-->
<!--                                <span slot="title">监控报警</span>-->
<!--                            </el-menu-item>-->

                            <el-menu-item index="/logs-log">
                                <i class="el-icon-menu"></i>
                                <span slot="title">日志列表</span>
                            </el-menu-item>

                        </el-submenu>

                        <el-submenu index="/monitor">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>监控</span>
                            </template>

                            <el-menu-item index="/monitor-basic">
                                <i class="el-icon-menu"></i>
                                <span slot="title">基本信息</span>
                            </el-menu-item>

                        </el-submenu>

                        <el-submenu index="/hot">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>热文管理</span>
                            </template>

                            <el-menu-item index="/hot-newsource">
                                <i class="el-icon-menu"></i>
                                <span slot="title">新闻源</span>
                            </el-menu-item>

                            <el-menu-item index="/hot-tpl">
                                <i class="el-icon-menu"></i>
                                <span slot="title">模板</span>
                            </el-menu-item>

                            <el-menu-item index="/hot-frame">
                                <i class="el-icon-menu"></i>
                                <span slot="title">框架</span>
                            </el-menu-item>

                            <el-menu-item index="/hot-module">
                                <i class="el-icon-menu"></i>
                                <span slot="title">模块</span>
                            </el-menu-item>

                            <el-menu-item index="/hot-division">
                                <i class="el-icon-menu"></i>
                                <span slot="title">细分</span>
                            </el-menu-item>

                            <el-menu-item index="/hot-tpllang">
                                <i class="el-icon-menu"></i>
                                <span slot="title">模板语言</span>
                            </el-menu-item>


                        </el-submenu>

                    </el-menu>
                </el-col>
            </el-row>

        </el-aside>

        <el-main>
            <router-view/>
        </el-main>

    </el-container>

</template>

<script>
    // @ is an alias to /src
    import Vue from "vue";
    import {mapGetters} from "vuex";
    import store from "@/store/index";
    import {
        Container,
        Main,
        Aside,
        Header,
        Row,
        Col,
        Menu,
        Submenu,
        MenuItem,
        MenuItemGroup,
        Dropdown,
        DropdownMenu,
        DropdownItem,
    } from "element-ui";

    Vue.use(Container);
    Vue.use(Header);
    Vue.use(Main);
    Vue.use(Aside);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);

    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);

    export default {
        name: 'home',
        data: () => {
            return {
                path: "/mymedia/platforms",
                opens: ["/mymedia/platforms"]
            }
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },
        mounted(){
           this.path = this.$route.path;
        },
        methods: {

            handleCommand(cmd) {
                if (cmd === "loginOut") {
                    store.dispatch("signOutOidc");
                }

            },
        },

    }
</script>

<style>
    body {
        margin: 0;
    }

    .el-aside {
        display:block;
        height: 100vh;
        background-color: #001529
    }

    .el-main {
        height:100vh;
    }

    .title {
        color: #fff;
        text-align: center;
    }

    .el-menu {
        border-right: none;
    }

    .el-row {
        margin-bottom: 15px;
    }

    .el-table__row .el-button {
        margin:5px !important;
    }

    .el-textarea__inner{
        height:100%;
    }

</style>
