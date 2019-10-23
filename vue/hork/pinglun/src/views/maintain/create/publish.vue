<template>
    <div class="create-publish-box">
        <div class="create-publish">
            <div class="publish-title">发布点赞任务</div>
            <div class="publish-form-box">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="评论数" prop="commentcount">
                        <el-input type="number" v-model="ruleForm.commentcount" placeholder="自动显示机器推荐值"></el-input>
                    </el-form-item>
                    <el-form-item label="跟评数" prop="withcommentcount">
                        <el-input type="number" v-model="ruleForm.withcommentcount" placeholder="自动显示机器推荐值"></el-input>
                    </el-form-item>
                    <el-form-item label="点赞数" prop="likecount">
                        <el-input type="number" :value="ruleForm.likecount" placeholder="自动显示机器推荐值"
                                  :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="评论内容">
                        <!-- 已经撰写但是尚未发布的评论 + 添加的评论内容-->
                        <div class="publish-like-item" v-for="(item, index) in ruleForm.content">
                            <span class="num"> {{index +1 }}、</span>
                            <el-input
                                    type="textarea"
                                    class="pinglun-text dianzan-text"
                                    v-model="ruleForm.content[index].comment"
                            ></el-input>
                            <div class="publish-num">
                                <el-input v-model="ruleForm.content[index].count" @change="(n)=>changeCount(index, n)"></el-input>
                            </div>
                            <div class="pinglun-edit">
                                <img src="@/assets/del-icon.png" alt="" @click="delContent(index)">
                            </div>
                        </div>

                        <!-- todo 机器推荐的评论-->
                        <div class="pinglun-item" v-for="(item, index) in robotContent">
                            <span class="num"> {{index +ruleForm.content.length+1 }}、</span>
                            <el-input
                                    type="textarea"
                                    class="pinglun-text"
                                    v-model="robotContent[index]"
                            ></el-input>
                            <!--推荐值-->
                            <!--<div class="like-num">-->
                            <!--<el-input v-model="robotContent[index].count" @change="changeCount"></el-input>-->
                            <!--</div>-->
                            <div class="pinglun-edit">
                                <img src="@/assets/del-icon.png" alt="" @click="delRobotContent(index)">
                            </div>
                        </div>

                        <div class="pinglun-write">
                            <el-input type="textarea" placeholder="请输入..." v-model="inContent"></el-input>
                            <div class="pinglun-add" @click="addContents"><span class="icon-pinglun iconfont"></span>添加
                            </div>
                            <div class="pinglun-zishu">{{inContent.length}}字</div>
                        </div>
                        <!--todo 05-10-->
                        <!--<div class="robot-add" @click="mcTuijian"><span class="icon-add iconfont"></span>机器推荐</div>-->

                    </el-form-item>
                    <el-form-item label="发布要求">
                        <div class="require fabu_require">
                            <el-input type="textarea"
                                      v-model="ruleForm.remark"
                                      placeholder="请输入..."></el-input>
                        </div>
                    </el-form-item>
                    <!--完成时间-->
                    <complate-time
                            :finisheddt.sync="ruleForm.finisheddt"
                    ></complate-time>

                    <!-- 账号质量 -->
                    <zhi-liang
                            :quality.sync="ruleForm.quality"
                    ></zhi-liang>

                    <el-form-item label="发布供应商">
                        <el-select
                                v-model="ruleForm.supplierid"
                                placeholder="机器推荐供应商">
                            <el-option
                                    v-for="item in supplierDic"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <!-- 点赞质量 -->
                    <zhi-liang
                            :label="`点赞质量`"
                            :text1="`人工赞`"
                            :text2="`机器赞`"
                            :quality.sync="ruleForm.ismachinelike"
                    ></zhi-liang>

                    <jia-ji
                            :disable.sync="ruleForm.likecount==0"
                            :isurgent.sync="ruleForm.isurgent"
                            :supplier-txt="`点赞供应商`"
                            :supplierid.sync="ruleForm.likesupplierid"
                            :supplierDic="supplierLikeDic"
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


    import {vInt} from '@/utils/valid';
    import {trimSN} from '@/utils/index';

    import complateTime from "@/components/complateTime";
    import Jiaji from "@/components/Jiaji";
    import Zhiliang from "@/components/Zhiliang";
    import bottom from "@/components/bottom";
    import map from 'async/map';

    export default {
        name: "publish",
        data() {

            let validateCommentcount = (rule, value, callback) => {
                vInt(value, callback, "请输入正确评论数")
            };

            let validateWithcommentcount = (rule, value, callback) => {
                if (value.toString().length > 0) {
                    vInt(value, callback, "请输入正确跟评数", {min: 0})
                } else {
                    callback();
                }
            };

            return {
                inContent: "",
                supplierDic: [],
                supplierLikeDic:[],
                // 机器推荐评论
                robotContent: [],
                ruleForm: {
                    likecount: 0,
                    "commentcount": 0,
                    "withcommentcount": 0,
                    "content": [],

                    "remark": "",
                    "quality": 0,
                    ismachinelike: 0,
                    "newsid": parseInt(this.id, 10),
                    "projectid": parseInt(this.projectID, 10),

                    "finisheddt": "",
                    likesupplierid: "-1",
                    "supplierid": "",
                    "isurgent": 0
                },
                rules: {
                    commentcount: [
                        {trigger: "blur", validator: validateCommentcount},
                    ],
                    withcommentcount: [
                        {trigger: "blur", validator: validateWithcommentcount},
                    ],

                }
            };
        },
        props: ["id", "projectID"],
        components: {
            "jia-ji": Jiaji,
            "zhi-liang": Zhiliang,
            "complate-time": complateTime,
            bottom
        },
        mounted() {
            // 0通用 1撰写 2发布 3点赞 4反向
            this.GetSuppliersDic(2).then((res) => {

                this.supplierDic = _.filter(res, (v) => {
                    return v.type === 2 || v.type === 0;
                });

                this.supplierLikeDic = _.concat([{key:"-1", value:"无", type:0}], _.filter(res, (v) => {
                    return v.type === 3 || v.type === 0;
                }));

            });
            this.getWriteComment();

        },
        watch: {
            "ruleForm.likesupplierid":function(n, o){
                if(n=="-1" && this.ruleForm.likecount>0){
                    this.$message("点赞数大于0时，请选择点赞供应商")
                }
            },
            "ruleForm.likecount":function(n){
                if(n==0 && this.ruleForm.likesupplierid!="-1"){
                    this.ruleForm.likesupplierid = "-1"
                }
            }
        },
        methods: {
            // 机器推荐评论
            mcTuijian() {
                let needCount = Number(this.ruleForm.withcommentcount) + Number(this.ruleForm.commentcount);
                let robotCount = needCount - this.ruleForm.content.length;
                if (robotCount > 0 || this.robotContent.length > 0) {
                    this.GetRobotComment({
                        id: this.id,
                        count: robotCount
                    }).then((res) => {
                        this.robotContent = res;
                    });
                } else {
                    this.$message("评论内容已够，不需要机器推荐");
                }
            },
            // 已经撰写但是尚未发布的评论
            getWriteComment() {
                this.GetWriteComment({
                    projectId: this.projectID,
                    newsId: this.id
                }).then((res) => {
                    this.ruleForm.content = res;
                    this.sumLikeCount();
                });
            },

            changeCount(index, n) {

                if(_.isNaN(parseInt(n, 10))){
                    this.ruleForm.content[index].count = 0
                }

                this.sumLikeCount();

            },

            // 点赞统计
            sumLikeCount() {
                this.ruleForm.likecount = _.sumBy(this.ruleForm.content, (v) => {
                    if(_.isNil(v.count) || _.isNaN(v.count)){
                        return 0
                    }else{
                        return parseInt(v.count, 10);
                    }
                })
            },

            delContent(index) {
                this.ruleForm.content.splice(index, 1);
                this.sumLikeCount();
            },

            // 删除机器推荐评论
            delRobotContent(index) {
                this.robotContent.splice(index, 1);
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
            addContent(cont, callback) {

                let needCount = Number(this.ruleForm.withcommentcount) + Number(this.ruleForm.commentcount);
                let lastCount = needCount - this.ruleForm.content.length - this.robotContent.length;
                if (lastCount > 0) {
                    if (cont.length) {
                        this.ruleForm.content.push({id: 0, comment: cont, count:0});
                        callback(null, cont)
                    }
                    this.sumLikeCount();
                } else {
                    this.$message("评论内容数量已足够！")
                    callback(cont)
                }

            },

            submitForm(formName) {

                if (this.ruleForm.supplierid.length < 1) {
                    this.$message("必须选择供应商");
                    return;
                }

                if (this.ruleForm.finisheddt.length < 3) {
                    this.$message("必须选择完成时间");
                    return;
                }

                if(this.ruleForm.likecount>0 && this.ruleForm.likesupplierid=="-1"){
                    this.$message("请选择点赞供应商");
                    return;
                }

                _.forEach(this.ruleForm.content, (v) => {
                    v.content = trimSN(v.comment);
                });

                this.ruleForm.remark = trimSN(this.ruleForm.remark);


                if (_.trim(this.ruleForm.withcommentcount).length == 0) {
                    this.ruleForm.withcommentcount = 0;
                }
                // 需要的评论数
                let needCount = Number(this.ruleForm.withcommentcount) + Number(this.ruleForm.commentcount);
                // 实际还能填写的评论数
                let lastCount = needCount - this.ruleForm.content.length;

                let opt = _.assign({},
                    _.cloneDeep(this.ruleForm),
                    {
                        ismachinelike: this.ruleForm.ismachinelike == 0 ? false : true,
                        likesupplierid: this.ruleForm.likesupplierid=="-1"? "": this.ruleForm.likesupplierid,
                        finisheddt: this.ruleForm.finisheddt
                    });

                // 用机器推荐补足差额

                if (lastCount > 0 && this.robotContent.length > 0) {
                    this.robotContent.forEach((v) => {
                        opt.content.push({id: 0, comment: v});
                    })
                }

                if (opt.content.length !== needCount) {
                    this.$message("评论数与内容数不符");
                    return false;
                }

                this.$refs[formName].validate((valid) => {
                    if (valid) {

                        this.AddPublishLike(opt).then(() => {
                            this.$message("提交成功");
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


            ...mapActions(["AddPublish", "AddPublishLike", "GetSuppliersDic", "GetWriteComment", "GetRobotComment"])
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

    .publish-form-box .el-select {
        width: 100%;
    }

    .publish-form-box .el-textarea {
        height: 100% !important;
    }

    .publish-form-box .el-textarea__inner {
        height: 105px !important;
        resize: none;
        padding-right: 70px;
    }
    .fabu_require .el-textarea__inner {
        padding: 5px 15px !important;
    }

    .publish-form-box .el-form-item__content {
        text-align: right !important;

    }

    // .pinglun-text {
    //     .el-textarea__inner {
    //         height: 80px !important;
    //         width: 90% !important;
    //         background: none !important;
    //         border: none !important;
    //         padding: 18px 45px 5px 35px !important;
    //     }
    // }
    .dianzan-text {
        .el-textarea__inner {
            height: 100% !important;
            width: 87% !important;
            background: none !important;
            border: none !important;
            padding: 13px 10px 5px 35px !important;
        }
    }

    .publish-form-box button {
        width: 150px;
        height: 46px;
        border: 1px solid rgba(105, 103, 206, 1);
        background: rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .publish-form-box .el-button--primary:focus, .el-button--primary:hover {
        background: rgba(105, 103, 206, 1);
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
    }

    .publish-form-box button:nth-last-child(1) {
        border: 1px solid rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #6967CE;
        background: #fff;
    }

    .publish-form-box .el-button + .el-button {
        margin-left: 49px;
    }

</style>

<style lang="scss" scoped>

    .pinglun-update {
        position: absolute;
        right: 5px !important;
        top: 0px !important;
    }
    .create-publish-box {
        width: 91%;
        margin: 100px 20px 0 190px;
        border: 1px solid rgba(229, 231, 243, 1);
    }

    .create-publish {
        width: 100%;
        padding: 10px 0 50px 90px;
        background: #fff;
    }

    .publish-title {
        height: 60px;
        line-height: 60px;
        text-align: left;
        width: 80%;
        font-size: 28px;
        color: #2C343D;
        border-bottom: 2px solid #6967CE;
    }

    .publish-form-box {
        width: 460px;
        text-align: left;
        padding-top: 38px;
    }

    .publish-form-box .urgent {
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

    .publish-like-item {
        width: 590px;
        height: 105px;
        background: #F4F5FA;
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: 400;
        color: #222222;
        line-height: 28px;
        text-align: left;
        border-radius: 4px;
        position: relative;
        border: 1px solid #DCDFE6;
        padding: 5px 10px;
         .num {
            position: absolute;
            top: 15px;
            left: 15px;
        }

        // .pinglun-text {
        //     textarea {
        //         width: 100%;
        //         height: 100%;
        //         border: none;
        //     }

        //     .el-textarea__inner {
        //         padding: 16px 30px 20px 80px !important;
        //         border: none;
        //     }
        // }

        .pinglun-edit {
            img {
                position: none;
            }
        }

        .publish-num {
            width: 56px;
            line-height: 36px;
            background: rgba(255, 255, 255, 1);
            // border: 1px solid rgba(202, 207, 231, 1);
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
        width: 30px;
        height: 103px;
        line-height: 0 !important;
        text-align: center;
        color: #CACFE7;
        background: none !important;
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

    .require {
        width: 590px;
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