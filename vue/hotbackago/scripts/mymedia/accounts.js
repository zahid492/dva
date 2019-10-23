// 2019-10-14 wsc
Vue.config.devtools = true;

var articlesV = new Vue({
    el: '#editor',
    data: function () {
        return {
            host: window.host_hotnews,

            platform: "全部",
            //异常类别
            eStatus: 9,
            status: -1,
            //关键字
            key: "",


            page: 1,
            size: 10,
            count: 0,

            list: [],
            //平台
            platformList: [],

            addDialogVisible: false,

            form: {
                name: "",
                category: "",
                platform: "",
                appId: "",
                appToken: "",
                publishTypes: [],
                cookie: "",
            },

            isEdit: false,

            accountTypeList:[],

            articleTypeList: [],
        }
    },

    computed: {
        searchObj: function () {
            return {
                Page: this.Page,
                Size: this.Size,

                platform: this.platform === "全部" ? "" : this.platform,

                key: this.key.trim(),
                status: this.status,
                eStatus: this.eStatus,
            }
        }
    },
    created: function () {
        this.getPlatformList();
        this.getAccountType();
        this.getArticleType();
    },
    mounted: function () {
        this.search();
    },

    methods: {
        // 查询
        search: function () {
            let that = this;

            getData({
                url: ApiToUrl(Api.mymedia_account_list),
                data: that.searchObj
            }).then(function (res) {
                if (res.data.length > 0) {
                    that.count = res.count;
                    that.list = res.data;
                } else {
                    that.$message.info("没有数据")
                }

            }).catch(function () {
                that.$message.error("发生错误")
            })
        },

        indexMethod: function (index) {
            return index + 1;
        },

        // 取消添加
        cancelAdd: function () {
            this.$refs["addForm"].resetFields();
            this.addDialogVisible = false;
        },

        addOpen: function () {
            this.addDialogVisible = true;
        },

        editOpen: function (record) {
            this.isEdit = true;
            this.addOpen();
            this.form = record;
        },

        // 添加操作
        addAjaxItem: function () {
            let that = this;
            let url = "";

            if (this.isEdit) {
                url = Api.mymedia_account_put;
            } else {
                url = Api.mymedia_account_post;
            }
            postData({
                url: ApiToUrl(url),
                data: that.form
            }).then(function (res) {
                if (this.isEdit) {
                    that.$message.success("修改成功");
                } else {
                    that.$message.success("添加成功");
                }

                that.search();
                that.cancelAdd();
            })
        },

        // 状态启停
        accountStop: function (record) {
            var that = this;
            let status = (record.status+1)%2;

            postData({
                url: ApiToUrl(Api.mymedia_account_putStatus + "/" + record._id),
                data: {
                    status: status
                }
            }).then(function () {
                that.search();
                that.$message.success("状态更新成功");
            }).catch(function () {
                that.$message.success("状态更新失败");
            })

        },

        // 异常状态开关
        statusOpen: function () {
            var that = this;
            let status = (record.status+1)%2;

            postData({
                url: ApiToUrl(Api.mymedia_account_putStatus + "/" + record._id),
                data: {
                    status: status
                }
            }).then(function () {
                that.search();
                that.$message.success("状态更新成功");
            }).catch(function () {
                that.$message.success("状态更新失败");
            })
        },

        // 自动发布开关
        publishOpen: function () {
            var that = this;
            let status = (record.enablePublish+1)%2;

            postData({
                url: ApiToUrl(Api.mymedia_account_putpublish + "/" + record._id),
                data: {
                    status: status
                }
            }).then(function () {
                that.search();
                that.$message.success("状态更新成功");
            }).catch(function () {
                that.$message.success("状态更新失败");
            })
        },

        cookieOpen: function () {
        },

        // 导出
        exportTaskExcel: function () {
            let qs = $.param(this.searchObj);
            let url = ApiToUrl(Api.mymedia_account_export, {query: "?" + qs});

            window.open(url)
        },

        // 平台列表
        getPlatformList: function () {
            let that = this;

            getData({
                url: ApiToUrl(Api.mymedia_platform_getlist),
                data: {
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

            getData({
                url: ApiToUrl(Api.relation_publish_getlist),
                data: {
                    page: 1,
                    size: 1000,
                }
            }).then(function (res) {
                that.accountTypeList = [{"_id": "0", "name": "全部"}].concat([], res.data);
            });
        },

        // 编辑：文章发布分类
        getArticleType: function () {
            let that = this;
            getData({
                url: ApiToUrl(Api.relation_article_getlist),
                data: {
                    page: 1,
                    limit: 1000
                }
            }).then(function (res) {
                that.articleTypeList = [{"_id": "0", "name": "全部"}].concat([], res.data);
            })
        }
    }
});