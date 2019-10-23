<template>
    <el-row>
        <el-col :span="22" :offset="1">
            <div class="topbar">
                <el-select v-model="submitDt"
                           @change="searchMissions"
                           placeholder="按时间排序"
                           class="topbaroption fl">
                    <el-option
                            v-for="item in filterTime"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="taskStatus"
                           @change="searchMissions"
                           placeholder="状态"
                           class="topbaroption fl">
                    <el-option
                            v-for="(item, k) in filterStates"
                            :key="k"
                            :label="item"
                            :value="k">
                    </el-option>
                </el-select>
                <div class="block times fl">
                    <span class="demonstration">提交时间：</span>
                    <el-date-picker
                            v-model="submitTime"
                            @change="searchMissions"
                            type="datetimerange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div style="margin-left: 20px;" class="sousuo fl">
                    <el-autocomplete
                            placeholder="请输入内容"
                            v-model="keyWord"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            @change="searchMissions"
                            @select="handleSelect"
                            :select-when-unmatched="true"
                            class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchMissions()"></el-button>
                    </el-autocomplete>
                </div>
            </div>
        </el-col>
        <el-col :span="22" :offset="1">
            <el-table
                    :data="missions"
                    border
                    stripe
                    style="width: 100%"
                    class="user-table">

<!--                <el-table-column prop="number" label="任务单号" width="180">-->
<!--                </el-table-column>-->
                <el-table-column prop="name" label="任务名称" width="200">
                        <template slot-scope="scope">
                        <a :href="`/detail/${scope.row.id}`">{{ scope.row.name }}</a>

                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="94"></el-table-column>
                <el-table-column prop="price" label="价格" width="60"></el-table-column>
                <el-table-column prop="sentenceCount" label="数量" width="50"></el-table-column>
                <!-- todo -->
                <el-table-column prop="validCount" label="有效量" width="70"></el-table-column>
                <el-table-column prop="score" label="评分"  width="70" align="center"></el-table-column>
                <el-table-column prop="submitDt" label="提交时间" width="160">
                    <template slot-scope="scope">
                        <p>{{ scope.row.submitDt[0] }}</p>
                        <p>{{ scope.row.submitDt[1] }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="leaveTime" label="剩余" width="60"></el-table-column>
                <el-table-column prop="taskStatus" label="状态" width="70"></el-table-column>
                <el-table-column prop="writerName" label="写手昵称" width="100"></el-table-column>
                <el-table-column prop="auditorName" label="审核人" width="100"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="viewRefuse(scope.row)">拒稿原因</el-button>
                        <el-button size="mini" type="danger" @click="closeMission(scope.row)"
                                   v-if="canClose(scope.row.taskStatus)">关闭任务
                        </el-button>
                        <el-button size="mini" type="info" @click="disWriter(scope.row)
" v-if="canDis(scope.row.taskStatus)">调整写手
                        </el-button>

                    </template>

                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
                <el-pagination
                        @current-change="searchMissions"
                        :current-page.sync="page"
                        :page-size="size"
                        layout="prev, pager, next, jumper"
                        :total="missionCount">
                </el-pagination>
            </div>

        </el-col>

        <!-- 查看拒稿原因弹框 -->
        <el-dialog
                title="查看拒稿原因"
                @close="closeRefuse"
                :visible.sync="dialogVisible"
                width="30%"
                center>

            <p class="p-text"><span>任务名称：</span> {{refuseReason.name}}</p>
            <p class="p-text"><span>类型：</span> {{refuseReason.type}}</p>
            <p class="p-text"><span> 拒稿原因：</span></p>
            <textarea class="ju_input" type="textarea" readonly>{{refuseReason.msg}}</textarea>

        </el-dialog>
        <!--分配其他写手-->
        <el-dialog
                title="分配其他写手"
                :visible.sync="disWriterVisible"
                width="28%"
                size="medium"
                center>
            <el-form :inline="true" class="writer-form">
                <el-form-item label="写手昵称：" label-width="100px">
                    <el-select v-model="writerId"
                               filterable
                               :filter-method="filterWriter"
                               placeholder="请选择写手"
                               class="topbaroption fl">
                        <el-option
                                v-for="item in writers"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDisWriter">取 消</el-button>
                <el-button type="primary" @click="okDisWriter">确 定</el-button>
            </div>
        </el-dialog>

    </el-row>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import {missionType} from "@/utils/type";

    import {
        Input,
        Autocomplete,
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
        OptionGroup,
        Select,
        Switch,
        TimeSelect,
        TimePicker,
        DatePicker,
        Pagination,
        Row,
        Col,

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
    Vue.use(OptionGroup);
    Vue.use(Select);
    Vue.use(Switch);
    Vue.use(TimeSelect);
    Vue.use(TimePicker);
    Vue.use(DatePicker);
    Vue.use(Pagination);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Input);
    Vue.use(Autocomplete);


    export default {
        name: "UserList",
        data() {
            return {
                czwidth: document.body.scrollWidth > 1200 ? "285" : "100",
                // 添加弹框
                centerDialogVisible: false,
                // 查看拒稿原因弹框
                dialogVisible: false,
                // 分配写手弹框
                disWriterVisible: false,
                //分页功能
                page: 1,
                //页数
                size: 10,
                // 排序按提交时间
                submitDt: '',
                // 时间排序取值
                filterTime: [{
                    value: '',
                    label: '按时间排序'
                }, {
                    value: 'asc',
                    label: '时间由少到多'
                }, {
                    value: 'desc',
                    label: '时间由多到少'
                }],
                 missionType: missionType,

                taskStatus: "-1",
                // 时间选择
                submitTime: [],
                // 搜索框
                keyWord: '',
                // 拒稿原因
                refuseReason: {
                    msg: "",
                    name: "",
                    type: "",
                },
                // 分配写手的id
                writerId: "",
                disTId: ""
            };
        },
        computed: {
            submitStartTimeStamp() {
                if (_.isNil(this.submitTime) || this.submitTime.length===0) {
                    return ""
                } else {
                    return (this.submitTime[0]/1000).toFixed(0) || "";
                }

            },

            submitEndTimeStamp() {
                if (_.isNil(this.submitTime) || this.submitTime.length===0) {
                    return ""
                } else {
                    return (this.submitTime[1]/1000).toFixed(0) || "";
                }

            },

            filterStates() {
                return _.assign({
                    "-1": '全部'
                }, this.missionTaskStatusObj);
            },

            serParams() {
                return {
                    field: "submitDt",
                    order: this.submitDt,
                    submitStartTimeStamp: this.submitStartTimeStamp,
                    submitEndTimeStamp: this.submitEndTimeStamp,
                    taskStatus: parseInt(this.taskStatus, 10),
                    keyWord: _.trim(this.keyWord),
                    page: this.page,
                    size: this.size
                }
            },

            ...mapGetters(["missions", "missionCount", "missionTaskStatusObj", "writers", "writersObj"]),
        },
        mounted() {
            this.GetTaskStatus();
            this.searchMissions();
            this.GetWriters().then(() => {
                this.writersCopy = _.assign({}, this.writers);
            });
        },
        methods: {
            querySearch(v, cb) {
                let arr = this.writersCopy;

                let pt = new RegExp(v, "ig");

                if (v) {
                    let rs = _.filter(arr, (writer) => {
                        return pt.test(writer.name.toLowerCase()) || pt.test(writer.namePy.toLowerCase())
                    });
                    cb(rs);
                }
            },

            handleSelect(item) {
                this.keyWord = item.value;
                this.searchMissions();
            },

            changeWriter(item) {
                // console.log(item, this.writerId, this.writers)
                // this.writerId = item.value;
            },

            filterWriter(v) {
                let pt = new RegExp(v, "ig");
                let arr = this.writersCopy;

                if (v) {
                    this.writerId = v;
                    let rs = _.filter(arr, (writer) => {
                        return pt.test(writer.name.toLowerCase()) || pt.test(writer.namePy.toLowerCase())
                    });

                    this.set_writers(rs);
                } else {
                    this.writerId = v;
                    this.set_writers(arr);
                }
            },
            searchMissions() {
                this.GetMissions(this.serParams)
            },
            // 拒稿
            viewRefuse(row) {

                this.GetRefuseMsg(row.id).then((res) => {
                    this.refuseReason = {
                        msg: res,
                        name: row.name,
                        type: row.type,
                    };

                    this.dialogVisible = true;
                }).catch(err => {
                    this.dialogVisible = false;
                });

            },
            //
            closeRefuse() {
                this.refuseReason = {
                    msg: "",
                    name: "",
                    type: "",
                };
            },
            // 关闭任务
            closeMission(row) {
                MessageBox.confirm('确定关闭此任务?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.CloseTask(row.id).then((res) => {
                        this.GetMissions(this.serParams).then(() => {
                            this.centerDialogVisible = true;
                            Message.success("成功关闭任务")
                        });

                    }).catch(err => {
                        this.centerDialogVisible = false;
                        Message.error("关闭任务失败")
                    });

                }).catch(err => {
                    console.log(err)
                })
            },

            disWriter(row) {
                this.disWriterVisible = true;
                this.disTId = row.id;
            },

            // 分配其他写手
            okDisWriter() {

                this.DistributionWriter({tId: this.disTId, writerId: this.writerId}).then((res) => {
                    Message.success("分配成功");
                    this.disWriterVisible = false;
                    this.disTId = "";
                    this.writerId = "";
                    this.set_writers(this.writersCopy);
                    this.GetMissions(this.serParams)

                }).catch(err => {
                    this.disWriterVisible = false;
                    this.disTId = "";
                    this.writerId = "";

                    if(err.code==400){
                        Message.error(err.message)
                    }else{
                        Message.error("分配失败")
                    }

                });


            },

            cancelDisWriter() {
                this.disWriterVisible = false;
            },

            canDis(status) {
                if (status === "待分配" || status === "待接受" || status === "待评分") {
                    return true;
                }

                return false;
            },
            canClose(status) {
                if (status === "待分配" || status === "待接受" || status === "待提交" || status === "待审核" || status === "审核中") {
                    return true;
                }

                return false;
            },

            ...mapActions(["GetMissions", "GetRefuseMsg", "DistributionWriter", "GetTaskStatus", "CloseTask", "GetWriters"]),
            ...mapMutations(["set_writers"])
        }
    };
