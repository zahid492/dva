<template>

    <el-row class="top-bar">
        <el-col :span="20" style="height: 50px;">
            <div class="title">
                <img src="../../assets/logo.png"
                     v-if="hasRole()"
                     alt="" class="logo">
                <p class="logo-title">评论维护平台<span style="font-size:24px">{{subTitle}}</span></p>
            </div>
        </el-col>
        <el-col :span="4">
            <div class="title">
                <el-dropdown
                        @command="handleCommand"
                >
                    <span class="el-dropdown-link user-msg grid-content"
                          style="white-space: nowrap;">
                           {{oidcUser && oidcUser.name}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-button type="text"
                                       @click="updatePass">修改密码
                            </el-button>
                        </el-dropdown-item>
                        <el-dropdown-item command="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-col>
    </el-row>

</template>
<script>

    import Vue from "vue";
    import store from '@/store/index';
    import {mapGetters, mapActions} from "vuex";

    import {
        Row,
        Col,
        Dialog,
        Dropdown,
        DropdownMenu,
        DropdownItem,
        Button,
        Form,
        FormItem
    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Dialog);
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(FormItem);

    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);

    export default {

        name: "Head",
        computed: {
            subTitle() {
                let prefix = "--"

                if (this.$route.name === "distributor") {
                    return prefix + "供应商端"
                }

                if (this.$route.name === "client") {
                    return prefix + "客户端"
                }

                return ""

            },
            ...mapGetters(["oidcUser"])
        },
        mounted() {
            // this.RefreshLogin();
        },
        methods: {
            hasRole() {
                if (this.oidcUser) {
                    return !(_.includes(this.oidcUser.role, `供应商执行员` || this.oidcUser.role !== `供应商执行员`));
                }
                return false;
            },
            handleCommand(cmd) {
                if (cmd === "loginOut") {
                    store.dispatch("signOutOidc");
                }
            },
            updatePass() {
                this.$router.push("/mpassword")
            },
        }
    };
</script>
<style scoped>

    .top-bar {
        padding: 10px 0;
        width: 100%;
        background: linear-gradient(10deg, rgba(0, 129, 255, 1) 0%, rgba(50, 101, 249, 1) 100%);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
    }

    .user-msg {
        display: block;
        white-space: nowrap;
        width: 100%;
        height: 53px;
        border-radius: 25px;
        color: #fff;
        text-align: center;
        line-height: 53px;
        overflow: hidden;
        cursor: pointer;
    }

    .logo {
        height: 45px;
        width: 66px;
        float: left;
        margin: 12px 0 0 28px;
    }

    .logo-title {
        font-size: 28px;
        font-weight: normal;
        color: rgba(255, 255, 255, 1);
        float: left;
        margin: 10px 0 0 22px;
    }
</style>
