export const taskAction = {
    methods: {

        isWho() {
            // mat: 维护员; sup: 供应商任务添加（上传截图，提交，关闭） rep: 统计报告查看（无上传截图） client: 客户端（（无上传截图））
            if (this.what) {
                switch (this.what) {

                    case "mat":
                        this.who = "mat";
                        break;
                    case "sup":
                        this.who = "sup";
                        break;
                    case "client":
                        this.who = "client";
                        break;
                    case "report":
                        this.who = "report";
                        break;

                }
            } else {
                this.who = undefined;
            }
        },

    }
};