</script>
<style>
    .el-table td,
    .el-table th.is-leaf {
        border-bottom: 1px solid #ccc;
    }

    .el-table--border th {
        border-right: 1px solid #ccc;
    }

    .el-table--border td {
        border-right: 1px solid #ccc;
    }

    .el-table--border {
        border: 1px solid #ccc;
    }

    .block {
        text-align: right;
        margin: 30px 0;
    }

    .writer-form .el-form-item__content {
        margin-left: 20px !important;
    }
</style>

<style scoped>
    .dialog-footer {
        margin-top: 30px;
    }

    .user-table {
        width: 80%;
        margin: 0 auto;
    }

    .add_btn {
        margin: 0 0 30px 0;
    }

    .user_box {
        text-align: left;
    }

    .topbar {
        height: 50px;
        margin: 0 0 30px 0;
    }

    .topbaroption {
        width: 180px;
        margin-right: 20px;
    }

    .times {
        margin: 0 !important;
    }


    @media screen  and (max-width: 1200px) and (min-width: 970px) {
        .el-button--mini {
            margin: 0 0 3px 0;
            display: block;
        }

        .el-date-editor--datetimerange.el-input__inner {
            width: 355px !important;
        }

        .sousuo {
            width: 198px !important;
        }

        .topbaroption {
            width: 138px;
            margin-right: 12px;
        }
    }

    .ju_input {
        width: 100%;
        height: 150px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 5px;
        resize: none;
        padding: 8px;
        box-sizing: border-box;
        cursor: no-drop;
    }

    .p-text {
        margin-bottom: 12px;
    }

    .p-text span {
        display: inline-block;
        width: 70px;
        text-align: right;
    }

</style>
