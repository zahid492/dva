<template>
    <div class="create-maintain-box">
        <div class="create-maintain">
            <div>
                <el-row>
                    <el-col :span="24">
                        <div class="task-top">
                            <el-button class="search" @click="openUrl">打开链接</el-button>
                            <el-button class="search" @click="actCrawl">采集</el-button>
                            <div @keyup.enter="actCrawl">
                                <el-input
                                        size="medium"
                                        class="input-icon"
                                        placeholder="请输入原文链接"
                                        v-model="url">
                                </el-input>
                            </div>

                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="link-title">{{coreNews.title}}</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <div class="link-author">{{coreNews.platform}} {{coreNews.author}}</div>
                    </el-col>
                </el-row>
                <!-- todo done 核心暂时隐藏 04-23 -->
                <!--<div class="core-list">-->
                    <!--<div class="core-item" v-for="(news, index) in coreNews.coresentences">-->
                        <!--<el-row>-->
                            <!--<el-col :span="24">-->
                                <!--<div class="core-num">-->
                                    <!--核心{{index+1}}-->
                                <!--</div>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                        <!--<el-row>-->
                            <!--<el-col :span="24">-->
                                <!--<div class="core-text">{{news}}</div>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                    <!--</div>-->
                <!--</div>-->

                <el-row  v-if="coreNews.mediaview">
                    <el-col :span="24">
                        <div class="core-diaoxing">
                            <span class="diaoxing">调性</span>
                            <!-- 正面类为active -->
                            <div class="diaoxing-btn"
                                 @click="actMedia(1)"
                                 :class="{active:coreNews.mediaview=='正面'}">
                                <img src="@/assets/urgent2.png" alt="" class="diaoxing-icon">
                                <span>正面</span>
                            </div>
                            <!-- 负面类为active1 -->
                            <div class="diaoxing-btn"
                                 @click="actMedia(0)"
                                 :class="{active1:coreNews.mediaview=='负面'}">
                                <img src="@/assets/urgent.png" alt="" class="diaoxing-icon">
                                <span>负面</span>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- btn-box -->
            <el-row v-if="coreNews.mediaview">
                <el-col :span="24">
                    <div class="core-btn-box">
                        <el-button class="core-btn" @click="toAct(1)">去撰写</el-button>
                        <el-button class="core-btn" @click="toAct(2)">去发布</el-button>
                        <el-button class="core-btn" @click="toAct(3)">去点赞</el-button>
                        <el-button class="core-btn" @click="toAct(4)">去反向</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 底部 -->
        <bottom></bottom>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Row,
        Col,
        Form,
        FormItem,
        Input,
        InputNumber,
        Select,
        DatePicker,
        Option,
        OptionGroup,
        Collapse,
        CollapseItem,
        Pagination,
        Loading
    } from "element-ui";

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Select);
    Vue.use(DatePicker);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Collapse);
    Vue.use(CollapseItem);
    Vue.use(Pagination);
    Vue.use(Loading);

    import validator from 'validator';
    import bottom from "@/components/bottom"


    export default {
        name: "create-maintain",
        data() {
            return {
                prevUrl:"",
                url: "",
                coreNews: {}
            }
        },
        props: ["projectid"],
        components: {
            bottom
        },
        mounted() {
            this.url = "";
        },
        methods: {
            // 打开链接
            openUrl() {
                if(_.trim(this.url).length===0){
                    this.$message("链接地址不能为空")
                    return;
                }

                if (validator.isURL(this.url)) {
                    window.open(this.url);
                }
            },
            // 采集新闻
            actCrawl() {
                let loadingInstance = Loading.service({
                    background:"none"
                });
                if(_.trim(this.url).length==0){
                    this.$message("请输入新闻链接");
                    return;
                }

                if(this.url === this.prevUrl){
                    this.$message("已经采集过");
                    this.$nextTick(() => {
                        loadingInstance.close();
                    });
                    return;
                }

                if (validator.isURL(this.url)) {
                    this.CrawlNews({
                        url: this.url,
                        projectid: parseInt(this.projectid, 10)
                    }).then((res) => {
                        this.prevUrl = this.url;
                        this.coreNews = res;

                        this.$nextTick(() => {
                            loadingInstance.close();
                        });

                    }).catch(err => {
                        this.$nextTick(() => {
                            loadingInstance.close();
                        });
                        this.$message(err.message)
                    })
                }
            },
            // 创建维护任务
            toAct(tid) {
                // 0通用 1撰写 2发布 3点赞 4反向
                let newsid = this.coreNews.newsid;

                switch (tid) {
                    case 1:
                        this.$router.push("/create-write/" + newsid + "/" + this.projectid);
                        break;
                    case 2:
                        this.$router.push("/create-publish/" + newsid + "/" + this.projectid);
                        break;
                    case 3:
                        this.$router.push("/create-like/" + newsid + "/" + this.projectid);
                        break;
                    case 4:
                        this.$router.push("/create-reverse/" + newsid + "/" + this.projectid);
                        break;

                }

            },
            // 调性调整
            actMedia(m) {
                if (!_.isNil(this.coreNews.newsid)) {
                    this.UpdateMediaView({
                        id: this.coreNews.newsid
                    }).then(() => {
                        if (m == 1) {
                            this.coreNews.mediaview = "正面"
                        } else {
                            this.coreNews.mediaview = "负面"
                        }
                        this.$message("调性调整成功")
                    })
                } else {
                    this.$message("请先进行新闻采集")
                }

            },

            ...mapActions(["CrawlNews", "UpdateMediaView"])
        }
    }
