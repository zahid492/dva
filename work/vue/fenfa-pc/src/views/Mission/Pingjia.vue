<template>
    <div class="shenhe-box pingjia-box">
        <el-row>
            <el-row>
                <el-col :span="5" :offset="2" class="shenhe-title">
                    <div>评价任务{{position}}/{{allCount}}</div>
                </el-col>
                <el-col :span="15" style="text-aling:right;">
                    <div class="btn-box">
                        <div v-loading="loading" class="loading_box" v-show="loading">正在提交...</div>
                        <!-- id为0的时候 没有上一个 -->
                        <button class="prev" 
                        :disabled="sub"
                        @click="getPrev"
                        v-if="!isFirst">上一个</button>
                        <button class="next" 
                        :disabled="sub"
                        @click="getNext('正确')"
                        >正确</button>
                        <button class="next" 
                        :disabled="sub"
                        @click="getNext('错误')"
                        >错误</button>

                    </div>
                </el-col>
            </el-row>
            <el-col :span="20" :offset="2" class="shenhe-content">
                <el-row v-if="taskType===1">
                    <el-col :span="12">
                        <div class="zxjz-box">
                            <div class="home-title2">
                                原句
                                <span class="fr">{{mainSentence.length}}字</span>
                            </div>
                            <div class="yuanju-text yuanjupc-text">{{mainSentence}}</div>

                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="zxjz-box">
                            <div class="home-title2">
                                改写
                                <span class="fr">{{childSentence.length}}字</span>
                            </div>
                            <div class="yuanju-text yuanjupc-text">{{childSentence}}</div>
                        </div>
                        <div>
                            <span class="looklike fr">相似度：{{looklike}}%</span>
                            <span v-if="looklike > 60" class="looklike_ts fl">相似度大于60%，不计费。</span>
                            <span v-if="childSentence.trim().length == 0" class="looklike_ts fl">字数为0，不计费。</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="tongshun">
                    <el-col :span="13" :offset="8">
                        <span style="line-height: 20px;">通顺度评分：</span>
                        <div style="display:inline-block;">
                            <el-rate
                                    :max="10"
                                    :texts="SmoothnessList"
                                    v-model="Smoothness"
                                    style="display: inline-block"
                                    show-text>
                            </el-rate>
                        </div>

                    </el-col>
                </el-row>


            </el-col>
        </el-row>

    </div>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters,} from "vuex";
    import service from "@/utils/request";
    import {
        Col,
        Row,
        Radio,
        Select,
        Option,
        OptionGroup,
        Rate,
        Loading
    } from "element-ui";

    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Radio);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Rate);
    Vue.use(Loading);

    import "@/scss/common.scss";

    export default {
        name: "Pingjia",
        props: ["rid"],
        data() {
            return {
                exitTask: false,
                position: 0,
                allCount: 0,
                id: 0,
                mainSentence: "",
                childSentence: "",
                isFirst: true,
                isLast: false,
                tag: "",
                SemanticsChanged: '',
                SmoothnessList: ['1分', '2分', '3分', '4分', '5分', '6分', '7分', '8分', '9分', '10分'],
                looklike: 0,
                Smoothness: 0,
                taskType: 0,
                over: false,
                doList: [],
                fullscreenLoading: false,
                sub: false,
                loading: false

            };
        },
        beforeRouteLeave(to, from, next) {
            if (!this.over) {
                this.$confirm("没做完就退出吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    closeOnHashChange: false,
                    type: 'warning'
                }).then(() => {
                    next()
                }).catch(() => {
                    next(false)
                });

                next(false)
            } else {
                next()
            }
        },
        computed: {
            ...mapGetters(["acceptedTasks"])
        },
        mounted() {
            this.getInit();
            window.addEventListener("resize", function () {
                if (
                    document.activeElement.tagName == "INPUT" ||
                    document.activeElement.tagName == "TEXTAREA"
                ) {
                    window.setTimeout(function () {
                        document.activeElement.scrollIntoViewIfNeeded();
                    }, 0);
                }
            });
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
                        this.looklike = (res.data * 100).toFixed(0)
                    }).catch(err => {
                        this.looklike = 0;
                    });
                } else {
                    this.looklike = 0;
                }
            },
            // 通顺度:1-5，语义是否变化:是否
            getInit() {
                this.saveAndGet({
                    target: 0,
                    taskId: this.rid,
                    data: {
                        id: this.id,
                        childSentence: this.childSentence,
                        tag: "",
                        smoothness: 0
                    }
                }).then(
                    res => {
                        this.id = res.id;

                        this.mainSentence = res.mainSentence;
                        this.childSentence = res.childSentence;
                        this.taskType = 1;

                        this.isFirst = res.isFirst;
                        this.isLast = res.isLast;
                        this.position = res.position;
                        this.allCount = res.allCount;
                        this.Smoothness = res.smoothness || 0;
                        this.tag = res.tag;
                        this.looklike = 0;
                        this.getLevenshtein(res.childSentence || "");

                        this.doList = _.map(_.range(res.allCount), (v) => {
                            return false;
                        });
                    },
                    err => {
                        this.$message("获取数据出错，请重试");
                    }
                );
            },
            submit() {
                // if (res.tag && res.isLast) {
                this.submitTask({taskId: this.rid}).then(
                    () => {
                        this.over = true;
                        this.$message.success("恭喜完成任务");
                        this.$router.push("/home");
                    }
                );
                // }
            },
            getNext(tag) {
               this.sub = true;
               this.loading = true;
                if (this.Smoothness === 0) {
                    this.$message("请选择通顺度评分");
                    return
                }
                this.tag = tag;

                this.saveAndGet({
                    target: 0,
                    taskId: this.rid,
                    data: {
                        id: this.id,
                        childSentence: this.childSentence,
                        tag: tag,
                        smoothness: this.Smoothness
                    }
                }).then(
                    res => {
                        this.sub = false;
                        this.loading = false;
                        if (!_.isNull(res)) {
                            this.id = res.id;

                            this.mainSentence = res.mainSentence;
                            this.childSentence = res.childSentence;
                            this.taskType = 1;

                            this.isFirst = res.isFirst;
                            this.isLast = res.isLast;
                            this.position = res.position;
                            this.allCount = res.allCount;
                            this.tag = res.tag;
                            this.Smoothness = res.smoothness || 0;
                            this.getLevenshtein(res.childSentence | "");

                            if (this.doList[res.allCount - 2] && !this.doList[res.allCount - 1]) {
                                this.doList[res.allCount - 1] = true;
                            } else {
                                this.doList[res.position - 2] = true;
                            }

                            // res.childSentence && res.childSentence.length > 0 &&
                            if (res.isLast && this.doList[res.position - 1]) {
                                this.sub = true;
                                this.loading = true;
                                this.submitTask({taskId: this.rid}).then(() => {
                                    this.sub = false;
                                    this.loading = false;
                                    this.$message.success("恭喜完成任务");
                                    this.over = true;
                                    this.$router.push("/home")
                                })
                            }
                        }
                    },
                    err => {
                        this.sub = false;
                        this.loading = false;
                        this.$message("保存出错，请重试");
                    }
                );

            },
            getPrev() {
                this.sub = true;
                this.loading = true;
                this.saveAndGet({
                    target: -1,
                    taskId: this.rid,
                    data: {
                        id: this.id,
                        childSentence: this.childSentence,
                        tag: "",
                        smoothness: this.Smoothness,
                    }
                }).then(
                    res => {
                        this.sub = false;
                        this.loading = false;
                        this.id = res.id;
                        this.mainSentence = res.mainSentence;
                        this.childSentence = res.childSentence;
                        this.taskType = 1;

                        this.isFirst = res.isFirst;
                        this.isLast = res.isLast;
                        this.position = res.position;
                        this.allCount = res.allCount;
                        this.tag = res.tag;
                        this.Smoothness = res.smoothness || 0;
                        this.doList[res.position - 1] = false;
                        this.getLevenshtein(res.childSentence || "")
                    },
                    err => {
                        this.sub = false;
                        this.loading = false;
                        this.$message("保存出错，请重试");
                    }
                );
            },
            ...mapActions(["saveAndGet", "submitTask"])
        }
    };
