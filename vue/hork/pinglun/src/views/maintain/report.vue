<template>
    <div class="maintain">
        <div class="task-list-box" v-loading="loading">
            <el-row>
                <el-col :span="24">
                    <div class="task-top">
                        <p class="title">
                            <span v-if="project">{{project}}-</span>
                            <span v-if="supplier && !isC">{{supplier}}-</span>
                            <span v-if="date">{{dateName}}</span>-维护统计报告</p>

                        <div v-if="!isD&&!isC">
                            <el-button class="search" @click="msgInfrom(1)" v-if="$route.query.supplierId"><span
                                    class="icon-daochu2 iconfont"></span>通知供应商
                            </el-button>
                            <el-button class="search" @click="msgInfrom(0)">通知客户</el-button>
                        </div>
                        <el-button class="search" @click="exportExcel">导出报告</el-button>

                    </div>
                </el-col>
            </el-row>
            <!-- 任务列表折叠 -->
            <el-row>
                <el-col :span="24">
                    <div class="task-list">
                        <div class="task-tebal">
                            <el-row class="task-box">
                                <el-col :span="1">
                                    <div class="task-num fl task-topbar">
                                        <div>
                                            &nbsp;
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="4">
                                    <div class="task-title-time fl task-topbar">
                                        <div>
                                            标题
                                        </div>
                                    </div>
                                </el-col>

                                <el-col :span="3">
                                    <div class="task-platformc fl task-topbar">平台</div>
                                </el-col>

                                <el-col :span="2">
                                    <div class="task-name-fans fl task-topbar">
                                        <div>
                                            作者
                                        </div>
                                    </div>
                                </el-col>

                                <el-col :span="2">
                                    <div class="task-percent-proportion fl task-topbar">
                                        <div>
                                            占比
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="task-percent-proportion fl task-topbar">
                                        <div>
                                            数量
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="task-percent-proportion fl task-topbar">
                                        <div>
                                            实际数量
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="task-percent-proportion fl task-topbar">
                                        <div>
                                            截图数
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="2">
                                    <div class="task-percent-proportion fl task-topbar">
                                        <div>
                                            操作
                                        </div>
                                    </div>
                                </el-col>


                            </el-row>
                        </div>
                        <el-collapse v-model="activeNames">
                            <el-collapse-item v-for="(item, index) in maintainsList" :key="index" :name="index">
                                <template slot="title">
                                    <el-row class="task-box">
                                        <el-col :span="1">
                                            <div class="task-num fl task-topbar">{{index+1}}</div>
                                        </el-col>
                                        <el-col :span="4">
                                            <div class="task-title-time fl task-topbar">
                                                <div class="task-title" @click.prevent="toUrl(item.url)">
                                                    {{item.title}}
                                                </div>
                                            </div>
                                        </el-col>

                                        <el-col :span="3">
                                            <div class="task-platformc fl task-topbar"
                                                 :class="{'task-name': item.iskeyplatform}">{{item.platform}}
                                            </div>
                                        </el-col>

                                        <el-col :span="2" style="height:70px;">
                                            <div class="task-name-fans fl task-topbar">
                                                <div :class="{'task-name': item.iskeyauthor}">
                                                    {{item.author}}
                                                </div>
                                            </div>
                                        </el-col>

                                        <el-col :span="2">
                                            <div class="fl task-topbar"
                                                 :class="{'task-percent-proportion':item.proportion<item.projectproportion*100}">
                                                <div class="task-percent">
                                                    {{item.proportion}}%
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </template>
                                <div class="task-child-box">
                                    <el-row class="task-child-item" v-for="(task, i) in item.tasks" :key="i">
                                        <el-col :span="1">&nbsp;</el-col>
                                        <el-col :span="4">
                                            <div class="child-time">
                                                <!--任务类型-->
                                                <span>{{task.typedescription}}</span>&nbsp;
                                                <!--账号质量-->
                                                <span>{{task.accountqualitydescription}}</span>
                                                <span>{{task.ismachinelikeTxt}}</span>
                                            </div>
                                        </el-col>
                                        <el-col :span="3">
                                            <!--供应商-->
                                            <div v-if="!isC" class="child-type">{{task.suppliernames}}</div>
                                            <div v-else>&nbsp;</div>
                                        </el-col>
                                        <el-col :span="2">
                                            <!--任务状态-->
                                            <div class="child-supplier">{{task.taskstatusdescription}}</div>
                                        </el-col>
                                        <el-col :span="2">
                                            <!--任务状态-->
                                            <div>&nbsp;</div>
                                        </el-col>
                                        <!--数量-->
                                        <el-col :span="2">
                                            <div>
                                                {{task.requirementcount}}
                                            </div>
                                        </el-col>
                                        <!--实际数量-->
                                        <el-col :span="2">
                                            <div>
                                                {{task.finishedcount}}
                                            </div>
                                        </el-col>
                                        <!--截图数量-->
                                        <el-col :span="2">
                                            <div :class="{red:task.requirementscreenshotcount>task.screenshotcount && task.type!=1}">
                                                {{task.type==1?"-":task.screenshotcount}}
                                            </div>
                                        </el-col>

                                        <el-col :span="6">
                                            <div class="child-check" @click="toView(item, task)">查看</div>
                                        </el-col>
                                    </el-row>

                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 底部 -->
        <bottom></bottom>
    </div>
