<template>
    <div class="create-like-box">
        <div class="create-like">
            <div class="like-title">{{id?"编辑":"创建"}}项目</div>
            <div class="like-form-box">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="集团名称" prop="companyname">
                        <el-input type="text" placeholder="请输入集团名称" v-model="ruleForm.companyname"
                                  :readonly="id!==undefined"></el-input>
                    </el-form-item>
                    <el-form-item label="客户名称" prop="customername">
                        <el-input type="text" placeholder="请输入客户名称" v-model="ruleForm.customername"
                                  :readonly="id!==undefined"></el-input>
                    </el-form-item>
                    <el-form-item label="项目名称" prop="projectname">
                        <el-input type="text" placeholder="请输入项目名称" v-model="ruleForm.projectname"
                                  :readonly="id!==undefined"></el-input>
                    </el-form-item>

                    <el-form-item label="关联细分" prop="categories">
                        <el-select multiple v-model="ruleForm.categories" placeholder="请选择">
                            <el-option v-for="(value, key) in categoriesList"
                                       :key="key"
                                       :label="value"
                                       :value="value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="QQ群" prop="wechatgroup">
                        <el-input type="number" v-model="ruleForm.qqgroup" placeholder="请输入..."></el-input>
                    </el-form-item>
                    <el-form-item label="重点作者" prop="keyauthors">
                        <div class="require">
                            <el-input type="textarea" placeholder="请输入重点作者..." v-model="ruleForm.keyauthors"></el-input>
                        </div>
                        <p class="require-text">重点作者需要用英文分号;分隔开</p>
                    </el-form-item>
                    <el-form-item label="重点平台" prop="keyplatform">
                        <div class="require">
                            <el-input type="textarea" placeholder="请输入重点平台..."
                                      v-model="ruleForm.keyplatform"></el-input>
                        </div>
                        <p class="require-text">重点平台需要用英文分号;分隔开</p>
                    </el-form-item>
                    <el-form-item label="占比要求" prop="proportion">
                        <el-input type="number" v-model="ruleForm.proportion" placeholder="请输入...">
                            <template slot="append">%</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="抓取间隔" prop="crawlinterval">
                        <el-select v-model="ruleForm.crawlinterval" placeholder="请选择抓取间隔">
                            <el-option v-for="(value, key) in crawlintervalList"
                                       :key="value.key"
                                       :label="value.value"
                                       :value="value.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抓取追溯" prop="crawltrace">
                        <el-select v-model="ruleForm.crawltrace" placeholder="请选择抓取追溯">
                            <el-option v-if="isSuper" v-for="(value) in crawltraceAdminList"
                                       :key="value.key"
                                       :label="value.value"
                                       :value="value.key"></el-option>
                            <el-option v-if="!isSuper" v-for="(value) in crawltraceList"
                                       :key="value.key"
                                       :label="value.value"
                                       :value="value.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="抓取条数" prop="crawlcount">
                        <el-select v-model="ruleForm.crawlcount" placeholder="请选择抓取条数">
                            <el-option v-for="(value, key) in crawlcountList"
                                       :key="key"
                                       :label="value.value"
                                       :value="value.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="closePage">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
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
        Radio,
        RadioGroup,
        RadioButton,

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
    Vue.use(Radio);
    Vue.use(RadioGroup);
    Vue.use(RadioButton);

    import {trimSplitSpace} from "@/utils/index";
    import bottom from "@/components/bottom"

    export default {
        name: "create",
        data() {
            return {
                inContent: "",
                supplierDic: [],
                ruleForm: {
                    "companyname": "",
                    "customername": "",
                    "projectname": "",
                    "qqgroup": "",
                    "keyauthors": "",
                    "keyplatform": "",
                    // 关联细分
                    categories: "",
                    "proportion": 80,
                    "crawltrace": 3,
                    "crawlcount": 5,
                    "crawlinterval": 30
                },
                categoriesList: config.category,

                crawltraceList: [{
                    key: 1, value: "1天"
                }, {
                    key: 2, value: "2天"
                }, {
                    key: 3, value: "3天推荐"
                }],
                crawltraceAdminList: [{
                    key: 1, value: "1天"
                }, {
                    key: 2, value: "2天"
                }, {
                    key: 3, value: "3天推荐"
                }, {
                    key: 4, value: "4天"
                }, {
                    key: 5, value: "5天",
                }],


                crawlcountList: [{
                    key: 5, value: "5条"
                }, {
                    key: 10, value: "10条"
                }, {
                    key: 30, value: "30条"
                }],

                crawlintervalList: [{
                    key: 30, value: "30分钟"
                }, {
                    key: 20, value: "20分钟"
                }, {
                    key: 10, value: "10分钟"
                }],


                rules: {
                    companyname: [
                        {trigger: "blur", required: true, message: "请输入集团名称",},
                    ],
                    customername: [
                        {trigger: "blur", required: true, message: "请输入客户名称",}
                    ],
                    projectname: [
                        {trigger: "blur", required: true, message: "请输入项目名称",}
                    ],
                }
            };
        },
        props: ["id"],
        components: {bottom},
        computed: {
            ...mapGetters(["isSuper"]),

        },
        mounted() {

            if (this.id) {
                this.GetProjectById(this.id).then((res) => {
                    res.keyauthors = res.keyauthors.join(";");
                    res.keyplatform = res.keyplatform.join(";");
                    res.proportion = (res.proportion * 100).toFixed(0);
                    this.ruleForm = res;
                })
            }

        },
        methods: {
            closePage() {
                this.$router.back();
            },

            // 添加项目
            addProject() {

                let auths = trimSplitSpace(this.ruleForm.keyauthors);
                let plats = trimSplitSpace(this.ruleForm.keyplatform);

                let opt = _.assign({}, this.ruleForm, {
                    keyauthors: auths,
                    keyplatform: plats,
                    proportion: (this.ruleForm.proportion / 100).toFixed(2),
                });

                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        this.AddProject(opt).then(() => {
                            this.$message("添加成功");
                            this.closePage();
                        }).catch(err => {
                            this.$message(err.message);
                        });
                    } else {
                        this.$message("操作失败");
                        return false;
                    }
                });
            },

            // 修改项目
            changeProjects() {
                let auths = trimSplitSpace(this.ruleForm.keyauthors);
                let plats = trimSplitSpace(this.ruleForm.keyplatform);

                let opt = _.assign({}, this.ruleForm, {
                    keyauthors: auths,
                    keyplatform: plats,
                    proportion: (this.ruleForm.proportion / 100).toFixed(2),
                });

                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        this.ChangeProject(opt).then(() => {
                            this.$message("编辑成功");
                            this.closePage();
                        }).catch(err=>{
                            this.$message(err.message);
                        });

                    } else {
                        this.$message("操作失败");
                        return false;
                    }
                });
            },

            submitForm() {
                // 编辑  // 创建
                if (this.id) {
                    this.changeProjects();
                } else {
                    this.addProject();
                }
            },

            ...mapActions(["AddProject", "ChangeProject", "GetProjectById"])
        }
    }
