<template>
    <div class="side">
        <el-row class="tac">
            <img src="@/assets/logo-mb.png" alt="" class="logo">
            <el-col :span="24">
                <el-menu :default-active="$route.path"
                         class="el-menu-vertical-demo"
                         router
                         @open="handleOpen"
                         @close="handleClose">

                    <el-menu-item index="/app" v-if="isSuper()||isDev()">
                        <span slot="title">我的应用</span>
                    </el-menu-item>

                    <el-menu-item index="/resource" v-if="isSuper()">
                        <span slot="title">api资源管理</span>
                    </el-menu-item>
                    <el-menu-item index="/client" v-if="isSuper()">
                        <span slot="title">客户端管理</span>
                    </el-menu-item>

                    <el-menu-item index="/account" v-if="isPersonnel()">
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="/mpassword">
                        <span slot="title">修改密码</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapGetters} from 'vuex';
    import {
        Row,
        Col,
        Menu,
        Submenu,
        MenuItem,
        MenuItemGroup,

    } from 'element-ui';

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    export default {
        name: 'side',
        components: {},
        computed: {
            ...mapGetters(["oidcUser"])
        },
        methods: {
            isPersonnel() {
                if (this.oidcUser && (this.oidcUser.role === "人力资源"
                    || this.oidcUser.role.includes("人力资源")
                    || this.oidcUser.role.includes("管理员"))
                ) {
                    return true;
                }
                return false;
            },
            isDev() {
                if (this.oidcUser && (this.oidcUser.role === "研发工程师"
                    || this.oidcUser.role.includes("研发工程师")
                    || this.oidcUser.role.includes("管理员"))
                ) {
                    return true;
                }
                return false;
            },
            isSuper() {
                if (this.oidcUser && (this.oidcUser.role === "管理员"
                    || this.oidcUser.role.includes("管理员"))
                ) {
                    return true;
                }
                return false;
            },

            // isVisitor() {
            //     if (this.oidcUser.role === "游客" || this.oidcUser.role.includes("游客")) {
            //         return true;
            //     }
            //     return false;
            // },
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style>
    .tac {
        background: #fff;
        height: 100%;
    }

    .logo {
        width: 128px;
        margin: 20px 0;
    }

    .el-menu {
        border: none;
    }
    .side {
        height: 100% !important;
        position:static !important;
    }
</style>