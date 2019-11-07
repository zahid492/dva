<template>
    <div>
        <el-row>
            <el-col :span="24">
                <div id="sentence_search">
                    <el-form ref="form" :inline="true"
                             label-width="50px"
                             size="small"
                             class="sentence-form">
                        <el-form-item label="平台："
                                      label-width="50">
                            <el-select v-model="platform"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option
                                        v-for="(item, i) in platformList"
                                        :key="item._id"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="启停状态："
                                      label-width="50">
                            <el-select v-model="status"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >

                                <el-option key="-1" label="全部" :value="-1">
                                </el-option>
                                <el-option key="1" label="启用" :value="1">
                                </el-option>
                                <el-option key="0" label="停用" :value="0">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="异常类别："
                                      label-width="50">
                            <el-select v-model="normal"
                                       placeholder="全部"
                                       size="small"
                                       style="width:120px"
                            >
                                <el-option key="-1" label="全部" :value="-1"></el-option>
                                <el-option key="1" label="正常" :value="1"></el-option>
                                <el-option key="0" label="异常" :value="0"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关键字：" label-width="50">
                            <el-input
                                    style="width:120px"
                                    v-model="key"
                                    placeholder=""></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="searchQuery">查询</el-button>
                        </el-form-item>

                        <el-form-item>
                            <el-button size="small" type="primary" @click="addOpen">添加</el-button>
                        </el-form-item>


                        <el-form-item>
                            <el-button size="small" type="primary" @click="exportTaskExcel">导出</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="24">
                <el-table
                        v-loading="loading"
                        :data="list"
                        :border="true"
                        :stripe="true"
                        :row-key="rowKey"
                        size="mini"
                        style="width:100%;"
                >
                    <el-table-column
                            label="序号"
                            type="index"
                            width="50"
                            :index="indexMethod"
                    ></el-table-column>

                    <el-table-column
                            prop="name"
                            label="账号名称"
                            width="120"
                    ></el-table-column>

                    <el-table-column
                            prop="category"
                            label="分类"
                            width="80"
                    ></el-table-column>

                    <el-table-column
                            prop="platform"
                            label="平台"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="statusName"
                            label="启停状态"
                            width="70"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="normalName"
                            label="异常状态"
                            width="70"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="publishTypesStr"
                            label="发布分类"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="fansCnt"
                            label="粉丝数"
                            width="70"
                    >
                    </el-table-column>

                    <el-table-column
                            prop="publishInterval"
                            label="发布间隔"
                            width="80"
                    >
                        <template slot-scope="scope">
                            {{scope.row.publishInterval===0?"-":scope.row.publishInterval+"小时"}}
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="timeRange"
                            label="发布时段"
                            width="100"
                    >
                    </el-table-column>

                    <el-table-column
                            label="操作"
                    >
                        <template slot-scope="scope">

                            <el-button type="primary" size="mini" @click="editOpen(scope.row)">编辑</el-button>
                            <el-button :type="scope.row.status===1?'':'warning'" size="mini"
                                       @click="accountStop(scope.row)">
                                {{scope.row.status===1?"停用":"启用"}}
                            </el-button>

                            <el-button type="success" size="mini"
                                       v-if="scope.row.normal!==1"
                                       @click="statusOpen(scope.row)">正常
                            </el-button>

                            <el-button :type="scope.row.enablePublish===1?'':'warning'"
                                       size="mini"
                                       @click="publishOpen(scope.row)">
                                {{scope.row.enablePublish===1?"停止":"自动"}}发布
                            </el-button>

                            <el-button size="mini" @click="cookieOpen(scope.row)" class="cookie-refresh">刷新cookie
                            </el-button>

                            <el-button
                                    v-if="scope.row.platform==='易车号'||scope.row.platform==='爱卡汽车'"
                                    size="mini"
                                    @click="addVideo(scope.row)"
                                    class="cookie-refresh">发布视频
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
                            :current-page.sync="page"
                            :page-size="size"
                            layout="prev, pager, next, jumper"
                            :total="count">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>

        <!--   添加     -->
        <el-dialog
                title="账号"
                :visible.sync="addAuthVisible"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="addForm"
                     label-width="100px"
                     :model="form"
                     size="small">

                <el-form-item label="平台："
                >
                    <el-select v-model="authPlatform"
                               placeholder="请选择平台"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item, i) in authList"
                                :key="item._id"
                                :label="item.account_type"
                                :value="item.loginUrl">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAuth">取 消</el-button>
                <el-button type="primary" @click="addAuthItem" id="account_add">确 定</el-button>
            </div>
        </el-dialog>

        <!--    编辑，appid 不修改    -->
        <el-dialog
                title="账号"
                :visible.sync="addDialogVisible"
                :close-on-click-modal="false"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="addForm"
                     label-width="100px"
                     :model="form"
                     :rules="rules"
                     size="small">

                <el-form-item label="平台："
                >
                    <el-select v-model="form.platform"
                               placeholder="全部"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item, i) in platformList"
                                :key="item._id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账号名称：" prop="name">
                    <el-input
                            :disabled="true"
                            style="width:200px"
                            v-model="form.name"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="账号分类："
                >
                    <el-select v-model="form.categoryId"
                               placeholder="全部"
                               size="small"
                               style="width:200px"
                               @change="getRelationArticleType"
                    >
                        <el-option
                                v-for="(item, i) in accountTypeList"
                                :key="item._id"
                                :label="item.name"
                                :value="item._id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="文章分类：">
                    <el-input
                            style="width:400px"
                            :disabled="true"
                            v-model="form.publishTypesStr"
                            placeholder=""></el-input>

                </el-form-item>

                <el-form
                        :inline="true"
                        label-width="100px"
                        :model="form"
                        :rules="rules"
                        size="small"
                >
                    <el-form-item label="发布时段：" prop="s1">
                        <el-input
                                style="width:50px;"
                                v-model="form.s1"
                                placeholder=""
                                maxlength="2"
                                ref="s1"
                                @input="(v)=>changeTime('s2', v)"
                        ></el-input>
                    </el-form-item>

                    <span class="timeInput">:</span>

                    <el-form-item style="width:50px">
                        <el-input
                                style="width:50px;"
                                v-model="form.s2"
                                maxlength="2"
                                placeholder=""
                                ref="s2"
                                @input="(v)=>changeTime('t1', v)"
                        ></el-input>
                    </el-form-item>

                    <span class="timeInput" style="width:20px;">-</span>

                    <el-form-item style="width:50px">
                        <el-input
                                style="width:50px;"
                                v-model="form.t1"
                                maxlength="2"
                                placeholder=""
                                ref="t1"
                                @input="(v)=>changeTime('t2', v)"
                        ></el-input>
                    </el-form-item>

                    <span class="timeInput">:</span>
                    <el-form-item style="width:50px">
                        <el-input
                                ref="t2"
                                style="width:50px;"
                                v-model="form.t2"
                                maxlength="2"
                                placeholder=""
                        ></el-input>
                    </el-form-item>
                </el-form>

                <el-form-item label="发布间隔：">

                    <el-select v-model="form.publishInterval"
                               placeholder="请选择"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item) in publishIntervalList"
                                :key="item"
                                :label="item+'小时'"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="addAjaxItem">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
                title="视频"
                :visible.sync="yicheVisible"
                :close-on-click-modal="false"
                width="40%"
                custom-class="article-category-form"
        >
            <el-form ref="yicheForm"
                     label-width="100px"
                     :model="yicheForm"
                     :rules="yicheRules"
                     size="small">

                <el-form-item label="平台："
                >
                    <el-input
                            :disabled="true"
                            style="width:200px"
                            v-model="yicheForm.account"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="标题：" prop="title">
                    <el-input
                            style="width:200px"
                            v-model="yicheForm.title"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="描述："
                              v-if="videoPlatform===yicheName"
                              prop="description">
                    <el-input
                            type="textarea"
                            :rows="3"
                            style="width:400px"
                            v-model="yicheForm.description"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="视频链接："
                              v-if="videoPlatform===aikaName"
                              prop="videoUrl">
                    <el-input
                            type="text"
                            style="width:400px"
                            v-model="yicheForm.videoUrl"
                            placeholder=""></el-input>
                </el-form-item>

                <el-form-item label="封面："
                              v-if="videoPlatform===yicheName"
                              prop="coverUrl">
                    <el-upload
                            :auto-upload="true"
                            :action="uploadVideoUrl"
                            class="upload-yiche"
                            accept=".jpg,.jpeg,.png,.gif"
                            :before-upload="beforeYichePoster"
                            :http-request="uploadYichePoster"
                            :on-remove="removeYichePoster"
                            :file-list="yichePosterList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传 .jpg,.jpeg,.png,.gif 文件，且不超过10M</div>
                    </el-upload>
                    <div class="uplist" v-if="yicheForm.coverUrl">
                        <div class="pic">
                            <img :src="yicheForm.coverUrl" alt="">
                        </div>
                    </div>
                </el-form-item>

                <el-form-item label="视频："
                              v-if="videoPlatform===yicheName"
                              prop="videoUrl">
                    <el-upload
                            :auto-upload="true"
                            :action="uploadVideoUrl"
                            class="upload-yiche"
                            accept=".mp4"
                            :before-upload="beforeYicheVideo"
                            :http-request="uploadYicheVideo"
                            :on-remove="removeYicheVideo"
                            :file-list="yicheVideoList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传 .mp4 文件，且不超过100M</div>
                    </el-upload>

                    <div class="uplist" v-if="yicheForm.videoUrl">
                        <div class="vbox">
                            <video class="video"
                                   preload="auto"
                                   controls
                                   webkit-playsinline="true"
                                   playsinline="true"
                            >
                                <source :src="yicheForm.videoUrl" type="video/mp4"/>
                            </video>
                        </div>
                    </div>
                </el-form-item>


                <el-form-item label="标签：" prop="tags"
                >
                    <el-select v-model="yicheForm.tags"
                               placeholder="请选择"
                               size="small"
                               multiple
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item, i) in yicheTagList"
                                :key="item._id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="车型：" prop="carModel"
                >
                    <el-select v-model="yicheForm.carModel"
                               placeholder="请选择"
                               size="small"
                               style="width:200px"
                    >
                        <el-option
                                v-for="(item, i) in yicheTypeList"
                                :key="item._id"
                                :label="item.name"
                                :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelYiche">取 消</el-button>
                <el-button type="primary" @click="addYiche">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapGetters} from "vuex";
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
        TimePicker,
        Loading,
        Upload

    } from "element-ui";


    import {Api, userApi, picApi} from "../../utils/api";
    import service from "@/utils/request";
    import serviceUser from "@/utils/requestUser";

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
        Vue.use(TimePicker);
        Vue.use(Loading);
        Vue.use(Upload);
    }

    import Cookies from "js-cookie";

    const moment = window.moment;
    const $ = window.$;

    export default {
        name: "mymedia-accounts",
        data: function () {
            return {
                yicheName: "易车号",
                aikaName: "爱卡汽车",
                videoPlatform: "",
                uploadVideoUrl: config.apiPath + Api.yicheUpVideo,
                uploadPosterUrl: config.apiPath + Api.yicheUpPoster,
                yicheTagList: [],
                yicheTypeList: [],
                yicheVisible: false,
                yichePosterList: [],
                yicheVideoList: [],
                yicheForm: {
                    account: "",
                    title: "",
                    description: "",
                    coverUrl: "",
                    videoUrl: "",
                    tags: [],
                    carModel: "",
                },
                yicheRules: {

                    title: [
                        {required: true, message: "请输入标题", trigger: "blur"},
                        {min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur'}
                    ],

                    description: [
                        {required: true, message: "请输入描述", trigger: "blur"},
                        {min: 1, max: 120, message: '长度在 1 到 120 个字符', trigger: 'blur'}
                    ],

                    coverUrl: [
                        {required: true, message: "请上传封面", trigger: "blur"},
                    ],

                    videoUrl: [
                        {required: true, message: "请上传视频", trigger: "blur"},
                    ],

                    tags: [
                        {required: true, message: "请选择标签", trigger: "blur"},
                    ],
                    carModel: [
                        {required: true, message: "请选择车型", trigger: "blur"},
                    ],

                },

                platform: "全部",
                //异常类别
                normal: -1,
                status: -1,
                //关键字
                key: "",
                loading: false,

                page: 1,
                size: 10,
                count: 0,

                list: [],
                //平台
                platformList: [],

                addDialogVisible: false,
                addAuthVisible: false,

                form: {
                    name: "",
                    category: "",
                    categoryId: "",
                    platform: "",
                    appId: "",
                    appToken: "",
                    publishTypes: [],
                    publishInterval: 0,
                    s1: "",
                    s2: "",
                    t1: "",
                    t2: "",
                    cookie: "",
                },
                rules: {
                    name: [
                        {required: true, message: "请输入账号名称", trigger: "blur"},
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
                    ],

                    s1: [
                        {min: 2, max: 2, message: '2 个字符', trigger: 'blur'}
                    ],
                    s2: [
                        {min: 2, max: 2, message: '2 个字符', trigger: 'blur'}
                    ],
                    t1: [
                        {min: 2, max: 2, message: '2 个字符', trigger: 'blur'}
                    ],
                    t2: [
                        {min: 2, max: 2, message: '2 个字符', trigger: 'blur'}
                    ]
                },

                publishIntervalList: _.range(1, 25),

                isEdit: false,

                accountTypeList: [],

                articleTypeList: [],
                // 平台添加url
                authPlatform: "",
                authList: [],

                timer: null,
            }
        },

        computed: {

            searchObj: function () {
                return {
                    page: this.page,
                    size: this.size,

                    platform: this.platform === "全部" ? "" : this.platform,

                    key: this.key.trim(),
                    status: this.status,
                    normal: this.normal,
                }
            },
            ...mapGetters(['oidcAccessToken'])
        },
        created: function () {
            this.getplatformList();
            this.getAccountType();
            // this.getArticleType();
            this.getAuthList();
            this.getYicheTag();
            this.getYicheType();
        },
        mounted: function () {
            this.search();
        },

        methods: {
            addVideo(row) {
                console.log(row);
                this.yicheVisible = true;
                this.videoPlatform = row.platform;
                this.yicheForm.account = row.platform;

            },
            // 取消表单
            cancelYiche() {
                this.$refs["yicheForm"].resetFields();
                this.yicheVisible = false;
                this.yicheForm = {
                    account: "易车",
                    title: "",
                    description: "",
                    coverUrl: "",
                    videoUrl: "",
                    tags: [],
                    carModel: "",
                }
            },
            // 易车视频表单提交
            addYiche() {

                this.$refs['yicheForm'].validate((valid) => {
                    let url = "";
                    if (this.videoPlatform === this.yicheName) {
                        url = Api.mymedia_account_yiche;
                    } else {
                        url = Api.mymedia_account_aika;
                    }
                    if (valid) {
                        service({
                            method: "post",
                            url: url,
                            data: {
                                ...this.yicheForm,
                                tags: this.yicheForm.tags.join(",")
                            }
                        }).then(() => {
                            this.$message({
                                type: "success",
                                offset: 300,
                                message: "提交成功"
                            });

                            this.cancelYiche();
                        }).catch((e) => {
                            this.$message({
                                type: "info",
                                offset: 300,
                                message: "提交失败"
                            })
                        })
                    }
                });

            },

            removeYichePoster(file) {
                this.yicheForm.coverUrl = "";
                this.yichePosterList = [];
            },
            removeYicheVideo(file) {
                this.yicheForm.videoUrl = "";
                this.yicheVideoList = [];
            },
            //图片大小检查
            beforeYichePoster(file) {
                return new Promise((resolve, reject) => {
                    if (file.size < 1024 * 1024 * 10) {
                        resolve()
                    } else {
                        reject();
                    }

                });
            },
            //视频大小检查
            beforeYicheVideo(file) {
                return new Promise((resolve, reject) => {
                    if (file.size < 1024 * 1024 * 100) {
                        resolve()
                    } else {
                        reject();
                    }

                });
            },
            //上传图片
            uploadYichePoster(param) {
                var that = this;
                let fileObj = param.file;
                let forms = new FormData();
                forms.append("file", fileObj);

                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: that.uploadPosterUrl,
                        type: 'POST',
                        headers: {'Authorization': 'Bearer ' + that.oidcAccessToken},
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: forms,
                        success: function (res) {
                            console.log(res)
                            that.yicheForm.coverUrl = picApi + res.info;
                            resolve(res.info)
                        }
                        , error: function (err) {
                            this.$message({
                                type: "error",
                                offset: 300,
                                message: "上传失败:" + err.responseJSON.error
                            });
                            reject(err);
                        },
                    })
                });

            },
            // 上传视频
            uploadYicheVideo(param) {
                var that = this;
                console.log(param)
                let fileObj = param.file;
                let forms = new FormData();
                forms.append("file", fileObj);

                return new Promise((resolve, reject) => {
                    $.ajax({
                        url: that.uploadVideoUrl,
                        type: 'POST',
                        headers: {'Authorization': 'Bearer ' + that.oidcAccessToken},
                        processData: false,
                        contentType: false,
                        dataType: 'json',
                        data: forms,
                        success: function (res) {
                            console.log(res)
                            that.yicheForm.videoUrl = picApi + res.info;
                            resolve(res.info)

                        }
                        , error: function (err) {
                            this.$message({
                                type: "error",
                                offset: 300,
                                message: "上传失败:" + err.responseJSON.error
                            });
                            reject(err);
                        },
                    })
                });

            },
            changeTime(t, v) {
                if (v.length === 2) {
                    switch (t) {

                        case 's2':
                            this.$refs.s2.focus();
                            break;
                        case 't1':
                            this.$refs.t1.focus();
                            break;
                        case 't2':
                            this.$refs.t2.focus();
                            break;

                    }
                }

            },
            rowKey(row) {
                return row._id;
            },
            searchQuery() {
                this.page = 1;
                this.search();
            },
            // 查询
            search() {
                this.loading = true;

                service({
                    method: "get",
                    url: Api.mymedia_account_list,
                    params: this.searchObj
                }).then((res) => {
                    if (res.data.length > 0) {
                        this.count = res.count;
                        this.list = res.data.map(v => {
                            if (v.timeStart && v.timeEnd) {
                                v.timeRange = v.timeStart + "-" + v.timeEnd;

                            } else {
                                v.timeRange = "-"
                            }

                            v.statusName = v.status === 0 ? "停用" : "启用";
                            v.normalName = v.normal === 1 ? "正常" : "异常";
                            v.enablePublishName = v.enablePublish === 1 ? "自动" : "停止";
                            v.publishTypesStr = _.isArray(v.publishTypes) ? v.publishTypes.join(", ") : "";

                            return v;
                        });
                    } else {
                        this.$message({
                            type: "info",
                            offset: 300,
                            message: "没有数据"
                        })
                    }

                    this.loading = false;

                }).catch(() => {
                    this.$message({
                        type: "info",
                        offset: 300,
                        message: "发生错误"
                    })

                })
            },

            indexMethod(index) {
                return index + 1 + (this.page - 1) * this.size;
            },

            // 取消添加
            cancelAdd: function () {
                this.$refs["addForm"].resetFields();
                this.addDialogVisible = false;
                this.form = {
                    name: "",
                    categoryId: "",
                    category: "",
                    platform: "",
                    appId: "",
                    appToken: "",
                    publishTypes: [],
                    cookie: "",
                }
            },

            getAuthList() {
                serviceUser({
                    method: "get",
                    url: userApi.mymedia_auth_list,
                }).then((res) => {
                    this.authList = res.data;
                });
            },

            addOpen: function () {
                this.clearTimer();
                Cookies.set('officialcookies', 'needclear');
                this.addAuthVisible = true;
            },

            addAuthItem() {
                this.timer = setInterval(() => {
                    let ofc = Cookies.get('officialcookies');
                    console.log("add: ", ofc);
                    if (_.isNil(ofc)) {
                        window.open(this.authPlatform);
                        this.cancelAuth();
                        this.clearTimer();
                    }
                }, 500);
            },

            clearTimer() {
                clearInterval(this.timer);
                this.timer = null;
            },

            cancelAuth() {
                this.addAuthVisible = false;
                this.authPlatform = "";
                this.clearTimer();
            },

            // 刷新 cookie
            cookieOpen: function (row) {
                this.clearTimer();
                let item = this.authList.find((v) => {
                    return v.platform === row.platform;
                });

                this.timer = setInterval(() => {
                    let ofc = Cookies.get('officialcookies');
                    console.log("cookie:", ofc)
                    if (_.isNil(ofc)) {
                        window.open(item.loginUrl);
                        this.cancelAuth();
                        this.clearTimer();
                    }
                }, 500);
            },

            editAccountOpen() {
                this.addDialogVisible = true;
            },

            editOpen(record) {

                this.isEdit = true;
                this.editAccountOpen();

                let cindex = this.accountTypeList.findIndex((v) => {
                    return v.name === record.category;
                });

                let categoryId;

                if (cindex !== -1) {
                    categoryId = this.accountTypeList[cindex]._id;
                } else {
                    categoryId = '0';
                }
                this.form = {
                    s1: record.timeStart ? record.timeStart.split(":")[0] : "",
                    s2: record.timeStart ? record.timeStart.split(":")[1] : "",

                    t1: record.timeStart ? record.timeEnd.split(":")[0] : "",
                    t2: record.timeStart ? record.timeEnd.split(":")[1] : "",
                    ...record,
                    categoryId,
                };
            },
            // 编辑操作，添加已经不需要了
            addAjaxItem() {

                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        if (this.form.categoryId !== "0") {
                            let index = _.findIndex(this.accountTypeList, {_id: this.form.categoryId});

                            if (index !== -1) {
                                this.form.category = this.accountTypeList[index].name;
                            }
                        } else {
                            this.form.category = "";
                        }

                        let url = "";

                        if (this.isEdit) {
                            url = Api.mymedia_account_put + "/" + this.form._id;
                        } else {
                            url = Api.mymedia_account_post;
                        }

                        Promise.all([
                            service({
                                method: "post",
                                url: url,
                                data: {
                                    ...this.form,
                                }
                            }),
                            service({
                                method: "post",
                                url: Api.mymedia_account_time + "/" + this.form._id,
                                data: {
                                    startTime: this.form.s1 + ":" + this.form.s2,
                                    endTime: this.form.t1 + ":" + this.form.t2,
                                }
                            }),
                            service({
                                method: "post",
                                url: Api.mymedia_account_interval + "/" + this.form._id,
                                data: Number(this.form.publishInterval)
                            }),
                        ]).then((res) => {
                            if (this.isEdit) {
                                this.$message({
                                    type: "success",
                                    offset: 300,
                                    message: "修改成功"
                                })

                            } else {
                                this.$message({
                                    type: "success",
                                    offset: 300,
                                    message: "添加成功"
                                })

                            }
                            this.search();
                            this.cancelAdd();
                        }).catch((e) => {
                            this.$message({
                                type: "warning",
                                offset: 300,
                                message: "保存失败"
                            })
                        })
                    } else {
                        return false;
                    }
                })

            },

            // 状态启停
            accountStop: function (record) {
                var that = this;
                let status = (record.status + 1) % 2;

                service({
                    method: "post",
                    url: Api.mymedia_account_putStatus + "/" + record._id,
                    data: status,

                }).then(function () {
                    that.search();
                    that.$message({
                        type: "success",
                        offset: 300,
                        message: "状态更新成功"
                    })

                }).catch(function () {
                    that.$message({
                        type: "warning",
                        offset: 300,
                        message: "状态更新失败"
                    })

                })

            },

            // 异常状态更新
            statusOpen: function (record) {
                var that = this;
                let status = (record.status + 1) % 2;

                service({
                    method: "post",
                    url: Api.mymedia_account_putNormal + "/" + record._id,

                    data: status
                }).then(function () {
                    that.search();
                    that.$message({
                        type: "success",
                        offset: 300,
                        message: "状态更新成功"
                    })

                }).catch(function () {
                    that.$message({
                        type: "warning",
                        offset: 300,
                        message: "状态更新失败"
                    })

                })
            },

            // 自动发布开关
            publishOpen: function (record) {
                var that = this;
                let status = (record.enablePublish + 1) % 2;

                service({
                    method: "post",
                    url: Api.mymedia_account_putpublish + "/" + record._id,

                    data: status
                }).then(function () {
                    that.search();
                    that.$message({
                        type: "success",
                        offset: 300,
                        message: "状态更新成功"
                    })

                }).catch(function () {
                    that.$message({
                        type: "warning",
                        offset: 300,
                        message: "状态更新失败"
                    })

                })
            },

            // 导出
            exportTaskExcel: function () {
                let qs = $.param({...this.searchObj, size: this.count});
                let url = config.apiPath + Api.mymedia_account_export + "?" + qs;

                window.open(url)
            },

            // 平台列表
            getplatformList: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.mymedia_platform_getlist,
                    params: {
                        page: 1,
                        size: 1000,
                    }
                }).then(function (res) {
                    that.platformList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                });
            },

            // 编辑：账号分类
            getAccountType: function () {
                let that = this;

                service({
                    method: "get",
                    url: Api.relation_publish_getlist,
                    params: {
                        page: 1,
                        size: 1000,
                    }
                }).then(function (res) {
                    that.accountTypeList = [{"_id": "0", "name": "全部"}].concat([], res.data);
                });
            },

            // 编辑：文章发布分类
            getArticleType() {

                service({
                    method: "get",
                    url: Api.relation_article_getlist,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                }).then((res) => {
                    this.articleTypeList = res.data;
                })
            },

            getYicheTag() {
                service({
                    method: "get",
                    url: Api.yiche_tag,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                }).then((res) => {
                    this.yicheTagList = [].concat([], _.keys(res.data).map((k) => {
                        return {
                            _id: k,
                            name: res.data[k]
                        }
                    }));
                })
            },

            getYicheType() {
                service({
                    method: "get",
                    url: Api.yiche_car,
                    params: {
                        page: 1,
                        limit: 1000
                    }
                }).then((res) => {
                    this.yicheTypeList = [].concat([], _.keys(res.data).map((k) => {
                        return {
                            _id: k,
                            name: res.data[k]
                        }
                    }));
                })
            },

            getRelationArticleType(id) {
                if (id !== "0") {
                    let index = _.findIndex(this.accountTypeList, {_id: id});

                    if (index !== -1) {
                        this.articleTypeList = this.accountTypeList[index].hotTopicTypes;
                    } else {
                        this.articleTypeList = [];
                    }
                } else {
                    this.articleTypeList = [];
                }

                this.$set(this.form, "publishTypes", this.articleTypeList);
                this.$set(this.form, "publishTypesStr", this.articleTypeList.join(", "));

                // service({
                //     method: "get",
                //     url: Api.relation_publish_getone,
                //     params: {
                //         id:item._id
                //     }
                // }).then((res) => {
                //     this.articleTypeList = res.data.hotTopicTypes;
                // })
            }


        }
    }
</script>

<style>
    .timeInput {
        display: inline-block;
        width: 15px;
        text-align: left;
        height: 32px;
        line-height: 32px;
    }

    .uplist {
        display: block;
        width: 100%;
        height: 120px;
    }

    .pic {
        display: flex;
        width: 100px;
        height: 100px;
        border: 1px solid #c0c4cc;
        border-radius: 4px;
    }

    .pic img {
        width: 100%;
        justify-content: center;
        align-content: center;
    }

    .vbox {
        display: flex;
        width: 150px;
        height: 120px;
        border: 1px solid #c0c4cc;
        border-radius: 4px;
    }

    .video {
        width: 100%;
        justify-content: center;
        align-content: center;
    }


</style>