</script>
<style>
    .bottom-text {
        margin: 50px 0 38px 0;
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(150, 160, 173, 1);
        line-height: 20px;
    }

    .num-length .el-input {
        width: 43%;
        float: left;
    }

    .num-length input {
        text-align: center !important;
    }

    .num-length span {
        float: left;
        margin: 0 10px;
        color: #CACFE7;
    }

    .like-form-box .el-select {
        width: 100%;
    }

    .like-form-box .el-textarea {
        height: 96px !important;
    }

    .like-form-box .el-textarea__inner {
        height: 96px !important;
        resize: none;
    }

    .like-form-box .el-form-item__content {
        text-align: right !important;

    }

    .like-form-box button {
        width: 150px;
        height: 46px;
        border: 1px solid rgba(105, 103, 206, 1);
        background: rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .like-form-box .el-button--primary:focus, .el-button--primary:hover {
        background: rgba(105, 103, 206, 1);
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .like-form-box button:nth-last-child(1) {
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #6967CE;
        background: #fff;
    }

    .like-form-box .el-button + .el-button {
        margin-left: 49px;
    }

</style>

<style lang="scss" scoped>
    .create-like-box {
        width: 91%;
        margin: 100px 20px 0 190px;
        border: 1px solid rgba(229, 231, 243, 1);
    }

    .create-like {
        width: 100%;
        padding: 10px 0 50px 90px;
        background: #fff;
    }

    .like-title {
        height: 60px;
        line-height: 60px;
        text-align: left;
        width: 80%;
        font-size: 28px;
        color: #2C343D;
        border-bottom: 2px solid #6967CE;
    }

    .like-form-box {
        width: 460px;
        text-align: left;
        padding-top: 38px;
    }


    .pinglun-item {
        width: 590px;
        height: 105px;
        background: #F4F5FA;
        margin-bottom: 15px;
        padding: 15px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(34, 34, 34, 1);
        line-height: 28px;
        text-align: left;
        border-radius: 4px;
        position: relative;

        .num {
            position: absolute;
            top: 15px;
            left: 15px;
        }

        .pinglun-text {
            padding: 0 70px 0 20px;
        }

        .like-num {
            width: 56px;
            height: 36px;
            line-height: 36px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(202, 207, 231, 1);
            border-radius: 4px;
            text-align: center;
            font-size: 16px;
            color: #333C48;
            position: absolute;
            right: 15px;
            top: 50%;
            margin-top: -18px;
        }

    }

    .pinglun-write {
        width: 590px;
        position: relative;

        .pinglun-add {
            width: 60px;
            height: 100%;
            line-height: 110px;
            text-align: center;
            color: #fff;
            background: rgba(105, 103, 206, 1);
            border-radius: 0 4px 4px 0;
            position: absolute;
            right: 0;
            top: 0;

            .iconfont {
                display: block;
                line-height: 12px;
                position: absolute;
                top: 30px;
                left: 50%;
                margin-left: -10px;
            }
        }
    }

    .require {
        width: 590px;
    }
    .require-text {
        text-align: left;
        font-size: 12px;
        color: #D35847;
        height: 20px;
    }


</style>
<style scoped>

</style>