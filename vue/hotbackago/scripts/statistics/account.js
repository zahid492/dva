// 2019-10-11 wsc
Vue.config.devtools = true;

var statisticsV = new Vue({
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
            //账号
            AccountName: "",

            Page: 1,
            Size: 10,
            count: 0,

            list:[],

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
                DateTimeType: this.DateTimeType,
                TimeStart: !_.isNil(this.dateRange) && Number(this.dateRange[0]) || "",
                TimeEnd: !_.isNil(this.dateRange) && Number(this.dateRange[1]) || "",
                AccountName: this.AccountName.trim(),
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
        }
    },

    mounted: function () {
        this.search();
    },

    methods: {
        // 查询
        search: function () {
            let that = this;

            getData({
                url: ApiToUrl(Api.statistics_account),
                data: that.searchObj
            }).then(function (res) {
                that.count = res.count;
                that.list = res.data;
            })
        },

        indexMethod: function (index) {
            return index + 1;
        },
        // 导出
        exportTaskExcel: function () {
            let qs = $.param(this.searchObj);
            let url = ApiToUrl(Api.statistics_export, {query: "?"+ qs});

            window.open(url)
        },
    }
});