</script>


<style lang="scss">
 .el-loading-mask.is-fullscreen .el-loading-spinner .circular {
        height: 0;
    }
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

    .tongshun {
        text-align: left;
        padding-left: 20px;

        .el-rate {
            line-height: 10px !important;
        }
    }

    .option-sh {
        width: 100%;
        height: 68px;
        padding: 14px 0 0 0;
        margin: 35px 0 60px;
        // text-align: left;
        .el-radio.is-bordered.is-checked {
            border-color: #FF9F02;
        }

        .el-radio__input.is-checked .el-radio__inner {
            border-color: #FF9F02;
            background: #FF9F02;
        }

        .el-radio__input.is-checked + .el-radio__label {
            color: #FF9F02;
        }

        .el-radio {
            margin-right: 0;
        }

        .el-select .el-input.is-focus .el-input__inner {
            border-color: #FF9F02;
        }

        .el-select-dropdown__item.selected {
            color: #FF9F02;
            font-weight: 700;
        }
    }

    .btn-box2 {
        width: 100%;
        padding: 0 20px;
        height: 68px;
        margin: 35px 0 60px;

        .correct,
        .mistake {
            width: 120px;
            height: 100%;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 4px 20px 0px rgba(37, 48, 98, 0.15);
            border-radius: 10px;
            font-size: 16px;
            color: #525254;
        }

        .w5 {
            width: 5%;
            height: 100%;
            display: inline-block;
        }

        .prev {
            height: 100%;
            width: 120px;
            font-size: 16px;
            color: #525254;

            .text {
                width: 50px;
            }
        }

        .icon {
            width: 61px;
            height: 100%;
            margin: 4px 0 0 10px;
            float: left;

            img {
                width: 100%;
            }
        }

        .text {
            width: 40px;
            float: left;
            height: 68px;
            line-height: 68px;
        }
    }

    .yuanjupc-text {
        padding: 20px !important;
        border: 1px solid #E6E6E6;
    }

    /* 同义词 */
    .ci-box {
        height: 60%;
        width: 80%;
        margin-left: 10%;
        padding-top: 40px;

        .ci {
            color: #4B4E5F;
            font-size: 30px;
            position: relative;
            width: 40%;
            margin: 0 5%;
            height: 260px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(230, 230, 230, 1);

            span {
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

        }

        .ci1 {
            border-bottom: 1px solid #DDDDDD;
        }
    }
</style>

<style lang="scss" scoped>
    .btn-box {
        width: 60%;
        height: 44px;
        float: right;
        padding: 0;
        text-align: right;
        margin: 24px 0 40px 0 !important;

        .prev {
            width: 16%;
            height: 100%;
            color: #525254;
        }

        .next {
            width: 25%;
            height: 100%;
            background: linear-gradient(0deg, #FF9B02, #FFC801);
            border-radius: 22px;
            font-size: 16px;
            color: #fff;
            margin-right: 10px;
        }
    }

    .shenhe-box {
        width: 100%;
    }

    .shenhe-content {
        height: 80vh;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
        border-radius: 6px;
    }

    .shenhe-title {
        height: 100px;
        line-height: 100px;
        text-align: left;
        font-size: 30px;
        color: rgba(75, 78, 95, 1);
    }

    .jz-box {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .zxjz-box {
        padding: 0 20px 20px;
        border-top: 1px solid transparent;
    }

    .gaixie-box {
        margin-top: 0;
        padding: 0 20px;
    }

    .yuanju-text {
        width: 100%;
        height: 300px;
        padding: 0 0 20px;
        text-align: left;
        font-size: 16px;
        color: #8c8b90;
    }

    .gaixie-text {
        height: 195px;
        padding: 0 20px 20px;
        background: #f7f7fa !important;
        resize: none;
    }


</style>