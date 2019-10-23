<template>
    <div class="wode">
        <!-- <van-nav-bar
                title="个人中心"
                :fixed="true"
                :z-index=1000
                left-text=""
                left-arrow
                @click-left="toPrevPage"
        /> -->
        <div class="van-info-my">
            <div class="touxiang">
                <img :src="userinfo.weChatHeadUrl" alt="">
            </div>
            <div class="name">
                <p class="text1">{{userinfo.weChatNickName}}</p>
                <!--<p class="text2">OpenID:{{userinfo.weChatOpenId}}</p>-->
            </div>
        </div>
        <div class="info-box">
            <div class="home-title1">
                我的战绩
                <!-- <span>任务量：{{userinfo.synonymCount + userinfo.similarSentencePairCount+ userinfo.similarSentencePairReviewCount}}个</span> -->
            </div>
            <ul class="info-list">

                <li class="item" v-if="userinfo.similarSentencePairCount > 0">
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.sentence}`">
                            <div class="icon">
                                <img src="../../assets/rw-icon1.png" alt="">
                            </div>
                            <div class="content1">
                                <span class="name fl">撰写句子对</span>
                                <span class="num fr">{{userinfo.similarSentencePairCount}}</span>
                            </div>
                            <div class="go">
                                <img src="../../assets/go.png" alt="">
                            </div>
                        </router-link>
                    </div>
                </li>

                <li class="item" v-if="userinfo.rewriteCount > 0">
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.rewrite}`">
                            <div class="icon">
                                <img src="../../assets/rw-icon5.png" alt="">
                            </div>
                            <div class="content1">
                                <span class="name fl">改写句子对</span>
                                <span class="num fr">{{userinfo.rewriteCount}}</span>
                            </div>
                            <div class="go">
                                <img src="../../assets/go.png" alt="">
                            </div>
                        </router-link>
                    </div>
                </li>

<!--                <li class="item" v-if="userinfo.synonymCount >0">-->
<!--                    <div class="renwu">-->
<!--                        <router-link :to="`/wan/${pathId.synonym}`">-->
<!--                            <div class="icon"><img src="../../assets/rw-icon3.png" alt=""></div>-->
<!--                            <div class="content1">-->
<!--                                <span class="name fl">同义词</span>-->
<!--                                <span class="num fr">{{userinfo.synonymCount}}</span>-->
<!--                            </div>-->
<!--                            <div class="go">-->
<!--                                <img src="../../assets/go.png" alt="">-->
<!--                            </div>-->
<!--                        </router-link>-->
<!--                    </div>-->
<!--                </li>-->

                <li class="item" v-if="userinfo.similarSentencePairReviewCount > 0">
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.audit}`">
                            <div class="icon">
                                <img src="../../assets/rw-icon2.png" alt="">
                            </div>
                            <div class="content1">
                                <span class="name fl">审核句子对</span>
                                <span class="num fr">{{userinfo.similarSentencePairReviewCount}}</span>
                            </div>
                            <div class="go">
                                <img src="../../assets/go.png" alt="">

                            </div>
                        </router-link>
                    </div>
                </li>

                <li class="item" v-if="userinfo.scoringTaskCount > 0">
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.scoring}`">
                            <div class="icon">
                                <img src="../../assets/rw-icon4.png" alt="">
                            </div>
                            <div class="content1">
                                <span class="name fl">评价句子对</span>
                                <span class="num fr">{{userinfo.scoringTaskCount}}</span>
                            </div>
                            <div class="go">
                                <img src="../../assets/go.png" alt="">

                            </div>
                        </router-link>
                    </div>
                </li>
            </ul>
        </div>
        <div class="h50"></div>
        <bottom-nav></bottom-nav>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import {pathId} from "@/utils/type";
    import bottomNav from "@/components/bottom-nav.vue"
    import "@/scss/common.scss";

    export default {
        name: "My",
        data:function(){
            return {
                pathId: pathId
            }
        },
        components: {
            "bottom-nav": bottomNav,
        },
        computed: {
            ...mapGetters(["userinfo"]),
        },
        created(){
            this.getUser();
        },
        methods: {
            toPrevPage() {
                this.$router.push("/home")
            },
            ...mapActions(["getUser"])
        }
    }
</script>

<style lang="scss" scoped>
    .wode {
        width: 100%;
        background: #fff;
            // height: 100vh;
    }
    .van-info-my {
        width: 100%;
        height: 135px;
        background: linear-gradient(-50deg, #FF9B02 0%, #FFC801 88%);
        box-shadow: 0px 0px 40px 0px rgba(21, 55, 153, 0.1);
        border-radius: 2px;
        position: relative;

        .name {
            width: 120px;
            height: 50px;
            position: absolute;
            top: 50%;
            left: 140px;
            margin-top: -25px;

            .text1 {
                font-size: 16px;
                color: #fff;
                font-weight: bold;
            }

            .text2 {
                font-size: 12px;
                color: #fff;
                font-weight: bold;
                margin-top: 10px;
            }
        }
    }

    .touxiang {
        border: 1px solid #fff;
        width: 76px;
        height: 76px;
        border-radius: 50%;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 46px;
        margin-top: -38px;

        img {
            width: 100%;
        }
    }

    .info-box {
        width: 100%;
        background: #fff;
        padding: 0 30px;
    }

    .info-list {
        width: 100%;
        background: #fff;
        .go {
            margin-top: 0 !important;
        }
        .item {
            width: 100%;
            height: 90px;
            padding: 10px 0;
            border-top: 1px solid #DDDDDD;

            .icon {
                width: 50px;
                height: 50px;
                margin-top: 10px;

                img {
                    width: 100%;
                }
            }
        }

        .content1 {
            width: 225px;
            height: 20px;
            margin-top: 25px;
            float: left;

            span {
                line-height: 20px;
                color: #4B4E5F;
                font-weight: 400;
            }

            .name {
                font-size: 14px;
                margin-left: 15px;
            }

            .num {
                font-size: 16px;
            }
        }

        .go {
            width: 27px;
            height: 100%;
            float: left;
            margin-left: 13px;

            img {
                margin-top: 22px;
                width: 27px;
                height: 27px;
            }
        }

        .go-text {
            font-size: 14px;
            color: #FF9F02;
            margin-top: 16px;
        }
    }
</style>