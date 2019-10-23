<template>
    <div class="create-write-box">
        <div class="create-write">
            <div class="write-title">撰写任务</div>
            <div class="write-form-box">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="评论数" prop="writecount">
                        <el-input type="number" v-model="ruleForm.writecount" placeholder="自动显示机器推荐值"></el-input>
                    </el-form-item>
                    <el-form-item label="字数" class="num-length">
                        <el-input
                                  v-model="ruleForm.minlength"
                                  min="1"
                                  @change="changeMin"
                                  placeholder="10"></el-input>
                        <span>——</span>
                        <el-input
                                  v-model="ruleForm.maxlength"
                                  min="1"
                                  @change="changeMax"
                                  placeholder="20"></el-input>
                    </el-form-item>
                    <complate-time
                            :finisheddt.sync="ruleForm.finisheddt"
                    ></complate-time>
                    <!-- 重要，供应商，完成时间 -->
                    <jia-ji
                            :isurgent.sync="ruleForm.isurgent"
                            :supplierid.sync="ruleForm.supplierid"
                            :supplierDic="supplierDic"
                    ></jia-ji>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- 底部 -->
        <bottom></bottom>
    </div>

</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import validator from 'validator';
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

    import complateTime from "@/components/complateTime";
    import Jiaji from "@/components/Jiaji";
    import bottom from "@/components/bottom";

    export default {
        name: "write",
        data() {
            let validateWritecount = (rule, value, callback) => {

                if (!validator.isInt(value.toString()) || parseInt(value, 10)<=0) {
                    callback(new Error("请输入正确评论数"));
                } else {
                    callback();
                }
            };
            return {
                supplierDic: [],
                ruleForm: {
                    newsid: parseInt(this.id, 10),
                    projectid: parseInt(this.projectID, 10),
                    writecount: 5,
                    minlength: 10,
                    maxlength: 25,

                    finisheddt: "",
                    supplierid: "",
                    isurgent: 0
                },
                rules: {
                    writecount: [
                        {trigger: "blur", type: "number", validator: validateWritecount},
                    ],
                }
            };
        },
        props: ["id", "projectID"],
        components: {
            "jia-ji": Jiaji,
            "complate-time":complateTime,
            bottom
        },
        mounted() {
            // 0通用 1撰写 2发布 3点赞 4反向
            this.GetSuppliersDic(1).then((res) => {
                this.supplierDic = _.filter(res, (v)=>{
                    return v.type === 1 || v.type === 0;
                });
            });
        },

        methods: {
            changeMin(val){
                let v = parseInt(val, 10);
                if(_.isNaN(v) || v<=0){
                    this.ruleForm.minlength = 10;
                    return;
                }else{
                    this.ruleForm.minlength = v;
                }
            },

            changeMax(val){
                let v = parseInt(val, 10);
                if(_.isNaN(v) || v<=0){
                    this.ruleForm.maxlength = 25;
                }else{
                    this.ruleForm.maxlength = v;
                }
            },
            submitForm(formName) {

                if(this.ruleForm.supplierid.length<1){
                    this.$message("必须选择供应商");
                    return;
                }

                if(this.ruleForm.finisheddt.length<3){
                    this.$message("必须选择完成时间");
                    return;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let opt =_.assign({}, this.ruleForm, {finisheddt: this.ruleForm.finisheddt});
                        this.AddWrite(opt).then(() => {
                            this.$router.push("/maintain-list");
                        });
                    } else {
                        this.$message("填写错误");
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$router.push("/maintain-list")
            },

            ...mapActions(["AddWrite", "GetSuppliersDic"])
        }
    }
</script>
<style>


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

    .write-form-box .el-select {
        width: 100%;
    }

    .write-form-box .el-form-item__content {
        text-align: right !important;
    }

    .write-form-box button {
        width: 150px;
        height: 46px;
        border: 1px solid rgba(105, 103, 206, 1);
        background: rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .write-form-box .el-button--primary:focus, .el-button--primary:hover {
        background: rgba(105, 103, 206, 1);
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .write-form-box button:nth-last-child(1) {
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #6967CE;
        background: #fff;
    }

    .write-form-box .el-button + .el-button {
        margin-left: 49px;
    }

</style>

<style lang="scss" scoped>
    .create-write-box {
        width: 91%;
        margin: 100px 20px 0 190px;
        border:1px solid rgba(229,231,243,1);
    }

    .create-write {
        width: 100%;
        padding: 10px 0 0 90px;
        background: #fff;
    }

    .write-title {
        height: 60px;
        line-height: 60px;
        text-align: left;
        width: 80%;
        font-size: 28px;
        color: #2C343D;
        border-bottom: 2px solid #6967CE;
    }

    .write-form-box {
        width: 460px;
        height: 460px;
        text-align: left;
        padding-top: 38px;
    }


</style>
