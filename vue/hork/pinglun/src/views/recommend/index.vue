<template>
    <div class="maintain">
        <el-row>
            <el-col :span="24">
                <div class="maintain-top">
                    <el-form ref="form" :model="form" label-width="80px" class="recommend-form">
                        <el-form-item label="项目">
                            <el-select size="small"
                                       v-model="form.ProjectId"
                                       placeholder="请选择状态">
                                <el-option
                                        v-for="item in projects"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="平台">
                            <el-input size="small" v-model="form.Platform" placeholder="请输入"></el-input>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-col :span="24">
                                <el-date-picker
                                        :editable="false"
                                        :clearable="false"
                                        size="small"
                                        type="date"
                                        placeholder="选择日期"
                                        :default-value="dateDefault"
                                        value-format="timestamp"
                                        v-model="form.Day"
                                        style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-button class="search" @click="getNews(1)"><span class="icon-search_icon iconfont"></span>搜索
                        </el-button>
                    </el-form>

                </div>
            </el-col>
        </el-row>
        <div class="user-manage">
            <el-row>
                <el-col :span="24">
                    <div class="task-top">
                        <p class="title">新闻列表</p>
                        <search
                                placeholder="全表关键字模糊搜索"
                                :search-txt.sync="key"
                                @keysearch="getNews(1)"
                        ></search>

                    </div>
                </el-col>
            </el-row>

            <div class="table-box">
                <el-table
                        :data="newsList"
                        style="width: 90%"
                        class="user-table">
                    <el-table-column prop="id" label="" width="70"></el-table-column>
                    <el-table-column prop="createdt" label="添加日期"></el-table-column>
                    <el-table-column prop="platform" label="平台">
                        <template slot-scope="scope">
                            <div class="task-platformc fl task-topbar"
                                 :class="{'impotr-color': scope.row.iskeyplatform}">{{scope.row.platform}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="author" label="作者">
                        <template slot-scope="scope">
                            <div class="task-platformc fl task-topbar "
                                 :class="{'impotr-color': scope.row.iskeyauthor}">{{scope.row.author}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题" class-name="project-title">
                        <template slot-scope="scope">
                            <a :href="scope.row.url" target="_blank">{{scope.row.title}}</a>
                        </template>
                    </el-table-column>
                    <el-table-column prop="commentcount" label="评论量"></el-table-column>
                    <el-table-column prop="taskcount" label="任务数量"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">

                            <el-dropdown
                                    trigger="click"
                                    v-if="scope.row.markdeletion!=1"
                                    @command="(cmd)=>createWeihu(cmd, scope.row)">
                                <div class="el-dropdown-link">
                                    <span style="color:#0179FF;">创建维护</span>
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </div>

                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="1">撰写</el-dropdown-item>
                                    <el-dropdown-item command="2">发布</el-dropdown-item>
                                    <el-dropdown-item command="3">点赞</el-dropdown-item>
                                    <el-dropdown-item command="4">反向</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <div class="edit-btn" @click="caiJi(scope.row)">采集评论量</div>
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
                                    @size-change="()=>getNews()"
                                    @current-change="()=>getNews()"
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
        <bottom></bottom>

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
        Dropdown,
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
    Vue.use(Dropdown);
    Vue.use(Loading);

    import bottom from "@/components/bottom";
    import search from "@/components/search";
    export default {
        name: "list",
        data() {

            return {
                loading: false,
                key: "",
                page: 1,
                size: 10,
                count: 0,
                dateDefault: Date.now(),

                newsList: [],
                projects: [],

                form: {
                    Platform: "",
                    ProjectId: "",
                    Day: Date.now(),
                },
            }
        },
        computed: {
            ...mapGetters(["user", "userProject"]),
        },
        components: {
            bottom,
            search
        },
        mounted() {
            // this.GetProjectsDic(0).then((res) => {
            //     this.projects = res;
            // });
            this.projects = this.userProject;
            if (this.projects.length > 0) {
                this.form.ProjectId = this.projects[0].key;
                this.getNews();
            } else {
                this.$message("请先分配项目")
            }

        },
        methods: {

            //任务列表
            getNews(ser) {
                if (ser) {
                    this.page = 1;
                }

                if (_.isNil(this.form.Day) || this.form.Day == 0) {
                    this.$message("必须选择时间");
                    return;
                }

                this.loading = true;

                let opt = {
                    Platform: this.form.Platform,
                    ProjectId: this.form.ProjectId,
                    Date: _.isNil(this.form.Day) || this.form.Day == 0 ? "" : (this.form.Day / 1000).toFixed(0),
                    Page: this.page,
                    Size: this.size,
                    Key: this.key
                };
                this.GetNews(opt).then((res) => {
                    this.newsList = _.map(res.data, (v) => {
                        if (v.title.length > 32) {
                            v.title = v.title.substr(0, 32) + "...";
                        }

                        return v;
                    });
                    this.count = res.count;

                    this.loading = false;
                })
            },

            // 创建维护
            createWeihu(cmd, row) {
                let tid = parseInt(cmd, 10);
                let newsid = row.newsid;
                let projectid = this.form.ProjectId;

                if (!this.form.ProjectId) {
                    this.$message("请先选择项目");
                    return;
                }

                switch (tid) {
                    case 1:
                        this.$router.push("/create-write/" + newsid + "/" + projectid);
                        break;
                    case 2:
                        this.$router.push("/create-publish/" + newsid + "/" + projectid);
                        break;
                    case 3:
                        this.$router.push("/create-like/" + newsid + "/" + projectid);
                        break;
                    case 4:
                        this.$router.push("/create-reverse/" + newsid + "/" + projectid);
                        break;

                }

            },

            // 采集评论量
            caiJi(row) {
                console.log(row)
                this.CrawlComment({id: row.newsid}).then(() => {
                    this.$message("已提交采集")
                }).catch((err) => {
                    this.$message(err.message)
                })
            },

            ...mapActions(["GetNews", "GetProjectsDic", "CrawlComment"]),

        }
    }
</script>

<style lang="scss">
    // 重点平台作者的字体颜色
    .impotr-color {
        color: #45B854;
    }

    .el-dropdown-link {
        cursor: pointer;
    }

    // 新闻列表标题字数样式
    // .el-table .project-title .cell {
    //     display: -webkit-box;
    //     -webkit-box-orient: vertical;
    //     -webkit-line-clamp: 1;
    //     overflow: hidden;
    // }
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

</style>

<style lang="scss" scoped>
    // 定义的全局变量
    $btn-color: #6967CE;
    $border-color: #E5E7F3;
    $operation-color: #0179FF;


    .maintain {
        width: 91%;
        margin: 100px 20px 0 190px;


        .recommend-form {
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

            .el-form-item {
                width: 15%;
                float: left;
                margin-right: 2%;
                text-align: left;
            }

            .el-form-item:nth-last-of-type(1) {
                margin-right: 0;
            }
        }
    }


    .task-top, .task-list {
        width: 96%;
        margin: 0 2% 0;
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
                width: 83px;
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
            line-height: 70px;
            position: relative;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
        }

        .task-topbar2 {
            position: absolute;
            top: 25px;
            left: 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
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
            float: left;
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

</style>