<template>
    <tasklay
        :loading="loading"
    >
        <template #form>
            <mcform
                    :owner="'client'"
                    :company-name.sync="form.CompanyName"
                    :customer-name.sync="form.CustomerName"
                    :project-id.sync="form.ProjectId"
                    :Day.sync="form.TaskCreateDate"
                    :Author.sync="form.Author"
                    :Platform.sync="form.Platform"
                    :task-type.sync="form.TaskType"
                    :proportion-status.sync="form.QualifiedSelected"

                    :proportionDic="proportionDic"
                    :maintainDic="maintainDic"

                    :taskTypeDic="taskTypeDic"

                    :companyDic="companyDic"
                    :customerDic="customerDic"
                    :projectDic="projectDic"
                    :supplierDic="supplierDic"

                    @search="getClientTasks(1)"
            ></mcform>
        </template>
        <template #filter>
            <p class="title">维护效果列表</p>
            <el-button class="search" @click="exportClientExcel"><span class="icon-daochu1 iconfont"></span>导出统计报告
            </el-button>

            <search
                    placeholder="标题模糊查询"
                    :search-txt.sync="form.Key"
                    @keysearch="getClientTasks(1)"
            ></search>
        </template>
        <template #list>
            <div class="unfold-all">
                <span @click="handleListCollapse">{{activeTitle}}<span class="iconfont"
                                                                       :class="{'icon-up': iconFlag, 'icon-down':!iconFlag}"></span></span>
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item v-for="(item, index) in maintainsList" :key="index" :name="index">
                    <template slot="title">
                        <el-row class="task-box">
                            <el-col :span="1">
                                <div class="task-num fl task-topbar">{{index+1}}</div>
                            </el-col>

                            <!--超级管理员时展示 集团-->
                            <div v-if="isSuper">
                                <el-col :span="2">
                                    <div class="task-time fl task-topbar">{{item.companyname}}</div>
                                </el-col>
                                <!--客户-->
                                <el-col :span="2">
                                    <div class="task-time fl task-topbar">{{item.customername}}</div>
                                </el-col>
                            </div>

                            <!--项目-->
                            <el-col :span="3">
                                <div class="task-time fl task-topbar">{{item.projectname}}</div>
                            </el-col>

                            <el-col :span="11">
                                <div class="task-title-time fl task-topbar" @click.prevent.stop="goTo(item.url)">
                                    <div class="task-title"  style="cursor:pointer">
                                        {{item.newstitle}}
                                    </div>
                                    <div class="task-time2 task-topbar2">{{item.publishtime}}</div>
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <div class="task-platformc fl task-topbar">
                                    <span :class="{'task-name': item.iskeyplatform}">{{item.platform}}</span>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="task-name-fans fl task-topbar">
                                    <div :class="{'task-name': item.iskeyauthor}">
                                        {{item.author}}
                                    </div>
                                    <div class="task-fans task-topbar2" v-if="item.platform==='新浪微博'">
                                        粉丝: {{item.fans}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="fl task-topbar"
                                     :class="{'task-percent-proportion':Number(item.proportion)<item.passproportion*100}">
                                    <div class="task-percent">
                                        {{item.proportion}}%
                                    </div>
                                    <div class="task-proportion task-topbar2">
                                        占比
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </template>
                    <div class="task-child-box task-wh-child-box">
                        <el-row class="task-child-item" v-for="(task, index) in item.tasks" :key="index">
                            <el-col :span="3" :offset="4" >
                                <div class="child-time">
                                    <div class="child-line" v-if="index!=0"></div>
                                    <div class="child-dot"></div>
                                    <span>{{task.taskdatetime}}</span>
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div class="urgent-btn" v-if="task.isurgent">
                                    <span>！</span>
                                    <span>重要</span>
                                </div>
                                <div class="child-type">{{task.tasktypeName}}</div>
                            </el-col>
                            <el-col :span="4">
                                <div class="child-supplier">{{task.resultcount}}条</div>
                            </el-col>

                            <el-col :span="2">
                                <span class="icon-wancheng iconfont fl"></span>
                                <div class="child-state">
                                    {{task.taskstatus==2?"已完成":"执行中"}}
                                </div>
                            </el-col>
                            <el-col :span="4">
                                <div class="child-state">
                                    {{task.finisheddt}}
                                </div>
                            </el-col>

                            <el-col :span="4">
                                <div class="child-check" @click.prevent.stop="toView(task.taskid, task.tasktype)">查看
                                </div>
                            </el-col>
                        </el-row>

                    </div>
                </el-collapse-item>
            </el-collapse>
        </template>
        <template #pagination>
            <el-pagination
                    background
                    @size-change="()=>getClientTasks()"
                    @current-change="()=>getClientTasks()"
                    :current-page.sync="form.Page"
                    :page-sizes="[10, 15, 20]"
                    :page-size.sync="form.Size"
                    layout="sizes, prev, pager, next"
                    :total="count">
            </el-pagination>
        </template>
    </tasklay>
</template>

<script>
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

    import tasklay from "@/components/tasklay";
    import mcform from "@/components/mcform";
    import search from "@/components/search";
    import maintainAction from "@/mixins/maintainAction";

    export default {
        name: "list",
        data() {
            return {
                loading: false,
                maintainsList: [],
                proportionDic: [],
                maintainDic: [],
                supplierDic: [],
                projectDic: [],
                companyDic: [],
                customerDic: [],
                form: {
                    CompanyName: "",
                    CustomerName: "",
                    ProjectId: '',
                    Platform: '',
                    Author: "",
                    TaskCreateDate: Date.now(),
                    TaskType: 0,
                    QualifiedSelected: "全部",
                    Page: 1,
                    Size: 10,
                    Key: ""
                },
                count: 0,
                projectInfo: {},
                taskTypeDic: []
            }
        },
        computed: {
            ...mapGetters(["userProject", "isSuper", "clientSearchForm", "token"]),

        },
        components: {
            tasklay,
            mcform,
            search
        },
        mixins: [maintainAction],
        mounted() {

            this.GetMaintainStatusDic().then((res) => {
                this.maintainDic = _.concat([{key: "-1", value: "全部"}], res);
            });

            this.GetProportionStatus().then((res) => {
                this.proportionDic = _.concat([{key: "-1", value: "全部"}], res);
            });

            this.TaskTypeDic().then(res => {
                this.taskTypeDic = res;
            });

            // 是超级管理员，直接获取集团
            if (this.isSuper) {
                this.GetCompanies().then((res) => {
                    this.companyDic = res;

                    if (_.has(this.clientSearchForm, "ProjectId")) {
                        this.form = _.assign({}, this.clientSearchForm);
                        this.customerDic = _.find(this.companyDic, {key: this.form.CompanyName}).children;
                        this.projectDic = _.find(this.customerDic, {key: this.form.CustomerName}).children;
                        this.supplierDic = _.find(this.projectDic, {key: this.form.ProjectId}).children;
                    } else {

                        this.customerDic = this.companyDic[0].children;
                        this.form.CompanyName = this.companyDic[0].value;
                        this.form.CustomerName = this.customerDic[0].value;

                        this.projectDic = this.customerDic[0].children;

                        this.form.ProjectId = this.projectDic[0].key;
                        this.supplierDic = this.projectDic[0].children;
                        this.$forceUpdate();
                    }

                    // this.getProjectInfo(this.form.ProjectId);
                    // 保证项目id 存在
                    this.getClientTasks();
                });
            } else {
                if (this.projectDic.length === 0) {
                    this.RefreshLogin().then(()=>{
                        // 用户没有关联的项目，或无关联项目的 超级管理员
                        if(this.userProject){
                            if (this.userProject.length === 0) {
                                this.$message("没有关联项目");

                            } else {
                                this.setSearch();
                            }
                        }

                    })

                }
            }

        },
        watch:{
            "userProject":function(n, o){

                if(this.userProject && !_.isEqual(n, o)){
                    this.setSearch();
                }

            },

        },
        methods: {
            goTo(url){
                if(url){
                    window.open(url);
                }
            },
            setSearch(){
                // 用户有关联的项目
                this.projectDic = this.userProject;

                if (_.has(this.clientSearchForm, "ProjectId")) {
                    this.form = _.assign({}, this.clientSearchForm);
                    this.supplierDic = _.concat([{
                        key: "-1",
                        value: "全部"
                    }], _.find(this.projectDic, {key: this.form.ProjectId}).children);
                } else {
                    this.form.ProjectId = this.projectDic[0].key;
                    this.supplierDic =  this.projectDic[0].children;
                }

                // this.getProjectInfo(this.form.ProjectId);
                this.getClientTasks();
            },
            // 维护任务列表
            getClientTasks(ser) {

                if(ser){
                    this.form.Page = 1;
                }

                let opt = _.assign({}, this.form, {
                    CompanyName: this.form.CompanyName === "全部" ? "" : this.form.CompanyName,
                    CustomerName: this.form.CustomerName === "全部" ? "" : this.form.CustomerName,
                    ProjectId: this.form.ProjectId === "-1" ? "" : this.form.ProjectId,
                    QualifiedSelected: this.form.QualifiedSelected === "全部" ? "" : this.form.QualifiedSelected,
                    TaskType: this.form.TaskType === 0 ? "" : this.form.TaskType,
                    TaskCreateDate: _.isNil(this.form.TaskCreateDate) || this.form.TaskCreateDate == 0 ? "" :(this.form.TaskCreateDate / 1000).toFixed(0),
                });



                this.GetClientTasks(opt).then((res) => {
                    this.maintainsList = _.map(res.data, (v) => {
                        v.customermaintaintasks = _.map(v.customermaintaintasks, (d) => {
                            // 任务类型
                            d.tasktypeName = _.find(this.taskTypeDic, {key: d.tasktype}).value;
                            return d;
                        });

                        return v;
                    });

                    this.count = res.count;
                    this.activeNames = _.map(this.maintainsList, (v, i) => i);
                    this.activeTitle="全部折叠";

                    if(this.count==0){
                        this.$message("没有对应数据")
                    }
                })
            },
            // 查看
            toView(taskid, tasktype) {
                this.ClientSetSearchForm(this.form);
                // 0通用 1撰写 2发布 3点赞 4反向
                switch (tasktype) {
                    case 1:
                        this.$router.push("/sub/view-write/" + taskid + "/client");
                        break;
                    case 2:
                        this.$router.push("/sub/view-publish/" + taskid + "/client");
                        break;
                    case 3:
                        this.$router.push("/sub/view-like/" + taskid + "/client");
                        break;
                    case 4:
                        this.$router.push("/sub/view-reverse/" + taskid + "/client");
                        break;
                }
            },
            // 导出报告
            exportClientExcel() {
                let date = (this.form.TaskCreateDate / 1000).toFixed(0);

                if (!this.form.ProjectId) {
                    this.$message("请先选择项目");
                    return;
                }

                if (!this.form.ProjectId) {
                    this.$message("请先选择项目");
                    return;
                }

                let ProportionStatus = (_.isNil(this.form.QualifiedSelected)||this.form.QualifiedSelected === "全部")
                    ?"":this.form.QualifiedSelected;

                let TaskType = this.form.TaskType==0 ? "":this.form.TaskType;
                let Platform = _.isNil(this.form.Platform) ? "":this.form.Platform;

                window.open(config.apiPath() + `/reports/export?Date=${date}&ProjectId=${this.form.ProjectId}&AuthorName=${this.form.Author}&MaintainTaskType=${TaskType}&ProportionStatus=${ProportionStatus}&Platform=${Platform}&MaintainTaskStatus=2&accessToken=${this.token}`)
            },

            // 通过项目id获取项目信息
            getProjectInfo(id) {
                this.GetProjectById(id).then(pj => {
                    this.projectInfo = pj;
                });
            },

            ...mapActions(["GetClientTasks", "GetProportionStatus", "GetMaintainStatusDic", "GetProjectsDic", "GetCompanies", "GetProjectById", "TaskTypeDic", "ClientSetSearchForm", "RefreshLogin", "RefreshUser"]),

        }
    }
</script>

<style lang="scss" scoped>
    .el-col-8 {
        padding-right: 30px;
    }

    // 重要按钮
    .urgent-btn {
        margin-top: -10px;
    }

    .search {
        width: 150px;
    }

    // 子任务样式

    .child-dot {
        left: 0 !important;
        // margin-left: -16px;
    }
    .child-line {
        left: 0 !important;
        // margin-left: -13px;
    }
    .icon-wancheng {
        color: #69778f;
    }


    // 全部展开/折叠
    .unfold-all {
        width: 100px;
        height: 16px;
        font-size: 12px;
        font-weight: 400;
        text-align: left;
        color: rgba(51, 60, 72, 1);
        position: absolute;
        top: -20px;
        right: 35px;
        cursor: pointer;

        span {
            display: inline-block;
            width: 100%;
            position: absolute;
            top: 0 !important;
            left: 49px !important;
        }
    }


</style>