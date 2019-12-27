<template>
    <div class="wan">
        <div id="swrapper" ref="wrapper">
            <div id="scroller">
                <div class="renwu-box">
                    <div class="icon">
                        <icon-type :tid="parseInt(tid,10)" :status="status"></icon-type>
                    </div>
                    <div class="content1">
                        <div class="rwl-box">
                            <span class="name fl">任务数量</span>
                            <span class="num fr">{{countsObj.value.taskCount}}</span>
                        </div>
                        <div class="rwl-box">
                            <span class="name fl">{{countsObj.countname}}</span>
                            <span class="num fr">{{countsObj.value.childCount}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- list -->
            <el-row class="juzipc-list" v-loading="loading">
                <el-col :span="24" class="item" v-for="item in list" :key="item.number">
                    <el-row>
                        <el-col :span="20" class="fl">
                            <p class="title" @click="toDetailPage(item.id)">{{item.name}}</p>
                            <div class="particulars">
                                <span>单号：{{item.number}}</span>
                                <span>任务量：{{item.sentenceCount}}</span>
                                <span v-if="item.validCount !== null" >有效量：{{item.validCount}}</span>
                                <span v-if="tid!='3'">完成时间：{{item.submitDtStamp | time}}</span>
                            </div>
                        </el-col>
                        <el-col :span="3" class="fr" :offset="1">
                            <el-button size="medium" class="shenhe-no-btn" round>{{item.taskStatus}}</el-button>
                        </el-col>
                    </el-row>
                </el-col>

            </el-row>
        </div>
        <div class="h50"></div>

    </div>
</template>

<script>
    import Vue from "vue";
    import {Col, Row, Button, Loading} from 'element-ui';

    Vue.use(Col);
    Vue.use(Row);
    Vue.use(Button);
    Vue.use(Loading);

    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {toDateTime} from "@/utils/index";
    import {pathId} from "@/utils/type";

    import bottomNav from "@/components/bottom-nav.vue";
    import iconType from "@/components/icon-type.vue";


    export default {
        name: "Wan",
        props: ["tid"],
        components: {
            "bottom-nav": bottomNav,
            "icon-type": iconType,
        },
        data() {
            const that = this;
            let status = function () {
                switch (parseInt(that.tid, 10)) {
                    case pathId.sentence:
                        return 3;
                        break;
                    case pathId.synonym:
                        return 3;
                        break;
                    case pathId.audit:
                        return 7;
                        break;
                    case pathId.scoring:
                        return 0;
                }
            }();
            return {
                pathId: pathId,
                loading: false,
                // finished: false,
                error: false,
                status: status,
                reqCount:0,
            }
        },
        filters: {
            time: function (value) {
                return toDateTime(value);
            }
        },
        computed: {
            countsObj() {
                switch (parseInt(this.tid, 10)) {

                    case this.pathId.sentence:
                        return {
                            task: "句子对",
                            countname: "句子数量",
                            value: this.sentenceTaskCount
                        };
                        break;

                    case this.pathId.rewrite:
                        return {
                            task: "句子对改写",
                            countname: "改写数量",
                            value: this.rewriteTaskCount
                        };
                        break;

                    case this.pathId.synonym:
                        return {
                            task: "同义词",
                            countname: "同义词数量",
                            value: this.synonymTaskCount
                        };
                        break;

                    case this.pathId.audit:
                        return {
                            task: "审核",
                            countname: "句子数量",
                            value: this.auditTaskCount
                        };
                        break;

                    case this.pathId.scoring:
                        return {
                            task: "评价",
                            countname: "句子数量",
                            value: this.scoringTaskCount
                        };
                        break;
                }
            },
            isOver() {
                switch (parseInt(this.tid, 10)) {

                    case this.pathId.sentence:
                        return this.sentenceIsOver;
                        break;

                    case this.pathId.rewrite:
                        return this.rewriteIsOver;
                        break;

                    case this.pathId.synonym:
                        return this.synonymIsOver;
                        break;

                    case this.pathId.audit:
                        return this.auditIsOver;
                        break;

                    case this.pathId.scoring:
                        return this.scoringIsOver;
                        break;
                }
            },
            list() {
                switch (parseInt(this.tid, 10)) {

                    case this.pathId.sentence:
                        return this.sentenceFinished;
                        break;

                    case this.pathId.rewrite:
                        return this.rewriteFinished;
                        break;

                    case this.pathId.synonym:
                        return this.synonymFinished;
                        break;

                    case this.pathId.audit:
                        return this.auditFinished;
                        break;

                    case this.pathId.scoring:
                        return this.scoringFinished;
                        break;

                }
            },
            ...mapGetters(["sentenceFinished", "sentenceFinishedPage", "sentenceTaskCount", "sentenceIsOver", "synonymFinished", "synonymFinishedPage", "synonymTaskCount", "synonymIsOver", "auditFinished", "auditFinishedPage", "auditTaskCount", "auditIsOver", "scoringFinished", "scoringFinishedPage", "scoringTaskCount", "scoringIsOver", "rewriteFinished", "rewriteFinishedPage", "rewriteTaskCount", "rewriteIsOver"]),

        },
        watch:{
            "tid":function(n, o){
                console.log(n, o)
                if(n!==o){
                    this.loadMore();
                }
            }
        },
        mounted() {
            console.log(111111)
            this.loadMore();
        },
        updated() {
            this.$nextTick(() => {
                if (this.reqCount<2 && !this.error && !this.loading && (_.isNil(this.list) || this.list.length === 0)) {
                    this.loadMore();
                    this.reqCount++;
                }
            });
        },
        methods: {
            // 详情页
            toDetailPage(id) {
                switch (parseInt(this.tid, 10)) {

                    case this.pathId.sentence:
                        this.$router.push("/juzix/" + id);
                        break;

                    case this.pathId.rewrite:
                        this.$router.push("/gaixiex/" + id);
                        break;

                    case this.pathId.synonym:
                        this.$router.push("/tongyix/" + id);
                        break;

                    case this.pathId.audit:
                        this.$router.push("/shenhex/" + id);
                        break;

                    case this.pathId.scoring:
                        this.$router.push("/pingjiax/" + id);
                        break;
                }
            },
            getCurPage() {
                switch (parseInt(this.tid, 10)) {
                    case this.pathId.sentence:
                        return this.sentenceFinishedPage + 1;
                        break;

                    case this.pathId.rewrite:
                        return this.rewriteFinishedPage + 1;
                        break;

                    case this.pathId.synonym:
                        return this.synonymFinishedPage + 1;
                        break;

                    case  this.pathId.audit:
                        return this.auditFinishedPage + 1;
                        break;

                    case this.pathId.scoring:
                        return this.scoringFinishedPage + 1;
                        break;
                }
            },

            loadMore() {
                // let page = this.getCurPage();
                let page = 1;
                // 返回数量不够 size:10 那么就不调用
                // if (!this.isOver) {

                this.loading = true;
                this.error = false;
                // todo  滑动加载
                if (!this.error) {
                    this.getMyFinishedTasks({
                        type: this.tid,
                        page: page,
                        size: 10000,
                        time: Date.now()
                    }).then(() => {
                        this.loading = false;

                    }, () => {
                        this.loading = false;
                        this.error = true;
                    });
                }

                // } else {
                //     this.finished = true;
                //
                // }
            },
            ...mapActions(["getMyFinishedTasks"]),
            ...mapMutations([""])

        }
    }
</script>

<style lang="scss" scoped>
    .wan {
        overflow: hidden;
        padding: 0 20px 20px;
        background: #f7f7fa;
    }

    .wan-nav {
        background: transparent;

        &:after {
            border-bottom: none;
        }
    }

    #swrapper {
        margin-top: 46px;
    }

    #scroller {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        width: 100%;
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
    }

    .renwu-box {
        width: 100%;
        height: 105px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 3px 0px rgba(21, 55, 153, 0.1);
        border-radius: 14px;
        border-top: 1px solid transparent;
        padding: 0 20px 20px;

        .icon {
            width: 70px;
            height: 70px;
            margin-top: 18px;
            float: left;
        }

        .content1 {
            height: 100%;
            position: relative;

            .name {
                margin-left: 15px;
                color: #8C8B90;
                font-size: 20px;
            }

            .num {
                color: #4B4E5F;
                font-size: 36px;
                margin-left: 10px;
            }


            .rwl-box {
                height: 105px;
                line-height: 105px;
                float: left;
                margin-left: 45px;
            }

            .rwl-box:first-child {
                margin-left: 30px;
            }
        }
    }

