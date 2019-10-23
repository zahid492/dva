<template>
    <div>
        <div class="name">截图</div>
        <div class="see-jietu-list">
            <div class="item" v-for="im in fileList">
                <img :src="im.url" alt="">
                <button class="jietu-no"
                        v-if="who!=='client'"
                        @click="()=>delScreen(im)"><span
                        class="icon-close iconfont"></span></button>
            </div>
        </div>
        <el-upload
                v-if="who!=='client'"
                action=""
                multiple
                class="upload-excel"
                accept=".jpg,.jpeg,.png,.gif"
                :before-upload="beforeUpload"
                :http-request="addScreen"
                :file-list="fileList">
            <div class="add-jietu"><span class="icon-add iconfont"></span>上传截图</div>
        </el-upload>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import Vue from "vue";
    import {
        Button,
        Upload

    } from "element-ui";


    Vue.use(Button);
    Vue.use(Upload);

    export default {
        name: "mupload",
        props: ["fileList", "id", "newsmarkdeletion", "who"],
        methods: {
            // 上传截图
            beforeUpload: function (file) {
                return new Promise((resolve, reject) => {
                    if (file.size < 1024 * 1024 * 1) {
                        resolve(file)
                    }else{
                        this.$message("文件超出1M大小");
                        reject(file);
                    }
                });
            },

            // todo 也可缓存全部再上传
            addScreen: function (param) {
                // console.log(param)
                this.AddScreenShot({id: this.id, file: param.file}).then((res) => {
                    this.fileList.push({id: res[0].imageid, name: param.file.name, url: config.host + res[0].filepath});
                    this.$message("上传成功");
                }).catch(err => {
                    this.$message.error("上传失败，请重试");
                });
            },

            delScreen: function (fileInfo) {
                // 需要图片的id
                this.DelScreenShot({taskid: this.id, id: fileInfo.id || fileInfo.name}).then((res) => {
                    this.fileList.filter(function (v) {
                        return v.uid !== fileInfo.uid
                    });
                    this.$message("删除成功");

                    this.$emit("refresh");

                }).catch(err => {
                    this.$message("删除失败");
                });
            },
            ...mapActions(["AddScreenShot", "DelScreenShot"])
        }
    }
</script>

<style lang="scss" scoped>

    .name {
        width: 150px;
        height: 100%;
        line-height: 80px;
        text-align: center;
        color: #69778F;
        font-size: 20px;
        position: absolute;
        top: 0;
    }

    .see-jietu-list {
        width: 560px;
        display: inline-block;
        margin-left: 170px;
        margin-top: 10px;

        .item {
            width: 100%;
            min-height: 50px;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 15px;
            padding: 30px 10px 10px;
            border: 1px solid rgba(202, 207, 231, 1);
            position: relative;

            img {
                width: 100%;
            }
        }

        .jietu-no {
            position: absolute;
            top: 10px;
            right: 10px;
        }

    }

    .add-jietu {
        width: 560px;
        height: 60px;
        border: 1px solid rgba(202, 207, 231, 1);
        border-radius: 4px;
        text-align: center;
        line-height: 60px;
        margin-left: 170px;
        font-size: 16px;
        color: #222;
        cursor: pointer;
    }
</style>