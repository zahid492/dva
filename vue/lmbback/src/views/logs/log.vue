<template>
    <div>
        <div class="el-row">
            <div class="el-col" :span="24">
                <div id="sentence_search">
                    <el-form ref="form"
                             :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">
                        <el-form-item label="平台："
                                      label-width="50">
                            <el-select v-model="Platform"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, k) in platformList"
                                        :key="item._id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="状态："
                                      label-width="50">
                            <el-select v-model="Status"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                                       @change="changeStatus"
                            >
                                <el-option
                                        v-for="(item) in logStatus"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="来源："
                                      label-width="50">
                            <el-select v-model="From"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                                       :disabled="sourceDisable"
                                       @change="changeSource"
                            >
                                <el-option
                                        v-for="(item) in logSource"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="类别："
                                      label-width="50">
                            <el-select v-model="LogType"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                                       :disabled="typeDisable"
                            >
                                <el-option
                                        v-for="(item) in logTypeList"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="日志时间：" label-width="50">
                            <el-date-picker
                                    style="width:280px"
                                    size="small"
                                    type="datetimerange"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    v-model="dateRange"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :picker-options="pickerOptions"
                            ></el-date-picker>

                        </el-form-item>

                        <el-form-item label="关键字：" label-width="50">
                            <el-input
                                    style="width:120px"
                                    v-model="Key"
                                    placeholder=""></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="searchQuery">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="exportTaskExcel">导出</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <el-row>
            <el-col :span="24">
                <el-table
                        v-loading="loading"
                        :data="list"
                        :border="true"
                        :stripe="true"
                        size="mini"
                        style="width:100%;"
                >
                    <el-table-column
                            label="序号"
                            type="index"
                            width="80"
                            :index="indexMethod"
                    ></el-table-column>

                    <el-table-column
                            prop="platform"
                            label="平台"
                            width="100"
                    ></el-table-column>

                    <el-table-column
                            prop="accountName"
                            label="账号"
                            width="150"
                    ></el-table-column>

                    <el-table-column
                            prop="title"
                            label="文章标题"
                            width="350"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="statusName"
                            label="状态"
                            width="80"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="sourceName"
                            label="来源"
                            width="120"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="typeName"
                            label="日志类别"
                            width="150"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="logDtFormated"
                            label="时间"
                            width="150"
                    >
                    </el-table-column>

                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary"
                                       v-if="scope.row.status===2"
                                       size="mini"
                                       @click="viewDetail(scope.row)">查看详情
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <!-- 分页 -->
                <div class="pagination-block">
                    <el-pagination
                            @current-change="search"
                            :current-page.sync="Page"
                            :page-size="Size"
                            layout="prev, pager, next, jumper"
                            :total="count">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <el-dialog
                title="异常详情"
                :visible.sync="detailDialogVisible"
                width="40%"
                custom-class="article-category-form"
        >
            <div>
                {{detail}}
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelView">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from "vue";
    import {
        Input,
        Table,
        TableColumn,
        Button,
        Dialog,
        Form,
        FormItem,
        Option,
        Select,
        Pagination,
        Row,
        Col,
        DatePicker,
        Loading

    } from "element-ui";

    import {Api} from "../../utils/api";
    import service from "@/utils/request"

    {
        Vue.use(Table);
        Vue.use(TableColumn);
        Vue.use(Button);
        Vue.use(Dialog);
        Vue.use(Form);
        Vue.use(FormItem);
        Vue.use(Option);
        Vue.use(Select);
        Vue.use(Pagination);
        Vue.use(Row);
        Vue.use(Col);
        Vue.use(Input);
        Vue.use(DatePicker);
        Vue.use(Loading);
    }

    export default {
        name: "logs-log",
        data: function () {
            let yesterday = moment().format("YYYY-MM-DD");
            return {
                //平台
                platformList: [],
                Platform: "全部",
                //时间类型： 0 按日 1 按月
                DateTimeType: 0,
                dateRange: [yesterday, yesterday],

                //关键字
                Key: "",

                logTypes: {},
                logStatus: {},
                logSource: {},

                logTypeList: [{key: "全部", value: "全部"}],

                LogType: "全部",
                From: "全部",
                Status: "全部",
                sourceDisable: true,
                typeDisable: true,

                Page: 1,
                Size: 10,
                count: 0,

                list: [],
                loading: false,

                pickerOptions: {},

                detailDialogVisible: false,
                detail: "",
            }
        },

        computed: {
            searchObj: function () {
                return {
                    Page: this.Page,
                    Size: this.Size,
                    Key: this.Key.trim(),
                    Platform: this.Platform === "全部" ? "" : this.Platform,
                    TimeStart: !_.isNil(this.dateRange) && this.dateRange[0] || "",
                    TimeEnd: !_.isNil(this.dateRange) && this.dateRange[1] || "",
                    Status: this.Status === "全部" ? "" : Number(this.Status),
                    From: this.From === "全部" ? "" : Number(this.From),
                    LogType: this.LogType === "全部" ? "" : Number(this.LogType),
                }
            }
        },

        created: function () {
            // 最大选择从昨天开始1年之前到数据
            this.pickerOptions.disabledDate = function (time) {
                let oneYearAgo = moment().subtract(2, 'month');
                let yesterday = moment();
                let curSelDate = moment(time);
                return curSelDate > yesterday || curSelDate < oneYearAgo;
            };
            this.getPlatforms();
            this.getLogTypes();
            this.getLogStatus();
            this.getLogSource();
        },

        mounted: function () {
            this.$nextTick(() => {
                this.search();
            });

        },

        methods: {
            searchQuery(){
                this.Page=1;
                this.search();
            },
            // 查询
            search: function () {
                let that = this;
                this.loading = true;

                service({
                    method: "get",
                    url: Api.logs_getlist,
                    params: that.searchObj
                }).then((res) => {
                    if (res.data.length > 0) {
                        // console.log(this.logTypes, this.logSource, this.logStatus)
                        that.count = res.count;
                        that.list = res.data.map((v, i) => {

                            v.statusName = _.find(this.logStatus, {key: v.status.toString()}).value || "";
                            v.sourceName = _.find(this.logSource, {key: v.source.toString()}).value || "";
                            v.typeName = _.find(this.logTypes, {key: v.logType.toString()}).value || "";
                            v.logDtFormated = moment(v.logDt).format("YYYY-MM-DD HH:mm:ss");
                            return v;
                        });
                    } else {
                        that.$message({
                            type: "info",
                            offset: 300,
                            message: "没有数据"
                        })
                    }

                    that.loading = false;

                }).catch(function () {
                    that.$message({
                        type: "error",
                        offset: 300,
                        message: "发生错误"
                    })
                })
            },

            changeStatus(v) {
                console.log(v)
                if (v !== "全部") {
                    this.logTypeList = _.concat([{key: "全部", value: "全部"}],
                        this.logTypes.filter((item) => {
                            if (v === item.key.substr(0, 1)) {
                                return true;
                            }
                            return false;
                        }));
                    this.From = "全部";
                    this.LogType = "全部";
                    this.sourceDisable = false;
                    this.typeDisable = true;
                }else{
                    this.logTypeList = [];
                    this.From = "全部";
                    this.LogType = "全部";
                    this.sourceDisable = true;
                    this.typeDisable = true;
                }
            },
            changeSource(v) {
                console.log(v)
                if (v !== "全部") {
                    this.logTypeList = _.concat([{key: "全部", value: "全部"}],
                        this.logTypes.filter((item) => {
                            if (this.Status === item.key.substr(0, 1) && v === item.key.substr(1, 1)) {
                                return true;
                            }
                            return false;
                        }));
                    this.LogType = "全部";
                    this.typeDisable = false;
                }else{
                    this.LogType = "全部";
                    this.typeDisable = true;
                    this.logTypeList = [];
                }
            },

            indexMethod: function (index) {
                return index + 1 + (this.Page - 1) * this.Size;
            },

            viewDetail(row) {
                this.detailDialogVisible = true;
                this.detail = row.detail;
            },

            cancelView() {
                this.detailDialogVisible = false;
                this.detail = "";
            },

            // 导出
            exportTaskExcel: function () {
                let qs = $.param({...this.searchObj, Size: this.count});
                let url = config.apiPath + Api.logs_export + "?" + qs;

                window.open(url)
            },

            getLogTypes: function () {
                let that = this;
                service({
                    method: "get",
                    url: Api.logs_type,
                }).then(function (res) {
                    that.logTypes = _.map(res.data, (v, k) => {
                        return {
                            key: k,
                            value: v
                        }
                    });
                })
            },

            getLogStatus: function () {
                let that = this;
                service({
                    method: "get",
                    url: Api.logs_status,
                }).then(function (res) {
                    that.logStatus = _.concat([{key: "全部", value: "全部"}], _.map(res.data, (v, k) => {
                        return {
                            key: k,
                            value: v
                        }
                    }));
                })
            },

            getLogSource: function () {
                let that = this;
                service({
                    method: "get",
                    url: Api.logs_source,
                }).then(function (res) {
                    that.logSource = _.concat([{key: "全部", value: "全部"}], _.map(res.data, (v, k) => {
                        return {
                            key: k,
                            value: v
                        }
                    }));
                })
            },

            getPlatforms: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.mymedia_platform_getlist,
                    params: {
                        page: 1,
                        size: 100,
                    }
                }).then(function (res) {
                    that.platformList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                })
            },
        }
    }
</script>

<style scoped>

</style>