</template>


<script>
    import axios from 'axios';
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
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

    import bottom from "@/components/bottom";
    import {toDay} from "@/utils/index";


    export default {
        name: "list",
        data() {
            return {
                loading: false,
                maintainsList: [],
                activeNames: [],
                projectDic: [],
                supplierDic: [],
                project: "",
                supplier: "",

                projectId: this.$route.query.projectId,
                supplierId: this.$route.query.supplierId,
                date: this.$route.query.date,
                dateName: "",
                platform: this.$route.query.platform,
                proportionStatus: this.$route.query.proportionStatus,
                maintainTaskStatus: this.$route.query.maintainTaskStatus,
                newsId: this.$route.query.newsId,
            }
        },
        components: {
            bottom
        },
        computed: {
            ...mapGetters(["userProject", "userRole", "isD", "isC", "authorization"])
        },

        watch: {
            "userProject": function (n, o) {
                if (this.userProject && !_.isEqual(n, o)) {
                    this.init();
                }
            }
        },
        mounted() {
            if (this.date) {
                this.dateName = toDay(this.date);
            }

            this.init();

            // 供应商执行员的任务类型不同，相互不能看对方的报告。供应商id不在他自己的项目供应商中。
            // 255：发布供应商账号点开点赞供应商维护统计报告时，前端需给出未授权提示信息
            // if (this.userRole == "供应商执行员" && this.supplierId) {
            //     let isOwn = _.some(this.userProject, (v) => {
            //         return _.some(v.children, (k) => {
            //             return k.key === this.supplierId;
            //         })
            //     });
            //
            //     if (!isOwn) {
            //         this.$message("未授权");
            //         this.$router.push({name:"distributor"});
            //     }
            // }

            // if (this.userProject) {
            //
            // }

        },

        methods: {

            init() {

                this.projectDic = this.userProject;

                if (this.projectId) {
                    let pj = _.find(this.projectDic, {key: Number(this.projectId)});
                    if (_.isUndefined(pj)) {
                        this.$message("未授权");
                        return;
                    }
                    this.project = pj.value;
                    this.supplierDic = pj.children;

                    if (this.supplierId) {
                        this.supplier = _.find(this.supplierDic, {key: Number(this.supplierId)}).value;
                    }
                }
                this.getMaintains();

            },
            // 查看
            toView(item, task) {
                // 0通用 1撰写 2发布 3点赞 4反向
                switch (task.type) {
                    case 1:
                        this.$router.push("/sub/view-write/" + task.id + "/report");
                        break;
                    case 2:
                        this.$router.push("/sub/view-publish/" + task.id + "/report");
                        break;
                    case 3:
                        this.$router.push("/sub/view-like/" + task.id + "/report");
                        break;
                    case 4:
                        this.$router.push("/sub/view-reverse/" + task.id + "/report");
                        break;
                }

            },

            // 维护任务列表
            getMaintains() {
                this.loading = true;
                this.GetReport({
                    ProjectId: this.projectId,
                    SupplierId: this.supplierId === "-1" ? "" : this.supplierId,
                    Date: this.date,
                    Platform: this.platform,
                    ProportionStatus: this.proportionStatus === "全部" ? "" : this.proportionStatus,
                    MaintainTaskStatus: this.maintainTaskStatus === "全部" ? "" : this.maintainTaskStatus,
                    NewsId: this.newsId,

                }).then((res) => {

                    this.maintainsList = _.map(res, (v) => {
                        v.proportion = (v.proportion * 100).toFixed(0);
                        if (v.author.length > 5) {
                            v.author = v.author.substr(0, 5) + "...";
                        }

                        v.tasks = _.map(v.tasks, (t) => {
                            if (_.isNil(t.ismachinelike)) {
                                t.ismachinelikeTxt = ""
                            } else if (t.ismachinelike) {
                                t.ismachinelikeTxt = "机器赞";
                            } else {
                                t.ismachinelikeTxt = "人工赞";
                            }
                            return t;
                        });

                        return v;
                    });
                    this.activeNames = _.map(this.maintainsList, (v, i) => i);

                    if (this.newsId) {
                        this.newsId = ""
                    }

                    this.loading = false;
                }).catch(err => {
                    this.$message.error(err.message)
                    this.loading = false;
                })
            },
            // 通知供应商
            msgInfrom(type) {
                if (this.maintainsList.length > 0) {
                    this.InformMsg({
                        "target": type,
                        "reporturl": location.href,
                        "date": this.date,
                        "projectid": this.projectId,
                        "supplierid": this.supplierId
                    }).then(() => {
                        this.$message("通知已发送");
                    });
                } else {
                    this.$message("无内容可发送");
                }
            },

            // 导出报告
            exportExcel() {
                let ProportionStatus = (_.isNil(this.proportionStatus) || this.proportionStatus === "全部") ? "" : this.proportionStatus;
                let MaintainTaskStatus = (_.isNil(this.maintainTaskStatus) || this.maintainTaskStatus === "全部") ? "" : this.maintainTaskStatus;

                window.open(config.apiPath() + `/reports/export?Date=${this.date}&ProjectId=${this.projectId}&SupplierId=${this.supplierId}&Platform=${this.platform}&ProportionStatus=${ProportionStatus}&MaintainTaskStatus=${MaintainTaskStatus}&NewsId=${this.newsId}&accessToken=${this.authorization}`);

                // axios({
                //     url: 'http://192.168.220.81/api/reports',
                //     method: "get",
                //     responseType: 'arraybuffer',
                //     headers: {'authorization': 'Bearer ' + this.authorization},
                //     params: {
                //         Date: this.date,
                //         ProjectId: this.projectId,
                //         SupplierId: this.supplierId,
                //         Platform: this.platform,
                //         ProportionStatus: ProportionStatus,
                //         MaintainTaskStatus: MaintainTaskStatus,
                //         NewsId: this.newsId,
                //         accessToken: this.authorization,
                //     }
                // }).then(function (res) {
                //     var data = new Uint8Array(res.data);
                //     var wb = XLSX.read(data, {
                //         type: "array"
                //     });
                //     console.log(wb);
                // });

            },

            toUrl(url) {
                window.open(url)
            },

            ...mapActions(["GetReport", "GetSuppliersDic", "GetProjectsDic", "InformMsg"]),
        }
    }
