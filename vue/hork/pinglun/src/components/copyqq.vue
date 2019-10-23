<template>
    <div class="copyqq">
        <el-button @click="copyQQ">复制</el-button>
    </div>
</template>

<script>
    import Vue from "vue";
    import {mapActions, mapGetters} from "vuex";
    import {Button} from "element-ui";
    Vue.use(Button);
    import copy from 'copy-to-clipboard';

    export default {
        name: "copyqq",
        props:["taskid"],
        methods:{
            copyQQ(){
                this.GetSupQQMsg({taskId: this.taskid}).then(res=>{
                    copy(res.data);
                    this.$message("复制成功");
                })

            },
            ...mapActions(["GetSupQQMsg"])
        }
    }
</script>

<style scoped>
    .copyqq {
        float:right;
        display: inline-block;
        margin-left:20px;
    }
</style>