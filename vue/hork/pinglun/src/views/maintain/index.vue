<template>
    <tasklay
            :loading="loading"
    >
        <template #form>
            <mcform
                    :owner="'maintain'"
                    :project-id.sync="form.ProjectId"
                    :supplier-id.sync="form.SupplierId"
                    :Day.sync="form.Day"
                    :Platform.sync="form.Platform"
                    :maintain-task-status.sync="form.MaintainTaskStatus"
                    :proportion-status.sync="form.ProportionStatus"
                    :supplierDic="supplierDic"
                    :proportionDic="proportionDic"
                    :maintainDic="maintainDic"
                    @search="()=>{
                        SetSearchForm(Object.assign({}, form));
                        getMaintains(1)
                    }"
            ></mcform>
        </template>

        <template #filter>
            <p class="title">任务列表</p>
            <el-button class="search" @click="createBaogao"><span class="icon-daochu1 iconfont"></span>生成维护统计报告
            </el-button>
            <el-button class="search" @click="createWeihu"><span class="icon-fabu2 iconfont"></span>创建维护
            </el-button>
            <search
                    placeholder="标题模糊查询"
                    :search-txt.sync="form.Key"
                    @keysearch="getMaintains(1)"
            ></search>
        </template>

        <template #list>
            <div class="unfold-all">
                <span @click="handleListCollapse">{{activeTitle}}
                    <span class="iconfont"
                          :class="{'icon-up': iconFlag, 'icon-down':!iconFlag}"></span>
                </span>
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item v-for="(item, index) in maintainsList" :key="index" :name="index">
                    <template slot="title">
                        <el-row class="task-box" :class="{markdeletion:item.markdeletion==1}">
                            <el-col :span="1">
                                <div class="task-num fl task-topbar">{{index+1}}</div>
                            </el-col>
                            <el-col :span="2">
                                <div class="task-time fl task-topbar">{{item.firsttaskcreatedt}}</div>
                            </el-col>
                            <el-col :span="8">
                                <div class="task-title-time fl task-topbar" @click.prevent.stop="goTo(item.url)">
                                    <div class="task-title">
                                        {{item.title}}
                                    </div>
                                    <div class="task-time2 task-topbar2">{{item.publishdtSC}}</div>
                                </div>
                            </el-col>
                            <el-col :span="3">
                                <div class="task-platformc fl task-topbar">
                                    <div :class="{'task-name': item.iskeyplatform}">
                                        {{item.platform?item.platform:"-"}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="2">
                                <div class="task-name-fans fl task-topbar">
                                    <div :class="{'task-name': item.iskeyauthor}">
                                        {{item.author?item.author:"-"}}
                                    </div>
                                    <div class="task-fans task-topbar2" v-if="item.platform==='新浪微博'">
                                        粉丝: {{item.fans}}
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div class="task-percent-proportion fl task-topbar">
                                    <div :class="{'task-percent': projectInfo.proportion*100>Number(item.proportion)}">
                                        {{ item.proportion}}%
                                    </div>
                                    <div class="task-proportion task-topbar2">
                                        占比
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div @click.prevent.stop="toAction(1, item)"
                                     :class="{itemdel:item.markdeletion==1}"
                                     class="task-caozuo task-zx fl task-topbar">撰写
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div @click.prevent.stop="toAction(2, item)"
                                     :class="{itemdel:item.markdeletion==1}"
                                     class="task-caozuo task-fb fl task-topbar">发布
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div @click.prevent.stop="toAction(3, item)"
                                     :class="{itemdel:item.markdeletion==1}"
                                     class="task-caozuo task-dz fl task-topbar">点赞
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div @click.prevent.stop="toAction(4, item)"
                                     :class="{itemdel:item.markdeletion==1}"
                                     class="task-caozuo task-fx fl task-topbar">反向
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div @click.prevent.stop="actPuJi(item)"
                                     :class="{itemdel:item.markdeletion==1}"
                                     class="task-caozuo task-pt fl task-topbar">
                                    {{item.urgentstatus ?"普通":"重要"}}
                                </div>
                            </el-col>
                            <el-col :span="1">
                                <div @click.prevent.stop="actDelted(item)">
                                    <div v-if="item.markdeletion==1"
                                         class="task-del fl task-topbar huifu">恢复
                                    </div>
                                    <div v-if="item.markdeletion!=1"
                                         class="task-caozuo task-del fl task-topbar">被删除
                                    </div>

                                </div>
                            </el-col>
                        </el-row>
                    </template>
                    <div class="task-child-box">
                        <el-row class="task-child-item" v-for="(task, index) in item.tasks" :key="index">
                            <el-col :span="4">
                                <div class="child-time">
                                    <div class="child-line" v-if="index!=0"></div>
                                    <div class="child-dot"></div>
                                    <span>{{task.createdt}}</span>
                                </div>
                            </el-col>
                            <el-col :span="5" style="position:relative">
                                <div class="urgent-btn" v-if="task.isurgent">
                                    <span>！</span>
                                    <span>重要</span>
                                </div>
                                <div class="child-type">{{task.typestatus}}</div>
                            </el-col>
                            <el-col :span="4">
                                <div class="child-supplier">{{task.suppliername}}</div>
                            </el-col>
                            <el-col :span="3">
                                <div class="child-state">
                                    {{task.taskstatusdescription}}
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="child-check"
                                     v-if="(task.screenshotcount>=task.commentcount || task.type==1) && task.taskstatus==2"
                                     @click="toView(task.id, task.type)">查看
                                </div>

                                <div class="child-check buchong"
                                     v-if="task.screenshotcount<task.commentcount && task.type!==1 && task.taskstatus==2"
                                     @click="toView(task.id, task.type)"><span
                                        class="icon-jietu iconfont"></span>补充截图
                                </div>

                                <div class="child-check"
                                     v-if="task.screenshotcount<task.commentcount && task.type!==1 && task.taskstatus==2"
                                     @click="captureScreenShot(item.id, task.id, task.type)"><span
                                        class="icon-jietu iconfont"></span>抓取截图
                                </div>

                                <div class="child-check"
                                     v-if="task.taskstatus==1"
                                     @click="delTask(task.id, task.type)">删除
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
                    @size-change="()=>getMaintains()"
                    @current-change="()=>getMaintains()"
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

                count: 0,
                newsId: parseInt(this.$route.query.newsId, 10) || "",
                form: {
                    ProjectId: (this.$route.query.projectId && parseInt(this.$route.query.projectId)) || "",
                    SupplierId: "-1",
                    Day: Date.now(),

                    Platform: '',
                    MaintainTaskStatus: "全部",
                    ProportionStatus: "全部",
                    Page: 1,
                    Size: 10,
                    Key: this.$route.query.keyword || ""
                },
                // 某个项目的重点作者，重点平台, 占比要求
                projectInfo: {}
            }
        },

        components: {
            tasklay,
            mcform,
            search
        },
        mixins: [maintainAction],
        watch: {
            "userProject": function (n, o) {
                if (this.userProject && !_.isEqual(n, o)) {
                    this.setSearch();
                }
            }
        },
        mounted() {
            console.log("mounted:", this.userProject);
            // if (this.userProject.length === 0) {
            //     // this.$message("没有关联项目");
            //     this.RefreshLogin();
            // } else {
            // }
            if (this.userProject && this.userProject.length > 0){
                this.setSearch();
            }

            // if(this.userProject.length===0){
            //     this.RefreshLogin().then((data) => {
            //         // 用户没有关联的项目，或无关联项目的 超级管理员
            //
            //     });
            // }else{
            //     this.setSearch();
            // }

            this.GetMaintainStatusDic().then((res) => {
                this.maintainDic = _.concat([{key: "全部", value: "全部"}], res);
            });
            this.GetProportionStatus().then((res) => {
                this.proportionDic = _.concat([{key: "全部", value: "全部"}], res);
            });

        },
        computed: {
            ...mapGetters(["userProject", "searchForm"])
        },

        methods: {
            setSearch() {
                // 用户有关联的项目

                if (!this.projectId) {

                    if (_.has(this.searchForm, "ProjectId")) {
                        this.supplierDic = _.find(this.userProject, {key: this.searchForm.ProjectId}).children;

                        this.form = _.assign({}, this.searchForm);
                    } else if (parseInt(this.$route.query.projectId, 10)) {
                        this.supplierDic = _.find(this.userProject, {key: parseInt(this.$route.query.projectId, 10)}).children;
                    } else {
                        this.$set(this.form, "ProjectId", this.userProject[0].key);
                        this.supplierDic = this.userProject[0].children;
                    }

                } else {
                    this.supplierDic = _.find(this.userProject, {key: this.projectId}).children;
                    this.$set(this.form, "ProjectId", this.userProject[0].key);
                }


                this.getProjectInfo(this.form.ProjectId);
                this.getMaintains();
            },

            // 维护任务列表
            getMaintains(ser) {

                if (ser) {
                    this.form.Page = 1;
                }

                if (this.newsId && ser == 1) {
                    this.newsId = ""
                }

                let opt = _.assign({}, this.form, {
                    MaintainTaskStatus: this.form.MaintainTaskStatus == "全部" ? "" : this.form.MaintainTaskStatus,
                    ProportionStatus: this.form.ProportionStatus == "全部" ? "" : this.form.ProportionStatus,
                    SupplierId: this.form.SupplierId == "-1" ? "" : this.form.SupplierId,
                    Day: _.isNil(this.form.Day) || this.form.Day == 0 ? "" : (this.form.Day / 1000).toFixed(0),
                    NewsId: this.newsId,
                });

                this.loading = true;

                this.Getmaintains(opt).then((res) => {
                    this.maintainsList = res.data;
                    this.count = res.count;


                    this.activeNames = _.map(this.maintainsList, (v, i) => i);
                    this.activeTitle = "全部折叠";
                    this.loading = false;

                    if (this.count == 0) {
                        this.$message("没有对应数据")
                    }


                }).catch((err) => {
                    this.loading = false;
                })

            },

            // 通过项目id获取项目信息
            getProjectInfo(id) {
                this.GetProjectById(id).then(pj => {
                    this.projectInfo = pj;
                });
            },

            delTask(taskid, tasktype) {
                this.$confirm("删除该任务吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.DeleteTask({
                        ids: [taskid]
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '成功删除任务!'
                        });
                        this.getMaintains();

                    }).catch(err => {
                        this.$message.error(err.message)
                    })
                }).catch(err => {
                    console.log(err)
                });
            },

            // 生成报告
            createBaogao() {

                if (!this.form.ProjectId) {
                    this.$message("请先选择项目");
                    return;
                }

                if (!this.form.Day) {
                    this.$message("请先选择任务创建时间");
                    return;
                }

                let day = (this.form.Day / 1000).toFixed(0);

                this.$router.push({
                    name: "maintain-report", query: {
                        projectId: this.form.ProjectId,
                        supplierId: this.form.SupplierId == "-1" ? "" : this.form.SupplierId,
                        platform: this.form.Platform,
                        proportionStatus: this.form.ProportionStatus == "-1" ? "" : this.form.ProportionStatus,
                        maintainTaskStatus: this.form.MaintainTaskStatus == "-1" ? "" : this.form.MaintainTaskStatus,
                        date: day,
                        newsId: this.newsId
                    }
                });
            },

            // 创建维护
            createWeihu() {
                if (this.form.ProjectId) {
                    this.SetSearchForm(this.form);
                    this.$router.push("/create-maintain/" + this.form.ProjectId)
                } else {
                    this.$message("请先选择项目")
                }
            },

            // 查看
            toView(taskid, tasktype) {
                this.SetSearchForm(this.form);
                // 0通用 1撰写 2发布 3点赞 4反向
                switch (tasktype) {
                    case 1:
                        this.$router.push("/sub/view-write/" + taskid + "/mat");
                        break;
                    case 2:
                        this.$router.push("/sub/view-publish/" + taskid + "/mat");
                        break;
                    case 3:
                        this.$router.push("/sub/view-like/" + taskid + "/mat");
                        break;
                    case 4:
                        this.$router.push("/sub/view-reverse/" + taskid + "/mat");
                        break;
                }
            },
            // todo 任务列表页 当截图数不足时 手动触发截图任务
            captureScreenShot(newsid, taskid, tasktype) {
                this.HandleScreenShot({taskid, newsid}).then(() => {
                    this.$message("截图开始")
                }).catch(err => {
                    this.$message.error(err.message)
                })
            },
            // 创建任务
            toAction(type, task) {
                if (task.markdeletion == 1) {
                    return;
                }

                this.SetSearchForm(this.form);

                if (this.form.ProjectId) {
                    switch (parseInt(type, 10)) {
                        case 1:
                            this.$router.push("/create-write/" + task.id + "/" + this.form.ProjectId);
                            break;
                        case 2:
                            this.$router.push("/create-publish/" + task.id + "/" + this.form.ProjectId);
                            break;
                        case 3:
                            this.$router.push("/create-like/" + task.id + "/" + this.form.ProjectId);
                            break;
                        case 4:
                            this.$router.push("/create-reverse/" + task.id + "/" + this.form.ProjectId);
                            break;
                    }
                } else {
                    this.$message("请先选择项目")
                }
            },

            // 普通重要
            actPuJi(item) {
                if (item.markdeletion == 1) {
                    return;
                }

                this.SetStatus({
                    ids: _.map(item.tasks, (v) => {
                        return v.id;
                    }),
                    urgentstatus: item.urgentstatus ? 0 : 1
                }).then(() => {
                    this.$message("状态改变成功")
                    this.getMaintains();
                }).catch(() => {
                    this.$message("状态改变失败")
                })
            },

            // 被删除
            actDelted(item) {
                let info = "";

                if (item.markdeletion == 0) {
                    info = '标记为被删除吗?'
                } else {
                    info = '恢复吗?'
                }

                this.$confirm(info, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.SetDeltedSign({
                        id: item.id,
                        markdeletion: item.markdeletion == 0 ? 1 : 0
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '标记成功!'
                        });
                        this.getMaintains();

                    });
                }).catch(err => {
                    console.log(err)
                })
            },

            goTo(url) {
                window.open(url);
            },

            ...mapActions(["Getmaintains", "GetProportionStatus", "GetMaintainStatusDic", "SetStatus", "GetSuppliersDic", "GetProjectsDic", "SetDeltedSign", "GetProjectsDic", "GetProjectById", "SetSearchForm", "HandleScreenShot", "DeleteTask", "RefreshLogin"]),

        }
    }
</script>

<style lang="scss" scoped>

    .buchong {
        color: #e5715e !important;
    }

    // 重要按钮
    .urgent-btn {
        top: 50%;
        left: 50%;
        margin-top: -10px;
        margin-left: -80px;
    }

    .task-list-box {
        .search {
            width: auto;
        }
    }

    // 子任务样式

    .child-dot {
        margin-left: -35px;
    }

    .child-line {
        margin-left: -33px;
    }

    // 全部展开/折叠
    .unfold-all {
        width: 120px;
        height: 16px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(51, 60, 72, 1);
        position: absolute;
        top: -20px;
        right: 45px;
        cursor: pointer;

        span {
            display: inline-block;
            width: 100%;
            text-align: right;
            position: absolute;
            top: 0 !important;
            left: 0 !important;
            padding-right: 20px;
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

    .huifu {
        color: #0179FF !important;
        cursor: pointer;
    }

</style>