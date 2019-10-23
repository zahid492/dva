<template>
    <div class="create-reverse-box">
        <div class="create-reverse">
            <div class="reverse-title">反向任务</div>
            <div class="reverse-form-box">
                <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <div class="reverse-item" v-for="(item, index) in ruleForm.content">
                        <el-form-item label="反向" prop="name">
                            <el-input v-model="ruleForm.content[index].count" placeholder="500"></el-input>
                        </el-form-item>
                        <el-form-item label="评论内容">
                            <div class="reverse-like-item">
                                <span class="num"> {{index+1}}、</span>
                                <el-input type="textarea"
                                          class="pinglun-text pinglun-content"
                                          v-model="ruleForm.content[index].comment"
                                          placeholder=""></el-input>
                                <div class="pinglun-edit" @click="delComment(index)">
                                    <img src="@/assets/del-icon.png" alt="">
                                </div>
                            </div>
                        </el-form-item>
                    </div>

                    <el-form-item label="反向" prop="name">
                        <el-input v-model="icount" placeholder="500"></el-input>
                    </el-form-item>
                    <el-form-item label="评论内容">
                        <div class="reverse-like-item">
                            <span class="num"></span>
                            <el-input type="textarea"
                                      class="pinglun-text pinglun-content2"
                                      v-model="inContent"
                                      placeholder=""></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="pinglun-write">
                            <div class="robot-add" @click="addContents"><span class="icon-add iconfont"></span>添加反向</div>
                        </div>
                    </el-form-item>
                    <complate-time
                            :finisheddt.sync="ruleForm.finisheddt"
                    ></complate-time>
                    <!-- 重要，供应商，完成时间 -->
                    <jia-ji
                            :isurgent.sync="ruleForm.isurgent"
                            :supplierid.sync="ruleForm.supplierid"
                            :supplier-dic="supplierDic"
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

    import validator from 'validator';
    import {trimSN} from '@/utils/index';
    import complateTime from "@/components/complateTime";
    import Jiaji from "@/components/Jiaji";
    import bottom from "@/components/bottom";
    import map from 'async/map';


    export default {
        name: "reverse",
        data() {
            let validateLikecount = (rule, value, callback) => {
                vInt(value, callback, "请输入正确反向数", {min:1})
            };

            return {
                icount:"500",
                inContent:"",
                supplierDic: [],
                ruleForm: {
                    "content": [],
                    "newsid": parseInt(this.id, 10),
                    "projectid": parseInt(this.projectID, 10),

                    "finisheddt": "",
                    "supplierid": "",
                    "isurgent": 0
                },
                rules: {
                    likecount: [
                        {trigger: "blur", validator: validateLikecount},
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
            this.GetSuppliersDic(4).then((res) => {
                this.supplierDic = _.filter(res, (v)=>{
                    return v.type == 4 || v.type == 0;
                });
            });

        },
        methods: {
            delComment(index){
                this.ruleForm.content.splice(index, 1);
            },

            addContents() {
                let scs = _.map(_.filter(this.inContent.split("\n"), (v) => {
                    return trimSN(v).length > 0;
                }), (v) => {
                    return trimSN(v)
                });

                this.inContent = "";

                if (scs.length > 0) {
                    map(scs, this.addContent, function (err, res) {
                        // todo err.length>0
                    });
                }
            },

            addContent(cont, callback){

                if(this.ruleForm.content.length>=5){
                    this.$message("最多添加五条反向")
                }else {
                    this.ruleForm.content.push({
                        id:0,
                        count: this.icount,
                        comment: cont,
                    });

                    callback(null, cont);
                    this.icount = "500";
                }

            },
            submitForm(formName) {
                if(_.trim(this.inContent).length>0){
                    this.addContents();
                }

                if(this.ruleForm.content.length<5 && _.trim(this.icontent).length>0){

                    this.ruleForm.content.push({
                        id:0,
                        count: this.icount,
                        comment: this.icontent,
                    });

                    this.icount = "500";
                    this.icontent = "";
                }

                if(this.ruleForm.supplierid.length<1){
                    this.$message("必须选择供应商");
                    return;
                }

                if(this.ruleForm.finisheddt.length<3){
                    this.$message("必须选择完成时间");
                    return;
                }

                if(this.ruleForm.content.length<1){
                    this.$message("必须添加反向");
                    return;
                }


                if(this.ruleForm.content.length>0 && !_.every(this.ruleForm.content, (v)=>{
                    if(!validator.isInt(v.count, {min:1}) || _.trim(v.comment).length<1){
                        return false;
                    }
                    return true;
                })){
                    this.$message("请正确填写反向和评论内容");
                    return;
                }

                let opt = _.assign({},
                    this.ruleForm,
                    {finisheddt: this.ruleForm.finisheddt});

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.AddQuicklike(opt).then(() => {
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
            ...mapActions(["AddQuicklike", "GetSuppliersDic"])
        }
    }
</script>
<style lang="scss">
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

    .reverse-form-box .el-select {
        width: 100%;
    }

    .reverse-form-box .el-textarea {
        height: 100% !important;
    }

    .reverse-form-box .el-textarea__inner {
        height: 105px !important;
        resize: none;
    }

    .reverse-form-box .el-form-item__content {
        text-align: right !important;

    }

    .pinglun-text {
        .el-textarea__inner {
            height: 100% !important;
        }
    }
    .pinglun-content{
        background: #FFF;
        border: 1px solid #DCDFE6;
         .el-textarea__inner {
            border: none;
            width: 90%;
            padding: 16px 20px 20px 35px !important;
        }
    }
    .pinglun-content2{
        background: #FFF;
        border: 1px solid #DCDFE6;
         .el-textarea__inner {
            border: none;
            width: 100%;
            padding: 16px 20px 20px 35px !important;
        }
    }

    .reverse-form-box button {
        width: 150px;
        height: 46px;
        border: 1px solid rgba(105, 103, 206, 1);
        background: rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .reverse-form-box .el-button--primary:focus, .el-button--primary:hover {
        background: rgba(105, 103, 206, 1);
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .reverse-form-box button:nth-last-child(1) {
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #6967CE;
        background: #fff;
    }

    .reverse-form-box .el-button + .el-button {
        margin-left: 49px;
    }
     .require {
        width: 590px;
        .el-textarea__inner {
            padding: 5px 15px !important;
        }

    }

</style>

<style lang="scss" scoped>
    .create-reverse-box {
        width: 91%;
        margin: 100px 20px 0 190px;
        border:1px solid rgba(229,231,243,1);
    }

    .create-reverse {
        width: 100%;
        padding: 10px 0 50px 90px;
        background: #fff;

        .robot-add {
            margin: 18px 0 20px 0;
        }
    }

    .reverse-title {
        height: 60px;
        line-height: 60px;
        text-align: left;
        width: 80%;
        font-size: 28px;
        color: #2C343D;
        border-bottom: 2px solid #6967CE;
    }

    .reverse-form-box {
        width: 460px;
        text-align: left;
        padding-top: 38px;
    }

    .reverse-form-box .urgent {
        width: 150px;
        height: 46px;
        font-size: 16px;
        color: #333C48;
        float: left;
        text-align: center;
        border: 1px solid rgba(202, 207, 231, 1);
        border-radius: 4px;
        margin-right: 49px;
    }

    .urgent:nth-last-child(1) {
        margin-right: 0px;
    }

    .urgent-box .active {
        background: #E10601;
        border: 1px solid #E10601;
        color: #fff;
        position: relative;
    }

    .urgent-icon {
        display: none;
    }

    .active .urgent-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        display: block;
    }

    .reverse-like-item {
        width: 590px;
        height: 105px;
        background: #F4F5FA;
        margin-bottom: 15px;
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
            textarea {
                width: 100%;
                height: 100%;
                border: none;
            }

            .el-textarea__inner {
                padding: 10px 30px 20px 80px !important;
            }
        }

        .reverse-num {
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
    }

    .reverse-item {
        width: 700px;
        border-bottom: 1px solid #CACFE7;
        margin-bottom: 20px;
    }

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

    .pinglun-edit {
        width: 60px;
        height: 103px;
        line-height: 96px;
        text-align: center;
        color: #CACFE7;
        background: #F4F5FA;
        border-radius: 0 4px 4px 0;
        position: absolute;
        right: 1px;
        top: 1px;
        border: 1px solid transparent;

        img {
            margin-right: 5px;
        }
    }

    .pinglun-zishu {
        font-size: 12px;
        font-weight: 400;
        color: rgba(105, 119, 143, 1);
        position: absolute;
        bottom: -35px;
        left: 0;
    }

   

    .robot-add {
        width: 590px;
        height: 46px;
        background: rgba(244, 245, 250, 1);
        border-radius: 4px;
        font-size: 16px;
        color: #222222;
        text-align: center;
        line-height: 46px;
        margin: 40px 0 20px 0;
        cursor: pointer;
    }


</style>