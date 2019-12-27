<template>
    <div class="shenhe-box">
        <el-row>
            <el-row>
                <el-col :span="20" :offset="2" class="shenhe-title">
                    <div>审核任务{{position}}/{{allCount}}</div>
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
                <el-row>
                    <el-col :span="24">
                        <div class="btn-box2">
                             <div v-loading="loading" class="loading_box" v-show="loading">正在提交...</div>
                            <button class="prev"
                            :disabled="sub"
                            @click="getPrev" v-if="!isFirst">
                                <p class="text">上一个</p></button>
                            <button class="correct"
                            :disabled="sub"
                            @click="getNext('正确')">
                                <div class="icon">
                                    <img src="@/assets/yes11.png" alt v-show="tag==='正确'"/>
                                    <img src="@/assets/yes1.png" alt v-show="tag!=='正确'"/>
                                </div>
                                <p class="text">正确</p>
                            </button>
                            <div class="w5"></div>
                            <button class="mistake"
                            :disabled="sub"
                            @click="getNext('错误')">
                                <div class="icon">
                                    <img src="@/assets/no11.png" alt v-show="tag==='错误'"/>
                                    <img src="@/assets/no1.png" alt v-show="tag!=='错误'"/>
                                </div>
                                <p class="text">错误</p>
                            </button>
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
        name: "Shenhe",
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
                Smoothness: 0,
                taskType: 0,
                over: false,
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
                    },
                    err => {
                        this.$message("获取数据出错，请重试");
                    }
                );
            },
            getNext(tag) {
                this.sub = true;
                this.loading = true;
                if(this.Smoothness===0){
                    this.$message("请选择通顺度评分");
                    return
                }
                this.tag = tag;
                _.delay(() => {
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
                                if (res.tag && res.isLast) {
                                    this.sub = true;
                                    this.loading = true;
                                    this.submitTask({taskId: this.rid}).then(
                                        () => {
                                            this.sub = false;
                                            this.loading = false;
                                            this.over = true;
                                            this.$message.success("恭喜完成任务");
                                            this.$router.push("/home");
                                        }
                                    );
                                }
                            }
                        },
                        err => {
                            this.sub = false;
                            this.loading = false;
                            this.$message("保存出错，请重试");
                        }
                    );
                }, 400);
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
                    },
                    err => {
                        this.sub = false;
                        this.loading = false;
                        this.$message("出错，请重试");
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

<style scoped>
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
        /*overflow: hidden;*/
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