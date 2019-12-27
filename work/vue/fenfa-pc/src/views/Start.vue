<template>
    <div class="start">
        <div class="startBg">
            <img :src="qrcode" frameborder="0" class="qrcode"/>
        </div>
    </div>

</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import Vue from "vue";
    import {
        getToken,
        setToken,
        getUserRole
    } from "@/utils/auth";
    import * as qs from "querystring";

    export default {
        name: "Start",
        data() {
            return {
                qrcode: "",
                ticket: window.ticket,
                // ticket: "",
                wxstate: "",
                wxTimer: undefined
            }
        },
        computed: {
            ...mapGetters(["userinfo", "wxinfo"]),
        },

        mounted() {
            let role = getUserRole();
            if(!_.isNil(getToken()) && role && role.id>0){
                this.$router.push("/home")
            }else{
          
                if(this.ticket){
          this.getWx({ticket: this.ticket}).then((res) => {
                            if (res.id !== 0) {
                                this.wxstate = res;
                                this.set_token(res.token);
                                console.log(res.token)
                                setToken(res.token);
                                this.getUser();
                                this.getUserRole();
                                this.$router.push("/home");
                                clearInterval(this.wxTimer);
                            }
                        }).catch(e=>{
                            // console.log(e)
                        })
                }else{
 this.getQrcode().then((code) => {
                    this.qrcode = code;
                    this.ticket = qs.parse(code.split("?")[1]).ticket;
                    console.log("this.ticket:", this.ticket)

                    this.wxTimer = setInterval(() => {
                        this.getWx({ticket: this.ticket}).then((res) => {
                            if (res.id !== 0) {
                                this.wxstate = res;
                                this.set_token(res.token);
                                console.log(res.token)
                                setToken(res.token);
                                this.getUser();
                                this.getUserRole();
                                this.$router.push("/home");
                                clearInterval(this.wxTimer);
                            }
                        }).catch(e=>{
                            // console.log(e)
                        })
                    }, 1000)
                });
                }
               
            }

        },

        methods: {
            toExit() {
                WeixinJSBridge.call('closeWindow');
            },
            ...mapMutations(["set_token"]),
            ...mapActions(["getUser", "getWx", "getUserRole", "getQrcode"])
        }
    }
</script>
<style>
    /* 通用按钮样式 */
    .btn {
        height: 44px;
        background: linear-gradient(0deg, #FF9B02, #FFC801);
        border-radius: 22px;
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
</style>

<style lang="scss" scoped>
    .start {
        width: 100vw;
        height: 100vh;
        margin-top: 0 !important;
        position: relative;
    }

    .startBg {
        width: 356px;
        height: 434px;
        background: url(../assets/ewm-box.png) no-repeat;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -188px;
        margin-left: -150px;

        img {
            width: 149px;
            height: 149px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: 45px;
            margin-left: -75px;
        }
    }


</style>