</script>

<style lang="scss">
    .buchong {
        color: #e5715e !important;
    }

    .maintain-top .el-form-item__label {
        float: none !important;
        text-align: left !important;
        color: #333C48 !important;
    }

    .maintain-top .el-form-item__content {
        margin-left: 0 !important;
    }

    // .input-icon {
    //     .el-input__prefix {
    //         right: -178px;
    //     }
    // }
    // .el-input--prefix .el-input__inner {
    //     padding-left: 15px;
    // }
    .task-list-box .el-collapse-item__header {
        height: 80px !important;
        text-align: left;
    }

    .task-list-box .el-collapse-item__wrap {
        background: #F3F4F8 !important;
    }

    .task-list-box .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #6967CE !important;
    }

    // 重要按钮
    .urgent-btn {
        width: 40px;
        height: 20px;
        background: #d55742;
        border-radius: 3px;
        overflow: hidden;
        position: absolute;
        top: 50%;
        margin-top: -10px;

        span {
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            color: #fff;
            line-height: 20px;
            position: absolute;
            top: 0;
            left: 0;
        }

        span:nth-child(1) {
            background: #e5715e;
        }

        span:nth-child(2) {
            margin-left: 14px;
        }
    }

    // 底部文字
    .bottom-text {
        margin: 50px 0 38px 0;
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(150, 160, 173, 1);
        line-height: 20px;
        text-align: center;
    }

    .red {
        color: #d35847;
    }
</style>

