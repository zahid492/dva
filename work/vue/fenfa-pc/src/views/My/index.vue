<template>
    <div class="wode">
        <div class="gerenpc">
            <div class="home-title1">
                个人中心
            </div>
            <div class="van-info-my">
                <div class="touxiang">
                    <img :src="userinfo.weChatHeadUrl" alt="">
                </div>
                <div class="name">
                    <p class="text1">{{userinfo.weChatNickName}}</p>
                    <p class="text2">OpenID:{{userinfo.weChatOpenId}}</p>
                </div>
            </div>
            <div class="home-title1">
                我的战绩
                <!-- <span>任务量：{{userinfo.synonymCount + userinfo.similarSentencePairCount+ userinfo.similarSentencePairReviewCount}}个</span> -->
            </div>
        </div>
        <div class="info-box">
            <ul class="info-list">

                <li class="item" v-if="userinfo.similarSentencePairCount >= 0">
                    <span class="title-name">撰写句子对</span>
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.sentence}`" v-if="userinfo.similarSentencePairCount >0">
                            <div class="icon">
                                <img src="../../assets/rw-icon1.png" alt="">
                            </div>
                        </router-link>
                        <div class="icon" v-if="userinfo.similarSentencePairCount ===0">
                            <img src="../../assets/rw-icon1.png" alt="">
                        </div>

                        <div class="content1">
                            <p class="num">{{userinfo.similarSentencePairTaskCount}}</p>
                            <p class="name">任务数量</p>
                        </div>
                        <div class="content1">
                            <p class="num">{{userinfo.similarSentencePairCount}}</p>
                            <p class="name">句子数量</p>
                        </div>

                    </div>
                </li>

                <li class="item" v-if="userinfo.rewriteCount >= 0">
                    <span class="title-name">改写句子对</span>
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.rewrite}`" v-if="userinfo.rewriteCount >0">
                            <div class="icon">
                                <img src="../../assets/rw-icon5.png" alt="">
                            </div>
                        </router-link>
                        <div class="icon" v-if="userinfo.rewriteCount ===0">
                            <img src="../../assets/rw-icon5.png" alt="">
                        </div>

                        <div class="content1">
                            <p class="num">{{userinfo.rewriteTaskCount}}</p>
                            <p class="name">任务数量</p>
                        </div>
                        <div class="content1">
                            <p class="num">{{userinfo.rewriteCount}}</p>
                            <p class="name">改写数量</p>
                        </div>

                    </div>
                </li>


<!--                <li class="item" v-if="userinfo.synonymCount >=0">-->
<!--                    <span class="title-name">清洗同义词</span>-->
<!--                    <div class="renwu">-->
<!--                        <router-link :to="`/wan/${pathId.synonym}`" v-if="userinfo.synonymCount >0">-->
<!--                            <div class="icon"><img src="../../assets/rw-icon3.png" alt=""></div>-->
<!--                        </router-link>-->
<!--                        <div class="icon" v-if="userinfo.synonymCount ===0"><img src="../../assets/rw-icon3.png" alt="">-->
<!--                        </div>-->
<!--                        <div class="content1">-->
<!--                            <p class="num">{{userinfo.synonymTaskCount}}</p>-->
<!--                            <p class="name">任务数量</p>-->
<!--                        </div>-->
<!--                        <div class="content1">-->
<!--                            <p class="num">{{userinfo.synonymCount}}</p>-->
<!--                            <p class="name">同义词量</p>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </li>-->

                <li class="item" v-if="userinfo.scoringTaskCount >= 0">
                    <span class="title-name">评价句子对</span>
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.scoring}`" v-if="userinfo.scoringTaskCount > 0">
                            <div class="icon">
                                <img src="../../assets/rw-icon4.png" alt="">
                            </div>
                        </router-link>
                        <div class="icon" v-if="userinfo.scoringTaskCount === 0">
                            <img src="../../assets/rw-icon4.png" alt="">
                        </div>
                        <div class="content1">
                            <p class="num">{{userinfo.scoringTaskGroupCount}}</p>
                            <p class="name">任务数量</p>
                        </div>
                        <div class="content1">
                            <p class="num">{{userinfo.scoringTaskCount}}</p>
                            <p class="name">评价量</p>
                        </div>
                    </div>
                </li>

                <li class="item" v-if="userinfo.similarSentencePairReviewCount >= 0">
                    <span class="title-name">审核句子对</span>
                    <div class="renwu">
                        <router-link :to="`/wan/${pathId.audit}`" v-if="userinfo.similarSentencePairReviewCount > 0">
                            <div class="icon">
                                <img src="../../assets/rw-icon2.png" alt="">
                            </div>
                        </router-link>
                        <div class="icon" v-if="userinfo.similarSentencePairReviewCount === 0">
                            <img src="../../assets/rw-icon2.png" alt="">
                        </div>
                        <div class="content1">
                            <p class="num">{{userinfo.similarSentencePairReviewTaskCount}}</p>
                            <p class="name">任务数量</p>
                        </div>
                        <div class="content1">
                            <p class="num">{{userinfo.similarSentencePairReviewCount}}</p>
                            <p class="name">审核量</p>
                        </div>
                    </div>
                </li>

            </ul>
        </div>
        <div class="h50"></div>
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
        created() {
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
        padding: 0 20px 20px;
    }

    .gerenpc {
        // padding: 0 20px 20px;
    }

    .van-info-my {
        width: 100%;
        height: 135px;
        background: linear-gradient(-50deg, #FF9B02 0%, #FFC801 88%);
        box-shadow: 0px 0px 40px 0px rgba(21, 55, 153, 0.1);
        border-radius: 2px;
        position: relative;

        .name {
            text-align: left;
            width: 500px;
            height: 68px;
            position: absolute;
            top: 50%;
            left: 140px;
            margin-top: -34px;

            .text1 {
                font-size: 28px;
                color: #fff;
                font-weight: bold;
            }

            .text2 {
                font-size: 16px;
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
        height: 830px;
        background: #fff;
        padding: 50px 57px 100px;
        box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
        border-radius: 6px;
    }

    .info-list {
        width: 100%;
        height: 400px;

        .item {
            width: 50%;
            height: 230px;
            padding: 10px 0;
            float: left;
            text-align: left;

            .title-name {
                width: 90%;
                height: 40px;
                line-height: 40px;
                margin-left: 5%;
                font-size: 20px;
                color: rgba(75, 78, 95, 1);
            }

            .renwu {
                width: 90%;
                height: 160px;
                margin-left: 5%;
                border: 1px solid #DDDDDD;
                padding: 42px 38px;

            }

            .icon {
                width: 80px;
                height: 80px;

                img {
                    width: 100%;
                }
            }
        }

        .content1 {
            width: 35%;
            height: 50px;
            margin-top: 11px;
            float: left;
            text-align: center;

            span {
                line-height: 20px;
                color: #808080 !important;
                font-weight: 400;
            }

            .name {
                font-size: 16px;
                color: #808080 !important;
            }

            .num {
                font-size: 32px;
                color: #808080 !important;
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