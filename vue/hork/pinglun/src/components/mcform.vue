<template>
    <el-form ref="form" label-width="80px" class="maintain-client-form">
        <!--client-->
        <div v-if="isSuper && owner=='client'">
            <el-form-item label="集团">
                <el-select size="small"
                           @change="changeCompany"
                           v-model="lCompanyName"
                           placeholder="全部">
                    <el-option
                            v-for="item in companyDic"
                            :key="item.key"
                            :label="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户">
                <el-select size="small"
                           @change="changeCustomer"
                           v-model="lCustomerName"
                           placeholder="全部">
                    <el-option
                            v-for="item in lcustomerDic"
                            :key="item.key"
                            :label="item.value"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </div>

        <el-form-item label="项目">
            <el-select size="small"
                       v-model="lProjectId"
                       @change="changeProject"
                       placeholder="请选择项目">

                <el-option
                        v-for="item in lprojectDic"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                </el-option>
            </el-select>
        </el-form-item>

        <!-- maintain-->
        <el-form-item label="供应商" v-if="owner=='maintain'">
            <el-select size="small"
                       v-model="lSupplierId"
                       @change="changeSupplier"
                       placeholder="请选择供应商">
                <el-option
                        v-for="item in lsupplierDic"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                </el-option>
            </el-select>
        </el-form-item>

        <!-- miantain -->
        <el-form-item label="状态" v-if="owner=='maintain'">
            <el-select size="small"
                       v-model="lMaintainTaskStatus"
                       @change="changeMaintainTaskStatus"
                       placeholder="请选择状态">
                <el-option
                        v-for="item in maintainDic"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                </el-option>
            </el-select>
        </el-form-item>

        <!-- client -->
        <el-form-item label="任务类型" v-if="owner=='client'">
            <el-select size="small"
                       v-model="lTaskType"
                       @change="changeTaskType"
                       placeholder="请选择任务类型">
                <el-option
                        v-for="item in taskTypeDic"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="平台">
            <el-input size="small"
                      v-model="lPlatform"
                      @change="changePlatform"
                      placeholder="请输入"></el-input>
        </el-form-item>

        <!--client-->
        <el-form-item label="作者" v-if="owner=='client'">
            <el-input size="small"
                      v-model="lAuthor"
                      @change="changeAuthor"
                      placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="占比">
            <el-select size="small"
                       v-model="lProportionStatus"
                       @change="changeProportion"
                       placeholder="请选择占比">
                <el-option
                        v-for="item in proportionDic"
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
                        value-format="timestamp"
                        v-model="lDay"
                        @change="changeDay"
                        style="width: 100%;"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-button class="search" @click="takeTask">
            <span class="icon-search_icon iconfont"></span>搜索
        </el-button>
    </el-form>
</template>