<style lang="scss" scoped>
    // 定义的全局变量
    $btn-color: #6967CE;
    $border-color: #E5E7F3;
    $operation-color: #0179FF;

    .el-form {
        height: 105px;
        border-bottom: 1px solid #CACFE7;
        position: relative;

        .search {
            width: 150px;
            height: 36px;
            background-color: $btn-color;
            border-radius: 4px;
            font-size: 14px;
            color: #fff;
            border: none;
            position: absolute;
            bottom: -56px;
            right: 0;
        }

        // .search2 {
        //      background-color: #fff;
        //      border: 1px solid $btn-color;
        //      color: $btn-color;
        // }
    }

    .el-form-item {
        width: 15%;
        float: left;
        margin-right: 2%;
        text-align: left;
    }

    .el-form-item:nth-last-of-type(1) {
        margin-right: 0;
    }

    .maintain {
        width: 91%;
        margin: 100px 20px 0 190px;
        // position: absolute;
        // top: 100px;
        // left: 160px;
    }

    .task-top, .task-list {
        width: 96%;
        margin: 0 2% 0;

        .task-tebal {
            text-align: left;
            padding-right: 20px;
        }
    }


    .maintain-top {
        height: 200px;
        padding: 20px 30px;
        background: #fff;
        border: 1px solid $border-color;

    }

    .task-box {
        width: 100%;
    }

    .task-list-box {
        width: 100%;
        margin-top: 20px;
        background: #fff;
        border: 1px solid rgba(229, 231, 243, 1);

        .task-top {
            height: 110px;
            position: relative;

            .title {
                color: #2C343D;
                font-size: 20px;
                line-height: 110px;
                float: left;
            }

            .el-input {
                float: right;
                width: 220px;
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

        .task-topbar {
            width: 100%;
            line-height: 70px;
            position: relative;
        }

        .task-topbar2 {
            width: 100%;
            position: absolute;
            top: 25px;
            left: 0;
        }

        .task-num {
            font-size: 18px;
            font-weight: bold;
            color: rgba(93, 83, 134, 1);
        }

        .task-time {
            font-size: 14px;
            font-weight: 400;
            color: rgba(34, 34, 34, 1);
        }

        .task-title-time {
            .task-title {
                font-size: 14px;
                font-weight: normal;
                color: rgba(34, 34, 34, 1);
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }

            .task-time2 {
                font-size: 12px;
                font-weight: 400;
                color: rgba(127, 143, 164, 1);
            }
        }

        .task-platformc {
            font-size: 14px;
            font-weight: normal;
            color: #45B854;
            color: #2E323F;
        }

        .task-name-fans {
            width: 100px;

            .task-name {
                font-size: 14px;
                font-weight: normal;
                color: #45B854;
            }

            .task-fans {
                font-size: 12px;
                font-weight: 400;
                color: rgba(127, 143, 164, 1);
            }
        }

        .task-percent-proportion {
            .task-percent {
                font-size: 14px;
                font-weight: bold;
                color: rgba(211, 88, 71, 1);
            }

            .task-proportion {
                font-size: 12px;
                font-weight: 400;
                color: rgba(127, 143, 164, 1);
            }
        }

        .task-caozuo {
            font-size: 14px;
            font-weight: 400;
            color: $operation-color;
            cursor: pointer;
        }
    }

    // 子任务样式
    .task-child-box {
        .task-child-item {
            width: 100%;
            height: 57px;
            line-height: 57px;
            text-align: left;
        }

        .child-time {
            font-size: 14px;
            font-weight: 400;
            color: #93979D;
            position: relative;

            .child-dot {
                width: 6px;
                height: 6px;
                background: rgba(230, 230, 230, 1);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -3px;
                margin-left: -110px;
            }

            .child-line {
                width: 1px;
                height: 39px;
                background: #000;
                opacity: 0.1;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -45px;
                margin-left: -110px;
            }
        }

        .child-type {
            font-size: 14px;
            font-weight: 400;
            color: #4B5971;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            padding-right: 20px;
        }

        .child-supplier {
            font-size: 14px;
            font-weight: 400;
            color: #4B5971;
        }

        .child-state {
            font-weight: 400;
            color: rgba(105, 119, 143, 1);
            opacity: 0.8;
        }

        .child-check {
            height: 15px;
            font-size: 14px;
            font-weight: 400;
            color: $operation-color;
            cursor: pointer;
            float: left;
            margin-right: 20px;
        }
    }

    // 全部展开/折叠
    .unfold-all {
        width: 80px;
        height: 16px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(51, 60, 72, 1);
        position: absolute;
        top: -20px;
        right: 35px;
        cursor: pointer;

        span {
            display: inline-block;
            width: 100%;
            text-align: right;
            position: absolute;
            top: 0 !important;
            left: 0 !important;
        }
    }

    // 分页
    .pagination-box {
        height: 32px;
        text-align: right;
        margin: 20px;

    }

</style>