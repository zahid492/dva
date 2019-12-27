<template>
  <div class="home">
    <div class="home-box" id="swrapper" ref="wrapper">
      <div id="scroller">
        <div class="home-title1">当前任务</div>
        <div class="zanwu1" :class="{bacn: acceptedTasks.length>0}">
          <div v-if="acceptedTasks.length>0" ref="mySwiper">
            <div class="swiper-slide" v-for="item in acceptedTasks" :key="item.title">
              <div class="renwu renwulang">
                <div class="icon">
                  <icon-type :tid.sync="item.type" :status.sync="item.status"></icon-type>
                </div>
                <div class="content">
                  <div class="title">{{item.title}}</div>
                  <p class="tijiao">
                    <span class="fl">{{item.typeName}}</span>
                    <span class="day fr">剩余：{{item.restTime}}</span>
                  </p>
                  <div class="num_day">
                    <span class="day fl">单号：{{item.number}}</span>
                  </div>
                </div>
              </div>
              <el-progress
                pivot-text="50%"
                :color="'#FFB002'"
                :percentage="item.completionPercentage"
                class="jindu"
              />
              <div class="jindu-box">
                <span class="fl">数量：{{item.count}}个</span>
              </div>
              <!-- 句子对任务 -->
              <router-link :to="`/juzi/${item.id}`" v-if="item.type===missionType.sentence">
                <div class="btn start">开始任务</div>
              </router-link>

              <router-link :to="`/gaixie/${item.id}`" v-if="item.type===missionType.rewrite">
                <div class="btn start">开始任务</div>
              </router-link>

              <router-link
                :to="`/tongyi/${item.id}`"
                v-if="item.type===missionType.synonym && item.status!==7"
              >
                <div class="btn start">开始任务</div>
              </router-link>

              <router-link :to="`/pingjia/${item.id}`" v-if="(item.type===missionType.scoring)">
                <div class="btn start">开始任务</div>
              </router-link>
              <!-- 没有审核任务了 -->
              <!-- <router-link :to="`/shenhe/${item.id}`"
                                         v-if="(item.type===missionType.audit) && item.status===7">
                                <div class="btn start">开始任务</div>
              </router-link>-->
            </div>

            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>

            <div class="home-title1"></div>
          </div>
          <img v-else src="../assets/zanwu.png" alt class="zanwu" />
        </div>

        <div class="home-title1">
          我的任务单
          <!-- <el-button class="fr shenqing-btn" size="medium" round @click="toApplyTask">申请任务</el-button> -->
        </div>

        <div class="zanwu2">
          <ul v-if="toBeAcceptedTasks.length>0" class="renwu-list">
            <li class="item" v-for="(item, i) in toBeAcceptedTasks" :key="item.title">
              <main-item :item="item" @accept="acceptedTask">
                <template #icon="{type, status}">
                  <icon-type :tid="type" :status="status"></icon-type>
                </template>
              </main-item>
            </li>
          </ul>
          <div v-else class="zanwu1">
            <img src="../assets/zanwu.png" alt class="zanwu" />
          </div>
        </div>
      </div>
    </div>

    <!-- 弹框申请任务 -->
    <el-dialog title="请选择任务类型" :close-on-click-modal="false" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form">
        <el-form-item :label-width="formLabelWidth">
          <el-select v-model="form.taskType" placeholder>
            <el-option
              v-for="item in taskTypes"
              :key="item.value"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTask" round>取 消</el-button>
        <el-button type="primary"
        :disabled="sub"
        @click="applyTask" round>确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters } from "vuex";

import {
  Button,
  Dialog,
  Form,
  FormItem,
  Select,
  Option,
  Progress,
  Loading
} from "element-ui";

import { missionType } from "@/utils/type";

import mainItem from "@/components/main-list-item.vue";
import iconType from "@/components/icon-type.vue";

import "@/scss/common.scss";

Vue.use(Progress);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Select);
Vue.use(Option);
Vue.use(Loading);

export default {
  name: "home",
  data() {
    return {
      dialogFormVisible: false,
      fullscreenLoading: false,
      show: true,
      sub: false,
      formLabelWidth: "120px",
      form: {
        taskType: "改写句子对"
      },
      taskTypes: [
        // {
        //     key: 1,
        //     value: "撰写句子对"
        // },
        {
          key: 7,
          value: "改写句子对"
        }
        //     {
        //     key: 2,
        //     value: "审核任务"
        // },
        // {
        //     key: 6,
        //     value: "评价句子对"
        // }
      ],
      missionType: missionType
    };
  },
  components: {
    "main-item": mainItem,
    "icon-type": iconType
  },
  computed: {
    ...mapGetters(["acceptedTasks", "toBeAcceptedTasks", "role"])
  },
  mounted() {
    this.getMissions();
  },
  methods: {
    toPrevPage() {
      this.$router.push("/");
    },
    openFullScreen() {},
    // 接受任务
    acceptedTask(task) {
      this.acceptTask({ tId: task.id })
        .then(() => {
          this.getHomeMissions();
        })
        .catch(err => {
          this.$message(err);
        });
    },
    // 申请任务弹窗
    toApplyTask() {
      this.dialogFormVisible = true;
    },
    // 申请任务
    applyTask() {
      this.sub = true;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.5)"
      });
      setTimeout(() => {
        loading.close();
      }, 200);
      this.applyForTask({
        wrtierId: this.role.id,
        taskType: this.taskTypes[0].key
      })
        .then(() => {
          this.sub = false;
          this.$message.success("任务申请成功");
          this.dialogFormVisible = false;
          this.getHomeMissions();
        })
        .catch(err => {
          if (err.data === -1 || err.data === -2) {
            this.$message("任务申请失败");
          }

          if (err.data === 0) {
            this.$message(err.message);
          }

          this.dialogFormVisible = false;
        });
    },
    // 获取任务列表
    getMissions() {
      this.getHomeMissions().then(res => {});
    },

    cancelTask() {
      this.$refs["form"].resetFields();
      this.dialogFormVisible = false;
      this.form = {
        taskType: 1
      };
    },
    ...mapActions(["getHomeMissions", "acceptTask", "applyForTask"])
  },
  destroyed() {}
};
</script>

