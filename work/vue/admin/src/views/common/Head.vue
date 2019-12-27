<template>
    <el-row class="topbar">
        <el-col :span="17" :offset="1">
            <h2 class="title">妙笔应用管理系统</h2>
        </el-col>
        <el-col :span="4">
            <el-dropdown
                    @command="handleCommand"
                    split-button
                    type="primary"
                    class="username">
                {{oidcUser && oidcUser.name}}
                <el-dropdown-menu slot="dropdown">
                    <!--<el-dropdown-item><router-link to="/mpassword">修改密码</router-link></el-dropdown-item>-->
                    <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>

            </el-dropdown>
        </el-col>

    </el-row>
</template>

<script>
    import Vue from 'vue';
    import store from "@/store/index";
    import {mapGetters} from 'vuex';
    import {
        Row,
        Col,
        Dropdown,
        DropdownMenu,
        DropdownItem,

    } from 'element-ui';

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    export default {
        name: 'Head',
        computed: {
            ...mapGetters(["oidcUser"])
        },
        methods: {
            handleCommand(cmd) {
                if(cmd==="loginOut"){
                    store.dispatch("signOutOidc");
                }

            }
        }

    }
</script>

<style lang="scss" scope>
    .topbar {
        height: 70px;
        width: 100vw;
        background: #409EFF;
        text-align: left;

        .title {
            height: 70px;
            line-height: 70px;
            color: #fff;
            margin: 0;
        }
    }

    .username {
        margin-top: 15px;
    }

    .el-button--primary:focus, .el-button--primary:hover {
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
    }

</style>
