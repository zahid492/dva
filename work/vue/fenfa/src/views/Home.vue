<template>
  <div class="home">
    <div class="home-box" id="swrapper" ref="wrapper">
      <div id="scroller">
        <!-- <div class="h50"></div> -->
        <div class="home-title1">当前任务</div>
        <div class="zanwu1" :class="{bacn: acceptedTasks.length>0}">
          <swiper v-if="acceptedTasks.length>0" :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="item in acceptedTasks">
              <div class="renwu">
                <div class="icon">
                  <icon-type :tid.sync="item.type" :status.sync="item.status"></icon-type>
                </div>
                <div class="content">
                  <div class="title">{{item.title}}</div>
                  <p class="tijiao">{{item.typeName}}</p>
                  <div class="num_day">
                    <span class="day fl">剩余：{{item.restTime}}</span>
                  </div>
                </div>
              </div>
              <van-progress
                pivot-text="50%"
                color="linear-gradient(-6deg,rgba(248,160,70,1) 0%,rgba(255,201,60,1) 100%)"
                :percentage="item.completionPercentage"
                class="jindu"
              />
              <div class="jindu-box">
                <span class="fl">数量：{{item.count}}个</span>
                <span class="fr">{{item.completionPercentage}}%</span>
              </div>

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
              <!-- 没有审核任务了 -->
              <!--                            <router-link :to="`/shenhe/${item.id}`"-->
              <!--                                         v-if="item.type===1 && item.status===7">-->
              <!--                                <div class="btn start">开始任务</div>-->
              <!--                            </router-link>-->
              <router-link :to="`/pingjia/${item.id}`" v-if="(item.type===missionType.scoring)">
                <div class="btn start">开始任务</div>
              </router-link>
            </swiper-slide>

            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>

            <div class="home-title1"></div>
          </swiper>
          <img v-else src="../assets/zanwu.png" alt class="zanwu" />
        </div>
        <!-- Swiper -->

        <div class="home-title1">
          我的任务单
          <!-- <div
            class="shenqing-btn fr"
            v-model="dialogFormVisible"
            position="top"
            :style="{ height:'20%'}"
            @click="toApplyTask"
          >申请任务</div> -->
          <!--   <div class="shenqing-btn fr" @click="applyTask">申请任务</div>-->
        </div>
        <div class="zanwu2">
          <ul v-if="toBeAcceptedTasks.length>0" class="renwu-list">
            <li class="item" v-for="item in toBeAcceptedTasks" :key="item.title">
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
        <div class="h50"></div>
      </div>
    </div>
    <van-dialog
      v-model="dialogFormVisible"
      title="请选择任务类型"
      show-cancel-button
      :aria-disabled="sub"
      @confirm="applyTask"
      @cancel="dialogFormVisible=false"
    >
      <van-radio-group v-model="radio">
        <!-- <van-radio name="1" checked-color="#FF9F02">撰写句子对</van-radio>
        <van-radio name="6" checked-color="#FF9F02">评价句子对　</van-radio>-->
        <van-radio name="7" checked-color="#FF9F02">改写句子对</van-radio>
      </van-radio-group>
    </van-dialog>
    <bottom-nav></bottom-nav>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Vue from "vue";
import BScroll from "better-scroll";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import {
  NavBar,
  Dialog,
  Toast,
  Loading,
  Progress,
  Panel,
  Button,
  RadioGroup,
  Radio,
  Overlay
} from "vant";

import { missionType } from "@/utils/type";

import mainItem from "@/components/main-list-item.vue";
import bottomNav from "@/components/bottom-nav.vue";
import iconType from "@/components/icon-type.vue";
import "@/scss/common.scss";

Vue.use(Toast);
Vue.use(Panel);
Vue.use(NavBar);
Vue.use(Progress);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Overlay);

export default {
  name: "home",
  data() {
    return {
      missionType: missionType,
      show: true,
      show2: false,
      radio: "1",
      swiper: null,
      myScroll: null,
      dialogFormVisible: false,
      sub:false,
      form: {
        taskType: 7
      },
      taskTypes: [
        {
          key: 1,
          value: "撰写句子对"
        },
        {
          key: 7,
          value: "改写句子对"
        },
        {
          key: 6,
          value: "评价句子对"
        }
      ],
      swiperOption: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",

        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        },
        pagination: {
          el: ".swiper-pagination"
        }
      }
    };
  },
  components: {
    swiper,
    swiperSlide,
    "main-item": mainItem,
    "bottom-nav": bottomNav,
    "icon-type": iconType
  },
  computed: {
    ...mapGetters(["acceptedTasks", "toBeAcceptedTasks", "role"])
  },
  mounted() {
    this.getMissions();
    this.$nextTick(() => {
      let that = this;

      this.myScroll = new BScroll(this.$refs.wrapper, {
        click: true,
        tap: true,
        probeType: 2,
        scrollbar: {
          fade: true,
          interactive: true
        },
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      });

      this.myScroll.refresh();
    });
  },
  methods: {
    toPrevPage() {
      this.$router.push("/");
    },

    // 接受任务
    acceptedTask(task) {
      this.acceptTask({ tId: task.id })
        .then(() => {
          this.getHomeMissions();
        })
        .catch(err => {
          Toast(err);
        });
    },

    // 申请任务弹窗
    toApplyTask() {
      this.dialogFormVisible = true;
    },

    // 申请任务
    applyTask() {
      this.sub = true;
      this.applyForTask({
        wrtierId: this.role.id,
        taskType: this.form.taskType
      })
        .then(() => {
          this.sub = false;
          Toast("任务申请成功");
          this.dialogFormVisible = false;
          this.getHomeMissions();
        })
        .catch(err => {
          if (err.data === -1 || err.data === -2) {
            Toast("任务申请失败");
          }

          if (err.data == 0) {
            Toast(err.message);
          }

          this.dialogFormVisible = false;
        });
    },
    // 获取任务列表
    getMissions() {
      this.getHomeMissions().then(() => {});
    },
    ...mapActions(["getHomeMissions", "acceptTask", "applyForTask"])
  },
  destroyed() {
    this.myScroll.destroy();
  }
};
</script>

<style lang="scss">
.bacn {
  background: #f7f7fa !important;
  box-shadow: none !important;
}

* {
  box-sizing: border-box;
}

.van-radio-group {
  margin: 20px;

  .van-radio {
    display: block;
    width: 60%;
    text-align: left;
    margin: 10px auto;
    /*margin-top: 10px;*/
  }
}

.h50 {
  width: 100%;
  height: 50px;
}

#swrapper {
  width: 100%;
  height: 100vh;
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
  width: 350px;
  height: 225px;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  padding: 17px 22px;
  float: left;
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
  padding: 15px 0;

  span {
    float: right;
    font-size: 14px;
    color: #8c8b90;
    margin-top: 2.5px;
    font-weight: 500;
  }
}

.home-title2 {
  width: 100%;
  font-size: 20px;
  color: #4b4e5f;
  text-align: left;
  margin: 10px 0;
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
</style>


<style lang="scss" scoped>
.home {
  background: #f7f7fa;
}

.shenqing-btn {
  color: #ff9f02 !important;
  font-size: 14px;
}

.zanwu1 {
  width: 100%;
  height: 216px;
  /*background: rgba(255, 255, 255, 1);*/
  box-shadow: 0px 4px 40px 0px rgba(21, 55, 153, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.home-box {
  width: 100%;
  padding: 0 20px;
}

.renwu .content {
  width: 230px !important;
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

