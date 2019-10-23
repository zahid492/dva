// 2019-10-11 wsc
Vue.config.devtools = true;

var articlesV = new Vue({
    el: '#editor',
    data: function () {
        let yesterday = moment().subtract(1, 'days').format("YYYYMMDD");
        return {
            host: window.host_hotnews,
            // 0 按账号 1 按平台
            StatisticsType: 0,
            //平台
            platformList: ["全部"].concat(window.accountPlatForms),
            PlatForm: "全部",
            //时间类型： 0 按日 1 按月
            DateTimeType: 0,
            dateRange: [yesterday, yesterday],
            //异常类别
            Status: 9,
            //关键字
            Key: "",

            HotTopicType: "",
            HotTopicTypeList: [],

            Page: 1,
            Size: 10,
            count: 0,

            list: [],

            pickerOptions: {},

        }
    },

    computed: {
        searchObj: function () {
            return {
                Page: this.Page,
                Size: this.Size,
                StatisticsType: this.StatisticsType,
                PlatForm: this.PlatForm === "全部" ? "" : this.PlatForm,
                HotTopicType: this.HotTopicType === "全部" ? "" : this.HotTopicType,
                DateTimeType: this.DateTimeType,
                TimeStart: !_.isNil(this.dateRange) && Number(this.dateRange[0]) || "",
                TimeEnd: !_.isNil(this.dateRange) && Number(this.dateRange[1]) || "",
                Key: this.Key.trim(),
                Status: this.Status,
            }
        }
    },
    created: function () {
        // 最大选择从昨天开始1年之前到数据
        this.pickerOptions.disabledDate = function (time) {
            let oneYearAgo = moment().subtract(1, 'days').subtract(1, 'years');
            let yesterday = moment().subtract(1, 'days');
            let curSelDate = moment(time);
            return curSelDate > yesterday || curSelDate < oneYearAgo;
        };

        this.getHotTopicType();
    },
    mounted: function () {
        this.search();
    },

    methods: {
        // 查询
        search: function () {
            let that = this;

            getData({
                url: ApiToUrl(Api.mymedia_article_getlist),
                data: that.searchObj
            }).then(function (res) {
                if(res.data.length>0){
                    that.count = res.count;
                    that.list = res.data;
                }else{
                    that.$message.info("没有数据")
                }

            }).catch(function(){
                that.$message.error("发生错误")
            })
        },

        indexMethod: function (index) {
            return index + 1;
        },

        // 查看
        view: function (row) {
            let url = config.host_media + "/edit/" + row._id;
            window.open(url);
        },

        // 导出
        exportTaskExcel: function () {
            let qs = $.param(this.searchObj);
            let url = ApiToUrl(Api.mymedia_article_export, {query: "?" + qs});

            window.open(url)
        },
        //文章分类 todo 需要确认是？
        getHotTopicType: function () {
            let that = this;
            getData({
                url: ApiToUrl(Api.hotnews_HotTopicTypelist),
                data: {
                    page: 1,
                    limit: 1000
                }
            }).then(function (res) {
                that.HotTopicTypeList = [{"_id": "0", "name": "全部"}].concat([], res.data);
            })
        }
    }
});