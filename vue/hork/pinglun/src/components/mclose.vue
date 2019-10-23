<template>
    <div>
        <button class="close-btn"
                @click="closePage"
                v-if="!(taskstatus===1 && who==='sup') || who=='report'">关闭</button>

        <!--执行中：1， 完成：2-->
        <div v-if="taskstatus===1 && who==='sup'"
             class="btn-box">
            <button class="cancel-btn" @click="submit">提交</button>
            <button class="cancel-btn" @click="closePage">取消</button>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    export default {
        name: "mclose",
        props:["taskstatus", "who", "router"],
        methods: {
            closePage() {
                switch(this.who){

                    case "sup":
                        this.$router.push({name:"distributor"});
                        break;
                    case "client":
                        this.$router.push({name:"client"});
                        break;
                    case "mat":
                        this.$router.push({name:"maintain-list"});
                        break;
                    default:
                        this.$router.back();
                }
            },
            submit(){
                this.$emit("submit")
            }
        }
    }
</script>

<style lang="scss" scoped>

    .close-btn {
        margin: 30px 0 30px 170px;

        width: 150px;
        height: 46px;
        background: rgba(105, 103, 206, 1);
        border-radius: 4px;
        color: #fff;
        text-align: center;
    }

    .cancel-btn {
        width: 150px;
        height: 46px;
        border-radius: 4px;
        color: rgba(105, 103, 206, 1);
        border: 1px solid rgba(105, 103, 206, 1);
        text-align: center;
        margin-left: 18px;
    }
</style>