<script>
    // 任务列表 客户端 搜索
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import {
        Form,
        FormItem,
        Input,
        InputNumber,
        Select,
        DatePicker,
        Option,
        OptionGroup,
    } from "element-ui";

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Select);
    Vue.use(DatePicker);
    Vue.use(Option);
    Vue.use(OptionGroup);

    export default {
        name: "mcform",
        data: function () {
            // 异步数据问题
            return {
                lProjectId: this.projectId,
                lPlatform: this.Platform,
                // Day TaskCreateDate
                lDay: this.Day,
                // ProportionStatus QualifiedSelected
                lProportionStatus: this.ProportionStatus,

                // maintain only
                lSupplierId: this.SupplierId === "-1" ? "" : this.SupplierId,
                lMaintainTaskStatus: this.MaintainTaskStatus,
                // client only
                lCompanyName: this.CompanyName,
                lCustomerName: this.CustomerName,
                lTaskType: this.TaskType,
                lAuthor: this.Author,

                // form list
                lsupplierDic: [],
                // !!!
                lprojectDic: this.userProject || [],
                lcustomerDic: [],
                // 某个项目的重点作者，重点平台, 占比要求
                // projectInfo: {}
            }
        },
        props: ["owner", "ProjectId", "SupplierId", "Day", "Platform", "MaintainTaskStatus", "ProportionStatus",
            "CompanyName", "CustomerName", "TaskType", "Author",
            "supplierDic", "proportionDic", "maintainDic", "companyDic", "taskTypeDic",
            "customerDic", "companyDic"
        ],
        computed: {
            ...mapGetters(["userProject", "searchForm", "isSuper"]),
        },
        mounted() {

            console.log("mcform mounted");

            this.$nextTick(function () {
                this.lprojectDic = _.concat([], this.userProject);
                this.lPlatform = this.Platform;
                this.lDay = this.Day;
                this.lProportionStatus = this.ProportionStatus;

                if (this.owner == "maintain") {
                    this.lMaintainTaskStatus = this.MaintainTaskStatus;
                    this.setProject(this.projectId);
                }

                if (this.owner == "client") {

                    this.lTaskType = this.TaskType;
                    this.lAuthor = this.Author;

                    if (this.isSuper) {
                        this.lCompanyName = this.CompanyName;
                        this.lCustomerName = this.CustomerName;
                        this.lcustomerDic = this.customerDic;
                    }
                }
            })
        },
        watch: {
            // 监视
            "CompanyName": function (n, o) {
                if (this.isSuper && this.owner == "client") {
                    this.lCompanyName = this.CompanyName;

                }
            },
            "CustomerName": function (n, o) {
                if (this.isSuper && this.owner == "client") {
                    this.lCustomerName = this.CustomerName;
                    this.lcustomerDic = this.customerDic;
                }
            },

            "ProjectId": function (n, o) {
                // 项目id变化，用于响应父组件更新后触发子组件更新
                // this.isSuper && this.owner == "client"
                if (n !== o) {
                    console.log("moform watch ProjectId:", n, o)
                    this.lProjectId = n;
                    this.setProject(n);
                }
            },

            "userProject": function (n, o) {
                // 挂载后父组件更新 userProject 后发生1次
                if (this.userProject && !_.isEqual(n, o)) {
                    console.log("userProject:", n, this.lprojectDic)
                    this.lprojectDic = _.concat([], this.userProject);

                    this.projectId && this.setProject(this.projectId);
                }
            }

        },
        methods: {

            setProject(pid) {
                // 根据项目id 选择供应商集合
                console.log("mcform setProject:", pid)
                if (this.userProject.length > 0) {

                    let supArr = [];
                    let sup = _.find(this.userProject, {key: pid});

                    if (sup) {
                        supArr = sup.children;
                    }

                    if (supArr.length > 0) {
                        this.lsupplierDic = _.concat([{
                            key: "-1",
                            value: "全部"
                        }], supArr);

                        if (_.has(this.searchForm, "ProjectId")
                            && (this.searchForm.ProjectId === pid)) {
                            this.lSupplierId = this.SupplierId
                        } else {
                            this.lSupplierId = this.lsupplierDic[0].key;
                        }
                    }

                } else {
                    this.lSupplierId = ""
                }
            },

            takeTask() {
                if (this.userProject.length > 0) {
                    this.$emit("search");
                } else {
                    this.$message("请前先绑定项目")
                }

            },

            changeDay(val) {
                this.$emit("update:day", val);
            },

            // 根据项目变化，改变供应商列表 maintain client
            changeProject(key) {
                if (this.owner === "maintain") {
                    this.lSupplierId = "";

                    if (this.userProject.length > 0) {
                        this.lsupplierDic = _.concat([{
                            key: "-1",
                            value: "全部"
                        }], _.find(this.userProject, {key: key}).children);
                        this.lSupplierId = "-1";
                    }
                }

                this.$emit("update:projectId", key)
            },

            changeSupplier(val) {
                this.$emit("update:supplierId", val);
            },
            // 通过项目id获取项目信息
            // getProjectInfo(id) {
            //     this.GetProjectById(id).then(pj => {
            //         this.projectInfo = pj;
            //     });
            // },

            // 集团变化 client
            changeCompany(v) {
                console.log("changeCompany")
                this.lcustomerDic = _.find(this.companyDic, {value: v}).children;
                this.lprojectDic = [];
                this.lCustomerName = "";
                this.lProjectId = "";
                this.$emit("update:companyName", v);
            },

            // 客户变化 client
            changeCustomer(v) {
                console.log("changeCustomer")
                this.lprojectDic = _.find(this.lcustomerDic, {value: v}).children;
                this.$emit("update:customerName", v);
            },

            changeProportion(val) {
                this.$emit("update:proportionStatus", val);
            },

            changeAuthor(val) {
                this.$emit("update:author", val);
            },

            changePlatform(val) {
                this.$emit("update:platform", val);
            },

            changeMaintainTaskStatus(val) {
                this.$emit("update:maintainTaskStatus", val);
            },

            changeTaskType(val) {
                this.$emit("update:taskType", val);
            },

            ...mapActions(["GetProjectById"])
        }
    }
</script>

<style scoped>

</style>