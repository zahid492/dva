<template>
    <div class="wan">
        <van-nav-bar
                class="wan-nav"
                title=""
                :fixed="true"
                :z-index="1000"
                left-text=""
                left-arrow
                @click-left="toPrevPage"
        ></van-nav-bar>
        <div id="swrapper" ref="wrapper">
            <div id="scroller">
                <div class="renwu-box">
                    <div class="icon">
                        <icon-type :tid="tid"></icon-type>
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
                <!--<fcell-->
                        <!--:list="list"-->
                        <!--:finished="finished"-->
                        <!--:loading.sync="loading"-->
                        <!--:error.sync="error"-->
                        <!--@loadData="loadMore"-->
                <!--&gt;</fcell>-->
                <div class="rw-list">
                    <div class="item" v-for="item in list" :key="item.id">
                        <p class="text1">{{item.title}}</p>
                        <div class="text2">
                            <span class="danhao fl">单号：{{item.number}}</span>
                            <span class="num fl">数量：{{item.count}}</span>
                            <span class="num fr">{{item.statusName}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h50"></div>
    </div>
</template>

<script>
    import Vue from "vue";
    import BScroll from 'better-scroll'
    import {Row, Col, NavBar} from "vant";

    import {mapActions, mapGetters} from "vuex";
    import bottomNav from "@/components/bottom-nav.vue";
    import fcell from "@/components/fcell.vue";
    import iconType from "@/components/icon-type.vue";

    Vue.use(Row);
    Vue.use(NavBar);
    Vue.use(Col);


    export default {
        name: "Want",
        props: ["tid"],
        components: {
            fcell,
            "bottom-nav": bottomNav,
            "icon-type": iconType,
        },
        data() {
            return {
                myScroll: null,
                loading: false,
                finished: false,
                error: false,
            }
        },
        computed: {
            countsObj() {
                switch (this.tid) {
                    case '1':
                        return {
                            task: "句子对",
                            countname:"句子数量",
                            value: this.sentenceTaskCount
                        };
                        break;
                    case '2':
                        return {
                            task: "同义词",
                            countname:"同义词数量",
                            value: this.synonymTaskCount
                        };
                        break;
                    case '3':
                        return {
                            task: "审核",
                            countname:"句子数量",
                            value: this.auditTaskCount
                        };
                        break;
                }
            },
            isOver() {
                switch (this.tid) {
                    case '1':
                        return this.sentenceIsOver;
                        break;
                    case '2':
                        return this.synonymIsOver;
                        break;
                    case '3':
                        return this.auditIsOver;
                        break;
                }
            },
            list() {
                switch (this.tid) {
                    case '1':
                        return this.sentenceFinished;
                        break;
                    case '2':
                        return this.synonymFinished;
                        break;
                    case '3':
                        return this.auditFinished;
                        break;
                }
            },
            ...mapGetters(["sentenceFinished", "sentenceFinishedPage", "sentenceTaskCount", "sentenceIsOver", "synonymFinished", "synonymFinishedPage", "synonymTaskCount", "synonymIsOver", "auditFinished", "auditFinishedPage", "auditTaskCount", "auditIsOver"]),

        },
        mounted() {
            // console.log(this.tid)
            this.loadMore();
            this.$nextTick(() => {
                let that = this;

                this.myScroll = new BScroll(this.$refs.wrapper, {
                    click: true,
                    pullUpLoad: {
                        threshold: 50
                    },
                    tap: true,
                    probeType: 2,
                    scrollbar: true,
                    mouseWheel: {
                        speed: 20,
                        invert: false,
                        easeTime: 300
                    },

                });

                this.myScroll.on("pullingUp", ()=>{
                    this.loadMore();
                });

            })
        },
        methods: {
            toPrevPage() {
                this.$router.push("/my")
            },
            getCurPage() {
                switch (this.tid) {
                    case "1":
                        return this.sentenceFinishedPage + 1;
                        break;
                    case "2":
                        return this.synonymFinishedPage + 1;
                        break;
                    case "3":
                        return this.auditFinishedPage + 1;
                        break;
                }
            },

            loadMore() {
                let page = this.getCurPage();
                console.log("load:", page)
                if (!this.isOver) {
                    this.loading = true;
                    this.error = false;
                    this.getMyFinishedTasks({
                        type: this.tid,
                        page: page,
                        size: 10,
                    }).then(() => {
                        this.loading = false;
                        this.myScroll.finishPullUp();
                        this.myScroll.refresh();
                    }, () => {
                        this.error = true;
                    });
                } else {
                    this.finished = true;

                }

            },
            ...mapActions(["getMyFinishedTasks"])
        }
    }
</script>

<style lang="scss" scoped>
    .wan {
        height: 100vh;
        overflow: hidden;
        padding: 0 20px 20px;
        background: #f7f7fa;
    }

    .wan-nav {
        background:transparent;
        &:after{
            border-bottom: none;
        }
    }

    #swrapper {
        width: 100%;
        height: calc(100% - 78px);
        overflow: hidden;
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
                font-size: 14px;
            }

            .num {
                color: #4B4E5F;
                font-size: 18px;
            }

            .rwl-box {
                height: 30px;
                width: 100%;
            }

            .rwl-box:first-child {
                margin-top: 30px;
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
</style>