</script>

<style lang="scss" scoped>
    // 定义的全局变量
    $btn-color: #6967CE;
    $border-color: #E5E7F3;
    $operation-color: #0179FF;
    .create-maintain-box {
        width: 91%;
        margin: 100px 20px 0 190px;

        .create-maintain {
            width: 100%;
            background: #fff;
            padding: 50px 150px 50px 100px;
            border: 1px solid #E5E7F3;
            border-radius: 4px;
            text-align: left;

            .link-box {
                width: 520px;
                height: 46px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(206, 208, 218, 1);
                border-radius: 4px;
                padding: 0 20px;
            }

            .task-top {
                height: 110px;
                position: relative;

                .title {
                    color: #2C343D;
                    font-size: 20px;
                    width: 83px;
                    line-height: 110px;
                    float: left;
                }

                .el-input {
                    float: left;
                    width: 60%;
                    margin-top: 37px;
                }

                .search {
                    width: 150px;
                    height: 36px;
                    background-color: $btn-color;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #fff;
                    border: none;
                    float: right;
                    margin: 37px 0 0 20px;
                }
            }

            .link-title {
                font-size: 32px;
                font-weight: bold;
                color: #2C343D;

            }

            .link-author {
                height: 20px;
                font-size: 16px;
                font-weight: 400;
                color: #222222;
                line-height: 20px;
                margin: 20px 0;
            }

            .core-list {
                width: 100%;
            }

            .core-item {
                width: 100%;

                .core-num {
                    height: 50px;
                    line-height: 50px;
                    font-size: 20px;
                    font-weight: normal;
                    color: #222222;
                    border-bottom: 2px solid #6967CE;
                }

                .core-text {
                    font-size: 16px;
                    font-weight: 400;
                    color: #222222;
                    line-height: 28px;
                    margin: 15px 0;
                }
            }

            .core-diaoxing {
                height: 50px;
                line-height: 50px;

                .active {
                    background: #6967CE !important;
                    color: #fff;
                }

                .active1 {
                    background: #E10601 !important;
                    color: #fff !important;
                }
            }

            .diaoxing {
                height: 50px;
                line-height: 50px;
                font-size: 20px;
                font-weight: normal;
                color: #222222;
                float: left;
                margin-right: 18px;

            }

            .diaoxing-btn {
                width: 150px;
                height: 46px;
                font-size: 16px;
                color: #6967CE;
                float: left;
                text-align: center;
                border: 1px solid #6967CE;
                border-radius: 4px;
                margin-right: 49px;
                position: relative;
                cursor: pointer;

            }

            .diaoxing-btn:nth-last-child(1) {
                color: #E10601;
                border: 1px solid #E10601;
            }

            .diaoxing-icon {
                display: none;

            }

            .active .diaoxing-icon {
                position: absolute;
                right: 0;
                bottom: 0;
                display: block;
            }

            .active1 .diaoxing-icon {
                position: absolute;
                right: 0;
                bottom: 0;
                display: block;
            }


        }

        .core-btn-box {
            width: 100%;
            height: 100px;
            background: rgba(202, 207, 231, 0.2);
            text-align: left;
            padding: 27px 20px;
            margin-top: 48px;

            .core-btn {
                width: 150px;
                height: 46px;
                background: rgba(105, 103, 206, 1);
                border-radius: 4px;
                color: #fff;
                font-size: 16px;
            }
        }

    }
</style>