</style>

<style>
    .van-list__error-text, .van-list__finished-text, .van-list__loading-text, .van-list__loading {
        clear: both;
    }
</style>

<style lang="scss" scoped>

    .rw-list {
        width: 100%;

        .item {
            height: 90px;
            width: 100%;
            padding: 20px 0 10px;
            border-bottom: 1px solid #DDDDDD;

            .text1 {
                width: 100%;
                font-size: 16px;
                color: #3F4046;
                font-weight: 400;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: left;
            }

            .text2 {
                height: 20px;
                color: #8C8B90;
                font-size: 12px;
                margin-top: 5px;

                .num {
                    margin-left: 10px;
                }
            }
        }
    }

    .juzipc-list {
        background: #fff;
        padding: 0 90px 50px;
        text-align: left;
        margin-top: 35px;
        box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
        border-radius: 6px;

        .item {
            height: 126px;
            border-bottom: 1px solid #DDDDDD;

            .title {
                font-size: 16px;
                color: rgba(63, 64, 70, 1);
                line-height: 22px;
                margin-top: 33px;
                margin-bottom: 20px;
                cursor: pointer;
            }

            .particulars {
                font-size: 14px;
                color: rgba(140, 139, 144, 1);
                line-height: 17px;

                span {
                    margin-right: 15px;
                }
            }

            .shenhe-btn {
                margin-top: 45px;
                border: 1px solid #2DB652;
                color: #2DB652;
                background: #fff;
            }

            .shenhe-no-btn {
                margin-top: 45px;
                border: 1px solid #FFA002;
                color: #FFA002;
                background: #fff;
                cursor: default;
            }

        }
    }
</style>