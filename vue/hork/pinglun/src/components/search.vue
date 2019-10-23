<template>
    <div @keyup.enter="search">
        <el-input
                size="medium"
                class="input-icon"
                :placeholder="lplaceholder"
                prefix-icon="el-icon-search"
                @change="changeSerTxt"
                v-model="lserTxt">
        </el-input>
    </div>
</template>

<script>
    import Vue from "vue";
    import {
        Input,
        Icon
    } from "element-ui";

    Vue.use(Input);
    Vue.use(Icon);

    export default {
        name: "search",
        props: ["placeholder", "searchTxt"],
        data: function () {
            return {
                lplaceholder: this.placeholder,
                lserTxt: this.searchTxt
            }
        },
        watch: {
            "searchTxt": function (n, o) {
                if (n !== o) {
                    this.lserTxt = this.searchTxt
                }
            }
        },
        methods: {
            search() {
                if (this.lserTxt.length > 50) {
                    this.$message("关键字长度要小于50字符");
                    return false;
                }
                this.$emit("keysearch");
            },

            changeSerTxt(val) {
                this.$emit("update:searchTxt", val)

            }
        }
    }
</script>

<style scoped>
    .el-input {
        float: right;
        width: 220px;
        margin-top: 37px;
    }
</style>