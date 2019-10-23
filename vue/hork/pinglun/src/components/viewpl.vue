<template>
    <el-form ref="ruleForm" class="demo-ruleForm" v-if="comments">
        <el-form-item :label="label">
            <div class="pinglun-item" v-for="(cont, index) in commentsList">
                <span class="num"> {{index + 1}}、</span>
                <el-input
                        type="textarea"
                        class="pinglun-text"
                        v-model="commentsList[index].comment"
                        :readonly="readOnly"></el-input>

                <div class="like-num" v-if="maintaintasktype=='3'">
                    <el-input
                            v-model="commentsList[index].count"
                            readonly></el-input>
                </div>
                <!--taskstatus!==2 &&-->
                <div class="pinglun-update"
                     v-if="(isM || isSuper) && who!=`report`"
                     @click="modifyComment(cont.id)">
                    <img src="@/assets/edit-icon.png" alt="">
                </div>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Form,
        FormItem,
        Input,
    } from "element-ui";

    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);

    export default {
        name: "viewpl",
        props: ["comments", "maintaintasktype", "taskstatus", "label", "who"],
        data: function () {
            let n = this.comments;
            if (_.isPlainObject(n)) {
                return {
                    commentsList: [n]
                }
            } else {
                return {
                    commentsList: n
                }

            }
        },

        computed: {
            readOnly: function () {
                return (!this.isM && !this.isSuper) || this.who == "report"
            },
            ...mapGetters(["isSuper", "userRole",  "isD", "isC", "isM", "userMap"])
        },

        watch: {
            "comments":

                function (n, o) {
                    console.log(n, o)
                    if (!_.isEqual(n, o)) {
                        if (_.isPlainObject(n)) {
                            this.commentsList = [n];
                        } else {
                            this.commentsList = n;
                        }

                    }
                }
        },

        methods: {
            modifyComment(id) {
                this.$emit("modify", id);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pinglun-text {
        .el-textarea__inner {
            padding: 5px 15px !important;
        }
    }
</style>