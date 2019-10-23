<template>
    <div class="maintain main-distributor">
        <el-row>
            <el-col :span="24">
                <div class="maintain-top">
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="平台">
                            <el-input size="small" v-model="form.Platform" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select size="small"
                                       v-model="form.TaskStatus"
                                       placeholder="请选择状态">
                                <el-option
                                        v-for="item in taskStatusDic"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="任务创建时间">
                            <el-col :span="24">

                                <el-date-picker
                                        :editable="false"
                                        :clearable="false"
                                        size="small"
                                        type="date"
                                        placeholder="选择日期"
                                        :default-value="dateDefault"
                                        value-format="timestamp"
                                        v-model="form.Date"
                                        style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-button class="search" @click="getSupTasks(1)"><span
                                class="icon-search_icon iconfont"></span>搜索
                        </el-button>
                    </el-form>

                </div>
            </el-col>
        </el-row>
        <div class="user-manage">
            <el-row>
                <el-col :span="24">
                    <div class="task-top">
                        <p class="title">任务列表</p>

                        <search
                                placeholder="标题模糊搜索"
                                :search-txt.sync="form.key"
                                @keysearch="getSupTasks(1)"
                        ></search>

                    </div>
                </el-col>
            </el-row>

            <div class="table-box">
                <el-table
                        v-loading="loading"
                        :data="supTasks"
                        style="width: 90%"
                        class="user-table">
                    <el-table-column prop="id" label="" width="70"></el-table-column>
                    <el-table-column prop="tasktime" label="创建日期"></el-table-column>
                    <el-table-column prop="title" label="标题">
                        <template slot-scope="scope">
                            <span style="cursor:pointer"
                                  @click.prevent.stop="goTo(scope.row.url)">{{scope.row.title}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tasktypeName" label="任务类型">
                        <template slot-scope="scope">
                            <div class="urgent-btn" v-if="scope.row.isurgent">
                                <span>！</span>
                                <span>重要</span>
                            </div>
                            <span class="child-type" :style="{marginLeft: scope.row.isurgent?'50px':0}">{{scope.row.tasktypeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="platform" label="平台">
                        <template slot-scope="scope">
                            <div class="task-platformc fl task-topbar">
                                <a :class="{'task-name': scope.row.iskeyplatform}">{{scope.row.platform?scope.row.platform:"-"}}</a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="author" label="作者">
                        <template slot-scope="scope">
                            <div class="task-platformc fl task-topbar">
                                <span :class="{'task-name': scope.row.iskeyauthor}">{{scope.row.author?scope.row.author:"-"}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remainingtime" label="任务状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.taskstatus==1?scope.row.remainingtime:"已完成"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200" class-name="distributor-act">
                        <template slot-scope="scope">
                            <div :class="{markdeletion:scope.row.markdeletion==1}">
                                <div class="edit-btn task-caozuo"
                                     v-if="scope.row.taskstatus===1" @click="toView(scope.row)">去完成
                                </div>
                                <div class="edit-btn task-caozuo"
                                     v-if="scope.row.taskstatus===2 && ((scope.row.screenshotcount>=scope.row.commentcount || scope.row.tasktype==1))"
                                     @click="toView(scope.row)">查看
                                </div>
                            </div>

                            <div class="buchong-btn task-caozuo"
                                 v-if="scope.row.taskstatus==2 && scope.row.screenshotcount<scope.row.commentcount && scope.row.tasktype!==1"
                                 @click="toView(scope.row)"><span class="icon-jietu iconfont"></span>补充截图
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                    <div class="pagination-box">
                        <div class="block">
                            <el-pagination
                                    background
                                    @size-change="()=>getSupTasks()"
                                    @current-change="()=>getSupTasks()"
                                    :current-page.sync="page"
                                    :page-sizes="[10, 15, 20]"
                                    :page-size.sync="size"
                                    layout="sizes, prev, pager, next"
                                    :total="count">
                            </el-pagination>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 底部 -->
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import {
        Message,
        MessageBox,
        Table,
        TableColumn,
        Button,
        ButtonGroup,
        Dialog,
        Form,
        FormItem,
        Radio,
        RadioGroup,
        RadioButton,
        Checkbox,
        CheckboxButton,
        CheckboxGroup,
        Option,
        Select,
        DatePicker,
        Pagination,
        Loading
    } from "element-ui";

    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Dialog);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Option);
    Vue.use(Select);
    Vue.use(DatePicker);
    Vue.use(Pagination);
    Vue.use(Loading);

    import search from "@/components/search";
    import {mm2time} from "@/utils/index";

    export default {
        name: "list",
        data() {
            return {
                loading: false,

                page: 1,
                size: 10,
                count: 0,
                dateDefault: !_.isNil(this.$route.query.date) ? this.$route.query.date + "000" : Date.now(),

                supTasks: [],
                taskStatusDic: [],
                taskTypeDic: [],
                newsId: this.$route.query.newsId || "",
                form: {
                    key: this.$route.query.keyword || "",
                    Platform: "",
                    TaskStatus: "-1",
                    Date: (this.$route.query.date == undefined ? null : this.$route.query.date + "000") || Date.now(),
                },
            }
        },
        computed: {
            ...mapGetters(["supplierSearchForm"]),
        },
        components: {
            search
        },
        mounted() {
            if (_.has(this.supplierSearchForm, "Date")) {
                this.setSearch();
            }

            this.GetMaintainStatusDic().then(res => {
                this.taskStatusDic = _.concat([{key: "-1", value: "全部"}], res);
                this.getSupTasks();
            });
            this.TaskTypeDic().then(res => {
                this.taskTypeDic = res;
            });
        },
        methods: {
            setSearch() {
                this.form = _.assign({}, this.supplierSearchForm)
            },
            // 供应商类型字典 0通用 1撰写 2发布 3点赞 4反向 完成, 查看, 补充截图
            toView(row) {

                this.SetSupplierSearchForm(this.form);
                switch (row.tasktype) {
                    case 1:
                        this.$router.push("/sub/view-write/" + row.taskid + "/sup");
                        break;
                    case 2:
                        this.$router.push("/sub/view-publish/" + row.taskid + "/sup");
                        break;
                    case 3:
                        this.$router.push("/sub/view-like/" + row.taskid + "/sup");
                        break;
                    case 4:
                        this.$router.push("/sub/view-reverse/" + row.taskid + "/sup");
                        break;
                }
            },

            //任务列表
            getSupTasks(ser) {
                if (ser) {
                    this.page = 1;
                }
                // if (_.isNil(this.form.Date) || this.form.Date == 0) {
                //     this.$message("请选择时间");
                //     return;
                // }

                this.SetSupplierSearchForm(_.assign({},this.form));

                this.loading = true;

                let status = this.form.TaskStatus === "-1" ? "" : this.form.TaskStatus;
                let opt = {
                    Platform: this.form.Platform,
                    Date: _.isNil(this.form.Date) || this.form.Date == 0 ? "" : (this.form.Date / 1000).toFixed(0),
                    TaskStatus: status,
                    Page: this.page,
                    Size: this.size,
                    Key: this.form.key,
                    NewsId: this.newsId,
                };
                this.GetSupTasks(opt).then((res) => {

                    this.supTasks = _.map(res.data, (v) => {
                        v.taskstatusName = _.find(this.taskStatusDic, {key: v.taskstatus}).value;
                        v.tasktypeName = _.find(this.taskTypeDic, {key: v.tasktype}).value;
                        v.remainingtime = mm2time(v.remainingtime);
                        if (v.title.length > 32) {
                            v.title = v.title.substr(0, 32) + "...";
                        }

                        return v;
                    });
                    this.count = res.count;
                    this.loading = false;

                    if (this.count == 0) {
                        this.$message("没有对应数据")
                    }
                }).catch(err => {
                    this.loading = false;
                    this.$message("数据错误")
                })
            },

            goTo(url) {
                if (url) {
                    window.open(url)
                }
            },

            ...mapActions(["GetSupTasks", "GetMaintainStatusDic", "TaskTypeDic", "SetSupplierSearchForm"]),

        }
    }
</script>

<style lang="scss">
    .distributor-act .cell {
        /*display: -webkit-box;*/
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
    }

    .maintain-top .el-form-item__label {
        float: none !important;
        text-align: left !important;
        color: #333C48 !important;
    }

    .maintain-top .el-form-item__content {
        margin-left: 0 !important;
    }

    .maintain .el-pagination.is-background .el-pager li:not(.disabled).active {
        background-color: #6967CE !important;
    }

    .task-list-box .el-collapse-item__header {
        height: 80px !important;
        text-align: left;
    }

    .task-list-box .el-collapse-item__wrap {
        background: #F3F4F8 !important;
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

    // 被删除样式
    .markdeletion {
        /*background: #ccc !important;*/
        cursor: no-drop;
    }

    // 被删除样式
    .markdeletion .task-caozuo {
        color: #888 !important;

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
            bottom: 22px;
            right: 0;
        }
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

    .main-distributor {
        margin: 100px 4.5% 0 !important;
    }

    .task-top, .task-list {
        width: 96%;
        margin: 0 2% 0;
    }

    .maintain-top {
        height: 165px;
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
                width: 83px;
                line-height: 110px;
                float: left;
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
            line-height: 70px;
            position: relative;
        }

        .task-topbar2 {
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
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
            }
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
                margin-left: -35px;
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
                margin-left: -32px;
            }
        }

        .child-type {
            font-size: 14px;
            font-weight: 400;
            color: #4B5971;
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
            font-family: MicrosoftYaHei;
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

    // 定义的全局变量
    $btn-color: #6967CE;
    $border-color: #E5E7F3;
    $operation-color: #0179FF;
    .maintain {
        width: 91%;
        text-align: left;
        margin: 100px 20px 0 190px;

        .el-input {
            width: 80%;
        }

        .mine .tab {
            height: 100px;
            line-height: 100px;
            /* background: ; */
            padding-left: 5%;
        }

        .tab_list {
            width: 100%;
            text-align: left;
        }

        .tab_list .item {
            font-size: 24px;
            font-weight: bold;
            float: left;
            margin-right: 30px;
            cursor: pointer;
        }

        .tab_list .item:hover {
            color: rgb(22, 132, 216);
        }

        .active {
            color: rgb(22, 132, 216);
        }

        .el-table td,
        .el-table th.is-leaf {
            border-bottom: 1px solid #EBEEF5;
        }

        .el-table--border th {
            border-right: 1px solid #EBEEF5;
        }

        .el-table--border td {
            border-right: 1px solid #EBEEF5;
        }

        .el-table--border {
            border: 1px solid #EBEEF5;
        }

        .block {
            text-align: right;
            margin: 30px -5px 48px 0;
        }

        .el-table td, .el-table th {
            padding: 5px 0 !important;
        }

        .el-table--striped .el-table__body tr.el-table__row--striped td {
            /* background: rgba(235, 241, 243, 0.945); */
            background: #f9fafb;
        }

        .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #e0e5f1;
        }

        .user-table {
            width: 80%;
            margin: 0 auto;
        }

        .add_btn {
            margin: 0 0 30px 5%;
        }

        .el-pagination.is-background .el-pager li:not(.disabled).active {
            background-color: $btn-color;
        }

    }

    .maintain .user-table {
        width: 100% !important;
    }

    .maintain .el-table tr {
        height: 66px !important;
    }

    .maintain .el-table thead tr:first-child {
        height: 50px !important;
    }

    .user-manage {
        width: 100%;
        background: #fff;
        padding: 0 30px 0;
        border: 1px solid #E5E7F3;
        border-radius: 4px;
        margin-top: 20px;

        .task-top {
            height: 100px;
            position: relative;
            border-bottom: 2px solid #CACFE7;

            .title {
                color: #2C343D;
                font-size: 20px;
                width: 83px;
                line-height: 100px;
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

        .edit-btn, .disabled-btn, .buchong-btn {
            display: inline-block;
            margin-right: 20px;
            font-size: 14px;
            cursor: pointer;
        }

        .edit-btn, .open-btn {
            color: #0179FF;
        }

        .disabled-btn, .buchong-btn {
            color: #D35847;
        }

    }


    .task-platformc {
        font-size: 14px;
        font-weight: normal;

        color: #2E323F;

        .task-name {
            color: #45B854;
        }
    }

</style>