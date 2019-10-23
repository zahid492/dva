<template>
    <div class="start">
            <!-- <van-nav-bar
            title="秒笔改写"
            left-text=""
            left-arrow
            @click-left="toExit"
            /> -->
        <div class="startBg">
            <img src="../assets/welcome.png" alt="">
        </div>

        <router-link to="/home" ><div class="btn start-btn">开始任务</div></router-link>
        <!-- <router-link to="/home" v-if="ok"><div class="btn start-btn">开始任务</div></router-link> -->
        <!-- <div class="btn start-btn">开始任务</div> -->
    </div>

</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import { NavBar, Toast } from 'vant';

    Vue.use(NavBar);
    Vue.use(Toast);

    export default {
        name: "Start",
        data(){
            return {
                ok: false
            }
        },
        computed:{
            ...mapGetters(["userinfo", "wxinfo"]),
        },

        mounted(){
            console.log("start")
            setTimeout(()=>{
                if(_.isEmpty(this.wxinfo)){
                    Toast("请在微信打开")
                }else{
                    this.postUser().then(()=>{
                        this.$nextTick(()=>{
                            this.getUser();
                            this.getUserRole();
                            this.ok = true;
                        })

                    })
                }
            }, 1000)


        },

        methods:{
            toExit() {
                // Toast('返回');
                WeixinJSBridge.call('closeWindow');
            },
            ...mapActions(["getUser", "postUser", "getUserRole"])
        }
    }
</script>

<style>
    /* 通用按钮样式 */
     .btn {
        height: 44px;
        background:linear-gradient(0deg,#FF9B02,#FFC801);
        border-radius:22px;
        line-height: 44px;
        font-size: 16px;
        color: #fff;
    }
     .start-btn {
        width: 80%;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: 200px;
        margin-left: -40%;
    }
    /* .van-nav-bar {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
    } */
</style>

<style lang="scss" scoped>
    .start {
        width: 100vw;
        height: 100vh;
        margin-top: 0 !important;
        position: relative;
    }
    .startBg {
        width: 300px;
        height: 377px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -188px;
        margin-left: -150px;
        img {
            width: 100%;
        }
    }


</style>