<template>
    <div class="create-like-box">
        <div class="create-like">
            <div class="like-title">点赞任务</div>
            <div class="like-form-box">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm ">
                    <el-form-item label="点赞数" prop="likecount">
                        <el-input type="number" :value="ruleForm.likecount" placeholder="自动显示机器推荐值"
                                  :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="评论内容">
                        <div class="pinglun-item like-add-item" v-for="(cont, index) in  ruleForm.content">
                            <span class="num"> {{index + 1}}、</span>
                            <el-input type="textarea"
                                      class="pinglun-text"
                                      v-model="ruleForm.content[index].comment"
                                      placeholder=""></el-input>
                            <!--推荐值-->
                            <div class="like-num">
                                <el-input v-model="ruleForm.content[index].count" @change="changeCount"></el-input>
                            </div>
                            <!--已完成的任务不能删除和修改 正确：!==2 -->
                            <div class="pinglun-edit" @click="delContent(index)">
                                <img src="@/assets/del-icon.png" alt="">
                            </div>
                        </div>


                        <div class="pinglun-write">
                            <el-input type="textarea" placeholder="请输入..." v-model="inContent"></el-input>
                            <div class="pinglun-add" @click="addContents"><span class="icon-pinglun iconfont"></span>添加
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="要求">
                        <div class="require yaoqiu-inp">
                            <el-input type="textarea" placeholder="请输入..." v-model="ruleForm.remark"></el-input>
                        </div>
                    </el-form-item>
                    <!-- 点赞质量 -->
                    <zhi-liang
                            :label="`点赞质量`"
                            :text1="`人工赞`"
                            :text2="`机器赞`"
                            :quality.sync="ruleForm.ismachinelike"
                    ></zhi-liang>

                    <!--完成时间-->
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
        name: "like",
        data() {

            let validateLikecount = (rule, value, callback) => {
                vInt(value, callback, "请输入正确点赞数", {min: 1})
            };

            let validateContent = (rule, value, callback) => {
                if (_.size(value) <= 0) {
                    callback(new Error("请输入评论内容"));
                } else {
                    callback();
                }
            };

            return {
                inContent: "",
                supplierDic: [],
                tjComments: [],
                ruleForm: {
                    "likecount": 0,
                    "content": [],
                    "remark": "",
                    "newsid": parseInt(this.id, 10),
                    "projectid": parseInt(this.projectID, 10),
                    "finisheddt": "",
                    "supplierid": "",
                    "isurgent": 0,
                    ismachinelike: 0
                },
                rules: {
                    likecount: [
                        {trigger: "blur", validator: validateLikecount},
                    ],
                    content: [
                        {trigger: "blur", validator: validateContent}
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
            this.GetSuppliersDic(3).then((res) => {
                this.supplierDic = _.filter(res, (v) => {
                    return v.type == 3 || v.type == 0;
                });
            });

            // 机器推荐 已发布的评论
            this.GetProjectComments({
                projectId: this.projectID,
                newsId: this.id,
                types: [2]
            }).then((res) => {
                this.ruleForm.content = _.map(res, (v) => {
                    v.comment = v.content;
                    // 推荐值
                    v.count = 0;
                    return v;
                });

                this.ruleForm.likecount = _.sumBy(this.ruleForm.content, (v) => {
                    return v.count;
                })
            });
        },
        watch: {
            "ruleForm.likecount": function (n, o) {
                console.log(n, o)
            }
        },
        methods: {
            // 点赞数统计
            setLikeCount(){
                this.ruleForm.likecount = _.sumBy(this.ruleForm.content, (v) => {
                    if(_.isNil(v.count)|| _.isNaN(v.count)){
                        return 0;
                    }else{
                        return parseInt(v.count, 10);
                    }

                })
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
            // 添加评论
            addContent(cont, callback) {

                if (cont.length) {
                    this.ruleForm.content.push({
                        id: 0,
                        comment: cont,
                        count: 50,
                    });
                    callback(null, cont);
                    this.setLikeCount();
                }

            },
            // 删除添加和推荐的评论
            delContent(index) {
                this.ruleForm.content.splice(index, 1);
                this.setLikeCount();
            },
            changeCount(val) {
                let v = parseInt(val, 10);
                if (_.isNaN(v) || v <= 0) {
                    this.$message("点赞数必须大于0");
                    return;
                } else {
                    this.setLikeCount();
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

                if (_.some(this.ruleForm.content, (v) => {
                    if (parseInt(v.count, 10) <= 0 || _.isNaN(v.count)) {
                        return true;
                    }
                    return false;
                })) {
                    this.$message("点赞数必须为大于0的整数");
                    return;
                }

                this.ruleForm.remark = trimSN(this.ruleForm.remark);

                if (this.ruleForm.content.length >= 1) {
                    let lcount = _.reduce(this.ruleForm.content, (sum, v) => {
                        return sum + parseInt(v.count, 10);
                    }, 0);

                    if (lcount !== parseInt(this.ruleForm.likecount, 10)) {
                        this.$message("评论的点赞数总和和要求的点赞数不一致");
                        return;
                    }
                }

                let opt = _.assign({},
                    this.ruleForm,
                    {
                        finisheddt: this.ruleForm.finisheddt,
                        ismachinelike: this.ruleForm.ismachinelike == 0 ? false : true,
                    });

                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.AddLike(opt).then(() => {
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
            ...mapActions(["AddLike", "GetSuppliersDic", "GetProjectComments"])
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
        resize: none;
    }

    .yaoqiu-inp .el-textarea__inner, .pinglun-write .el-textarea__inner {
        height: 96px !important;
        resize: none;
        padding: 5px 70px 5px 15px;
    }

    .pinglun-item .el-textarea__inner {
        height: 80px !important;
        background: none;
        border: none;

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

    .pinglun-edit {
        width: 20px;
        height: 20px;
        text-align: center;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 5px;
        border: 1px solid transparent;

        img {
            margin-right: 5px;
            position: absolute;
            top: 0;
            right: 0;
        }
    }

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
            padding-left: 20px;

            .el-textarea__inner {
                padding: 5px 15px !important;
            }
        }

        .like-num {
            width: 56px;
            height: 36px;
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

        input {
            border: 1px solid #ccc !important;
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
    }

    .require {
        width: 590px;
    }

    .like-add-item {
        .pinglun-text {
            padding: 0 70px 0 30px !important;

        }

        .el-textarea__inner {
            padding: 5px 20px 5px 15px !important;
        }
    }

</style>