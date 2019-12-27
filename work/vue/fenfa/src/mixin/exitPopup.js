export const exitPopupMixin = {
    methods:{
        // 退出提示
        toPrevPage() {
            this.exitTask = true;
        },
        // 不退出
        notExit(){
            this.exitTask = false;
        },
        // 退出
        yesExit(){
            this.exitTask = false;

            this.$nextTick(()=>{
                this.$router.push("/home")
            });

        },

    }
};