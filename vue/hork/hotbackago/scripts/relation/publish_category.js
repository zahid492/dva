// 2019-10-11 wsc
Vue.config.devtools = true;

var articlesV = new Vue({
    el: '#editor',
    data: function () {
        return {
            host: window.host_hotnews,

            //关键字
            key: "",
            page: 1,
            size: 10,
            count: 0,
            list: [],

            addDialogVisible: false,

            form: {
                name: "",
                remark: ""
            },

            isEdit: false
        }
    },

    computed: {
        searchObj: function () {
            return {
                key: this.key.trim(),
                page: this.page,
                size: this.size,
            }
        }
    },
    created: function () {
    },
    mounted: function () {
        this.search();
    },

    methods: {
        // 查询
        search: function () {
            let that = this;

            getData({
                url: ApiToUrl(Api.relation_publish_getlist),
                data: that.searchObj
            }).then(function (res) {
                that.count = res.count;
                that.list = res.data;
            })
        },

        indexMethod: function (index) {
            return index + 1;
        },
        // 添加
        addItem: function () {
            this.addDialogVisible = true;
        },
        // 添加操作
        addAjaxItem: function () {
            let that = this;
            let url = "";

            if (this.isEdit) {
                url = Api.relation_publish_edit;
            } else {
                url = Api.relation_publish_add;
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

        // 取消添加
        cancelAdd: function () {
            this.$refs["addForm"].resetFields();
            this.addDialogVisible = false;
        },
        // 修改打开
        openEdit: function (record) {
            this.isEdit = true;
            this.addItem();
            this.form = record;
        },
        // 删除
        deleteItem: function (record) {
            var that = this;

            this.$confirm("确认要删除该项吗？", "提示", {
                type: "warning"
            }).then(function () {
                postData({
                    url: ApiToUrl(Api.relation_publish_delete),
                    data: {
                        id: record._id
                    }
                }).then(function () {
                    that.search();
                    that.$message.success("删除成功");
                }).catch(function () {
                    that.$message.success("删除失败");
                })
            }).catch(function(){
                console.log("cancel")
            })
        },


    }
});