<template>
    <div class="home">
        <!--<Head></Head>-->
        <el-row>
            <el-col :span="2">
                <el-menu :default-active="$route.path"
                         class="el-menu-vertical"
                         router
                         :collapse="isCollapse">
                    <el-submenu index="/">
                        <template slot="title">任务管理</template>
                        <el-menu-item index="/missionlist" style="padding-left:50px;">任务列表</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/accountlist" v-if="isSuper">
                        <span slot="title">账号管理</span>
                    </el-menu-item>

                </el-menu>
            </el-col>

            <el-col :span="22" style="padding-top:10px;">
                <router-view/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    // @ is an alias to /src
    import Vue from "vue";
    import {mapGetters} from 'vuex';

    import {
        Row,
        Col,
        Menu,
        Submenu,
        MenuItem
    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);

    // import Head from '@/views/common/Head';
    import "@/assets/css/styles.css";

    export default {
        name: 'home',
        data() {
            return {
                isCollapse: false,
            }
        },
        computed: {
            ...mapGetters(["oidcUser"])
        },

        methods: {
            isSuper() {
                if (this.oidcUser.role === "管理员" || this.oidcUser.role.includes("管理员")) {
                    return true;
                }
                return false;
            },
            handleOpen(index, indexPath) {
                // this.$route.push(index);
            },
            handleClose(index, indexPath) {
            }
        }
    }
</script>
<style>
    .el-menu-vertical {
        width:100%;
        min-height: 400px;
    }
    .el-submenu .el-menu-item {
        min-width: 100px;
    }

    .tab {
        height: 100px;
        line-height: 100px;
    }

    .tab_list {
        width: 100%;
        text-align: left;
    }

    .tab_list .item {
        font-size: 24px;
        font-weight: bold;
        float: left;
        margin-right: 30px;
        cursor: pointer;
    }

    .tab_list .item:hover {
        color: rgb(22, 132, 216);
    }

    .active {
        color: rgb(22, 132, 216);
    }

</style>