<style lang="scss">
.el-form-item__content {
  margin-left: 0 !important;
}

.el-dialog {
  width: 25%;
}

.el-button--primary {
  background: linear-gradient(
    0deg,
    rgba(255, 155, 2, 1) 0%,
    rgba(255, 200, 1, 1) 88%
  );
  border: #ff9b02;
}

.el-button--default {
  color: #ff9b02;
}

.el-button--default {
  border-color: #ff9b02;
  background-color: #fff;
  color: #ff9b02 !important;
}

.el-button:focus,
.el-button:hover {
  border-color: #ff9b02;
  background-color: #fff;
}

.el-button--primary:focus,
.el-button--primary:hover {
  background: linear-gradient(
    0deg,
    rgba(255, 155, 2, 1) 0%,
    rgba(255, 200, 1, 1) 88%
  );
  border-color: #ff9b02;
  color: #fff !important;
}

.el-dialog__footer {
  text-align: center;
}

.el-main {
  padding: 0 !important;
}

.bacn {
  background: none !important;
  box-shadow: none !important;
}

* {
  box-sizing: border-box;
}

.h50 {
  width: 100%;
  height: 50px;
}

#swrapper {
  width: 100%;
  overflow: hidden;
}

#scroller {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  width: 100%;
  transform: translateZ(0);
  user-select: none;
  text-size-adjust: none;
}

.van-progress__pivot {
  display: none;
}

.swiper-pagination-bullet {
  width: 4px !important;
  height: 4px !important;
}

.swiper-pagination-bullet-active {
  width: 25px !important;
  height: 4px;
  border-radius: 10px;
  background: linear-gradient(23deg, #ff9b02 0%, #ffc801 88%);
}

.swiper-slide {
  width: 334px;
  height: 225px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  padding: 17px 22px;
  float: left;
  box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
}

.swiper-slide:nth-child(2) {
  margin: 0 20px;
}

.jindu {
  margin-top: 20px;
}

.jindu-box {
  color: #8c8b90;
  font-size: 12px;
  margin-top: 6px;
  height: 14px;
}

.start {
  margin-top: 15px;
}

.footer {
  width: 100%;
  height: 50px;
  background: #fff;
  border-top: 1px solid #ddd;
  position: fixed;
  bottom: 0;
  left: 0;

  .my-home {
    width: 50%;
    height: 50px;
    line-height: 50px;
    float: left;
    font-size: 14px;
    color: #838590;
  }
}

.home-title1 {
  width: 100%;
  line-height: 22px;
  font-size: 18px;
  color: #4b4e5f;
  font-weight: 500;
  text-align: left;
  padding: 30px 0;

  span {
    float: right;
    font-size: 14px;
    // color: #8c8b90;
    margin-top: 2.5px;
    font-weight: 500;
  }
}

.home-title2 {
  width: 100%;
  font-size: 20px;
  color: #4b4e5f;
  text-align: left;
  margin: 15px 0;
  font-weight: 500;

  span {
    font-size: 12px;
    color: #8c8b90;
    font-weight: 400;
    margin-top: 10px;
  }
}

.renwu .content .title {
  text-align: left;
}

.zanwu2 .renwu .content {
  width: 80% !important;
  margin-left: 25px !important;
}
</style>

<style lang="scss" scoped>
.home {
  background: #f2f3f8;
  padding: 0px 70px 30px 20px;
}

.home-title1 {
  .shenqing-btn {
    font-size: 14px;
    color: #ff9f02 !important;
    border: 1px solid #ff9f02;
    background: none;
  }
}

.zanwu1 {
  width: 100%;
  height: 30vh;
  /*background: rgba(255, 255, 255, 1);*/
  box-shadow: 0px 4px 40px 0px rgba(21, 55, 153, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.zanwu2 {
  .zanwu1 {
    height: 50vh;
  }
}

.home-box {
  width: 100%;
  padding: 0 20px;
}

.renwu .content {
  width: 70% !important;
}

.renwu-list {
  width: 100%;
  padding: 0 20px 20px;
  background: #fff;

  .item {
    width: 100%;
    height: 98px;
    padding: 20px 0;
    border-bottom: 1px solid #dddddd;

    .icon {
      width: 61px;
    }
  }
}
</style>

