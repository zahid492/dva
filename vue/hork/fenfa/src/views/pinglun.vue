<template>
    <div class="jz-box pingjia-box">
        <van-nav-bar
                :title="`评价任务${position}/${allCount}`"
                class="tongyi-top"
                :fixed="false"
                :z-index="1000"
                left-text=""
                left-arrow
                @click-left="toPrevPage"
        />
        <div class="zxjz-box">
            <div class="home-title2">
                新闻参考
                <span class="fr chakan">查看详情<span class="icon-right iconfont"></span></span>
            </div>
            <div class="yuanju-text">
                李彦宏的2019两会提案：完善电子病历，解决老百姓看病难的问题
            </div>
        </div>
        <div class="zxjz-box gaixie-box">
            <div class="home-title2">
                改写
                <span class="fr">116字</span>
            </div>

        </div>
        <div>
            <span class="looklike fr">相似度：{{looklike}}%</span>
            <span v-if="looklike > 60" class="looklike_ts fl">相似度大于60%，不计费。</span>
            <span v-if="childSentence.trim().length == 0" class="looklike_ts fl">字数为0，不计费。</span>
        </div>
        <div class="pinglun-box">
            <div class="yuanju-text gaixie-text pinglun-text">
                <van-cell-group>
                    <van-field
                            v-model="childSentence"
                            type="textarea"
                            placeholder="在此输入10-15字的评论"
                            rows="7"
                    />
                </van-cell-group>
            </div>
             <div class="tishi">字数不合格，要求10-15字</div>
        </div>


        <div class="btn-box">
            <!-- id为0的时候 没有上一个 -->
            <button class="prev" @click="getPrev" v-if="!isFirst">上一个</button>
            <button class="next" @click="getNext" v-if="!isLast">下一个</button>
        </div>

        <over-task
                :exit-task.sync="exitTask"
                @notExit="notExit"
                @yesExit="yesExit"
        ></over-task>
    </div>
</template>

<script>
    import Vue from "vue"
    import {mapActions, mapGetters} from "vuex";
    import {Field, CellGroup, Toast} from 'vant';
    import {Popup} from 'vant';
    import {exitPopupMixin} from '@/mixin/exitPopup';
    import overTask from "@/components/over-task.vue";

    import "@/scss/common.scss";

    Vue.use(Field);
    Vue.use(CellGroup);
    Vue.use(Toast);
    Vue.use(Popup);


    export default {
        name: "Pinglun",
        props: ["rid"],
        data() {
            return {
                exitTask: false,
                position: 0,
                allCount: 0,
                id: 0,
                looklike: 0,
                mainSentence: "",
                childSentence: "",
                isFirst: true,
                isLast: false,
                show: true,

            }
        },
        mixins:[exitPopupMixin],
        components:{
            "over-task": overTask
        },
        computed: {
            ...mapGetters(["acceptedTasks"]),
        },
        mounted() {
            this.getInit()

        },

        methods: {
            getLevenshtein(v) {
                let vv = _.trim(v);
                if (this.mainSentence != "" && vv != "") {
                    service({
                        url: 'Helper/ComputedEditDistanceSimilarity',
                        method: 'post',
                        data: {
                            "source": this.mainSentence,
                            "target": vv,
                        }
                    }).then(res => {
                        this.looklike = res.data <= 0 ? 0 : (res.data * 100).toFixed(0)
                    }).catch(err => {
                        this.looklike = 0;
                    });
                } else {
                    this.looklike = 0;
                }
            },
            getInit() {
                this.saveAndGet({
                    "target": 0,
                    "taskId": this.rid,
                    "data": {
                        "id": this.id,
                        "childSentence": this.childSentence,

                    }
                }).then(res => {
                    this.id = res.id;
                    this.mainSentence = res.mainSentence;
                    this.childSentence = "";
                    this.isFirst = res.isFirst;
                    this.isLast = res.isLast;
                    this.position = res.position;
                    this.allCount = res.allCount;
                    this.looklike = 0;
                    this.getLevenshtein(res.childSentence || "");
                }, err => {
                    Toast("获取数据出错，请刷新页面")
                })
            },

            getNext() {

                if (this.childSentence.trim().length === 0 && !this.isLast) {
                    Toast("请填写子句");
                    return;
                } else {
                    this.saveAndGet({
                        "target": 0,
                        "taskId": this.rid,
                        "data": {
                            "id": this.id,
                            "childSentence": this.childSentence,
                            "tag": "完成"
                        }
                    }).then(res => {
                        Toast("保存成功");
                        this.id = res.id;
                        this.mainSentence = res.mainSentence;
                        this.childSentence = "";
                        this.isFirst = res.isFirst;
                        this.isLast = res.isLast;
                        this.position = res.position;
                        this.allCount = res.allCount;
                        this.getLevenshtein(res.childSentence || "");


                        if (this.isLast) {

                        }
                    }, err => {
                        Toast("保存出错，请重试")
                    })
                }

            },

            getPrev() {
                this.saveAndGet({
                    "target": -1,
                    "taskId": this.rid,
                    "data": {
                        "id": this.id,
                        "childSentence": "",
                    }
                }).then(res => {
                    this.id = res.id;
                    this.mainSentence = res.mainSentence;
                    this.childSentence = res.childSentence;
                    this.isFirst = res.isFirst;
                    this.isLast = res.isLast;
                }, err => {
                    Toast("出错，请重试")
                })
            },
            ...mapActions(["saveAndGet", "submitTask"])
        }
    }
