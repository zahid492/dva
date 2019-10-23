<template>
    <div class="user_box">
        <div class="distributor-manage">
            <el-row>
                <el-col :span="24">
                    <div class="task-top">
                        <p class="title">项目管理</p>

                        <el-button class="search add_btn" type="primary" @click="editProject(0, null)"><span class="icon-fabu2 iconfont"></span>创建</el-button>

                        <search
                                placeholder="全表关键字模糊搜索"
                                :search-txt.sync="key"
                                @keysearch="getProjects(1)"
                        ></search>

                    </div>
                </el-col>
            </el-row>
            <div class="table-box">
                <el-table
                        :data="Projects"
                        style="width: 90%"
                        class="user-table">
                    <el-table-column prop="id" label="" width="70"></el-table-column>
                    <el-table-column prop="companyname" label="集团"></el-table-column>
                    <el-table-column prop="customername" label="客户"></el-table-column>
                    <el-table-column prop="projectname" label="项目"></el-table-column>
                    <el-table-column prop="qqgroup" label="QQ群"></el-table-column>
                    <el-table-column prop="createdt" label="创建日期"></el-table-column>
                    <el-table-column prop="modifydt" label="修改时间"></el-table-column>
                    <el-table-column prop="operator" label="操作者"></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <div class="edit-btn" @click="editProject(1, scope.row)">修改</div>
                            <!-- disabled-btn 这个类是禁用的颜色 -->
                            <div class="disabled-btn"
                                 v-if="!isM"
                                 @click="disableProject(scope.row)">
                                {{scope.row.status===1?"禁用":"启用"}}
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
                                    @size-change="()=>getProjects()"
                                    @current-change="()=>getProjects()"
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

    import bottom from "@/components/bottom"
    import search from "@/components/search"

    export default {
        name: "index",
        data() {
            return {
                loading: false,
                // 添加弹框
                accountDialogTitles: ["添加项目", "编辑项目"],

                types: [{
                    key: 0,
                    value: "通用"
                }, {
                    key: 1,
                    value: "撰写"
                }, {
                    key: 2,
                    value: "发布"
                }, {
                    key: 3,
                    value: "点赞"
                }, {
                    key: 4,
                    value: "反向"
                }],

                ruleForm: {
                    name: "",
                    qqgroup: "",
                    type: ""
                },

                rules: {
                    name: [
                        {required: true, message: "请输入项目名称", trigger: "blur"},
                    ],
                    qqgroup: [
                        {required: true, message: "请输入QQ群号", trigger: "blur"},
                        {min: 5, max: 20, message: "请输入正确QQ群号", trigger: "blur"}
                    ],
                },

                key: "",
                page: 1,
                size: 10,
                count: 0,

                Projects: [],

            }
        },
        computed: {
            ...mapGetters(["userRole", "isM"])
        },
        components: {
            bottom,
            search
        },
        mounted() {
            this.getProjects();
        },
        methods: {
            // 项目
            getProjects(ser) {
                if(ser){
                    this.page = 1;
                }
                this.loading = true;
                this.GetProjects({
                    Page: this.page,
                    Size: this.size,
                    Key: this.key
                }).then((res) => {
                    this.loading = false;
                    this.count = res.count;
                    this.Projects = res.data;
                }).catch(e=>{
                    this.loading = false;
                })
            },

            // 添加编辑状态
            editProject(act, row) {
                if (act === 1) {
                    this.$router.push("/create-project/" + row.id)
                } else {
                    this.$router.push("/create-project/")
                }

            },

            // 禁用项目
            disableProject(row) {
                this.ChangeProjectStatus({
                    id: row.id,
                    status: row.status == 0 ? 1 : 0,
                }).then(() => {
                    Message.success("状态改变成功");
                    this.getProjects();
                });
            },

            // 关闭对话框
            closeDialog() {
                this.$refs["ruleForm"].resetFields();
                this.centerDialogVisible = false;
            },


            // 分页功能
            handleCurrentChange() {
                this.GetProjects()
            },

            ...mapActions(["GetProjects", "ChangeProjectStatus"]),

        }
    };
</script>

<style lang="scss">
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
    .user_box {
        width: 91%;
        margin: 100px 20px 0 190px;

        .el-pagination.is-background .el-pager li:not(.disabled).active {
            background-color: #6967CE !important;
        }

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

    .user_box .user-table {
        width: 100% !important;
    }

    .user_box .el-table tr {
        height: 66px !important;
    }

    .user_box .el-table thead tr:first-child {
        height: 50px !important;
    }

    .distributor-manage {
        width: 100%;
        background: #fff;
        padding: 0 30px 0;
        border: 1px solid #E5E7F3;
        border-radius: 4px;
    }

    .distributor-manage {
        .task-top {
            height: 100px;
            position: relative;
            border-bottom: 2px solid #CACFE7;

            .title {
                color: #2C343D;
                font-size: 20px;
                width: 100px;
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

        .edit-btn, .disabled-btn {
            float: left;
            margin-right: 20px;
            font-size: 14px;
            cursor: pointer;
        }

        .edit-btn, .open-btn {
            color: #0179FF;
        }

        .disabled-btn {
            color: #D35847;
        }

    }

    .user_box {
        text-align: left;
    }
</style>