</script>
<style lang="scss">
    .pingjia-box {
        .looklike, .looklike_ts {
            text-align: right;
            font-size: 14px;
            color: rgba(75, 78, 95, 1);
            margin: -10px 25px 30px;
        }

        .looklike_ts {
            margin-right: 30px;
            color: red;
        }
    }
    .tongyi-top {
        background: none !important;
    }
    .van-hairline--bottom:after {
        border: none !important;
    }
    .tishi {
        text-align: left;
        padding-left: 20px;
        font-size: 12px;
        margin-top: 5px;
        color: red;
    }

    .pinglun-text {
        border: 1px solid red;
    }


    .end-btn {
        background: none;
        color: #4b4e5f;
        border: 1px solid #bfbfbf;
    }

    // 弹框
    .van-popup {
        width: 90%;
        height: 360px;
        border-radius: 8px;

        .start-btn {
            margin-top: 50px;
        }

        .end-btn {
            background: none;
            color: #4b4e5f;
            border: 1px solid #bfbfbf;
        }

        // 弹框
        .van-popup {
            width: 90%;
            height: 360px;
            border-radius: 8px;

            .start-btn {
                margin-top: 50px;
            }

            .ok-btn {
                margin-top: 80px;
            }

            .end-btn {
                margin-top: 110px;
            }

            .text {
                font-size: 18px;
                color: #4b4e5f;
                font-weight: bold;
                margin-top: -20px;
            }
        }

        .tanimg {
            width: 80%;
            margin: 30px 10% 0;

            img {
                width: 100%;
            }
        }

        .van-cell-group {
            background: none;
            height: 100% !important;

            .van-cell {
                background: none;
                height: 100% !important;
                padding: 0 !important;
            }

            .van-cell__value--alone {
                font-size: 16px !important;
                color: #21232D !important;
            }

            .van-field__body, .van-field__control {
                height: 100% !important;
                color: #21232D !important;
            }

            .van-field__control {
                padding-top: 10px !important;
            }
        }

    }

        .btn-box {
            width: 100%;
            height: 44px;
            padding: 0 20px;
            margin: 30px 0 60px;

            .prev {
                width: 30%;
                height: 100%;
                font-size: 16px;
                color: #525254;
            }

            .next {
                width: 70%;
                height: 100%;
                background: linear-gradient(0deg, #FF9B02, #FFC801);
                border-radius: 22px;
                font-size: 16px;
                color: #fff;
            }
        }
</style>

<style scoped>
    .jz-box {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .zxjz-box {
        width: 100%;
        height: 140px;
        padding: 0 20px 20px;
        /* margin-top: 46px; */
        border-top: 1px solid transparent;
    }

    .gaixie-box {
        margin-top: 0;
        padding: 0 20px;
    }

    .yuanju-text {
        width: 100%;
        height: 80px;
        overflow-y: scroll;
        padding: 0 0 20px;
        text-align: left;
        font-size: 16px;
        color: #8C8B90;
    }

    .gaixie-text {
        height: 175px;
        padding: 10px 20px 20px;
        background: #F7F7FA;
        resize: none;
    }
    .pinglun-box {
        height: 220px;
    }
</style>