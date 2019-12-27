<template>
  <div class="jz-box">
    <van-nav-bar
      :title="`撰写句子对${position}/${allCount}`"
      :fixed="true"
      :z-index="1000"
      left-text
      left-arrow
      @click-left="toPrevPage"
    >
      <!-- <van-icon name="../assets/jiantouicon.png" /> -->
      <!-- <van-icon name="https://b.yzcdn.cn/vant/icon-demo-1126.png"/> -->
    </van-nav-bar>
    <div class="zxjz-box">
      <div class="home-title2">
        原句
        <span class="fr">{{mainSentence.length}}字</span>
      </div>
      <div class="yuanju-text">{{mainSentence}}</div>
    </div>

    <div class="gaixie-box">
      <div class="home-title2">
        改写
        <div v-loading="loading" class="loading_box" v-show="loading">正在保存...</div>
        <span class="fr">{{childSentence.length}}字</span>
      </div>
      <div class="yuanju-text gaixie-text">
        <van-cell-group>
          <van-field
            v-model="childSentence"
            type="textarea"
            placeholder="在此输入改写后的句子"
            @input="getLevenshtein"
            rows="7"
            :readOnly="taskGroupStatus!==7 ? false : true"
          ></van-field>
        </van-cell-group>
      </div>
    </div>
    <div class="looklike-box">
      <span class="looklike fr">相似度：{{looklike}}%</span>
      <span v-if="looklike > 60" class="looklike_ts fl">相似度大于60%，不计费。</span>
      <!-- <span v-loading="loading" class="loading_box" v-show="loading">正在提交...</span> -->
      <span v-if="childSentence.length == 0" class="looklike_ts fl">字数为0，不计费。</span>
    </div>
    <!-- v-if="taskGroupStatus!==7" -->
    <!-- <div class="btn-box"  v-if="taskGroupStatus!==7"> -->
    <!-- id为0的时候 没有上一个 -->
    <!-- <button class="prev" @click="getPrev" v-if="!isFirst">上一个</button>
            <button class="next" @click="getNext('正确')" v-if="!isLast">下一个</button>
            <button class="next" @click="getNext('正确')" v-if="isLast">提交</button>
    </div>-->
    <!-- <van-button type="primary" text="显示遮罩层" @click="zhezhao = true" />
        <van-overlay 
        :show="zhezhao"
        @click="zhezhao = false"
    />-->
    <div class="btn-box2">
      <button class="prev" :disabled="sub" @click="getPrev" v-if="!isFirst">上一个</button>
      <button
        class="correct"
        :disabled="sub"
        @click="getNext('正确')"
        v-show="looklike <= 60 && childSentence.trim().length !== 0"
      >
        <div class="icon">
          <img src="../assets/yes11.png" alt v-show="tag==='正确'" />
          <img src="../assets/yes1.png" alt v-show="tag!=='正确'" />
        </div>
        <p class="text" v-if="taskGroupStatus!==7">改好了</p>
        <p class="text" v-if="taskGroupStatus==7">正确</p>
      </button>
      <button
        class="correct"
        :disabled="sub"
        @click="getNext('错误')"
        v-show="looklike > 60 || childSentence.trim().length == 0"
      >
        <div class="icon">
          <img src="../assets/yes11.png" alt v-show="tag==='错误'" />
          <img src="../assets/yes1.png" alt v-show="tag!=='错误'" />
        </div>
        <p class="text" v-if="taskGroupStatus!==7">改好了</p>
        <p class="text" v-if="taskGroupStatus==7">正确</p>
      </button>

      <div class="w5"></div>
      <button class="mistake" :disabled="sub" @click="getNext('错误')">
        <div class="icon">
          <img src="../assets/no11.png" alt v-show="tag==='错误'" />
          <img src="../assets/no1.png" alt v-show="tag!=='错误'" />
        </div>
        <p class="text" v-if="taskGroupStatus!==7">改不了</p>
        <p class="text" v-if="taskGroupStatus==7">错误</p>
      </button>
    </div>

    <over-task :exit-task.sync="exitTask" @notExit="notExit" @yesExit="yesExit"></over-task>
  </div>
</template>

<script>
import Vue from 'vue'
import service from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
// import levenshtein from "levenshtein-edit-distance";
import {
  Field,
  CellGroup,
  Toast,
  NavBar,
  Popup,
  RadioGroup,
  Overlay
} from 'vant'
import { exitPopupMixin } from '@/mixin/exitPopup'
import overTask from '@/components/over-task.vue'
import '@/scss/common.scss'

Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Toast)
Vue.use(NavBar)
Vue.use(Popup)
Vue.use(RadioGroup)
Vue.use(Overlay)

export default {
  name: 'Juzi',
  props: ['rid'],
  data() {
    return {
      exitTask: false,
      position: 0,
      allCount: 0,
      id: 0,
      mainSentence: '',
      childSentence: '',
      taskGroupStatus: '',
      tag: '',
      isFirst: true,
      isLast: false,
      show: true,
      looklike: 0,
      radio: '1',
      value1: 0,
      pingfen: '',
      over: false,
      doList: [],
      zhezhao: false,
      sub: false,
      loading: false
    }
  },
  mixins: [exitPopupMixin],
  components: {
    'over-task': overTask
  },
  computed: {
    ...mapGetters(['acceptedTasks'])
  },

  mounted() {
    this.getInit()

    // if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function() {
      if (
        document.activeElement.tagName == 'INPUT' ||
        document.activeElement.tagName == 'TEXTAREA'
      ) {
        window.setTimeout(function() {
          document.activeElement.scrollIntoViewIfNeeded()
        }, 0)
      }
    })
    // }
    // 键盘弹出事件
    var winHeight = $(window).height()
    console.log(winHeight)
    $(window).resize(function() {
      var thisHeight = $(this).height()
      if (winHeight - thisHeight > 140) {
        $('.gaixie-text').css({
          height: '135px'
        })
        $('.gaixie-box').css({
          top: '160px'
        })
        $('.gaixie-box .van-cell').css({
          padding: '6px 0 0',
          'font-size': '16px'
        })
        $('.home-title2').css({
          margin: '0',
          'font-size': '14px'
        })
      } else {
        $('.gaixie-text').css({
          height: '175px'
        })
        $('.gaixie-box').css({
          top: '180px'
        })
        $('.gaixie-box .van-cell').css({
          padding: '20px 0 0',
          'font-size': '18px'
        })
        $('.home-title2').css({
          margin: '10px 0',
          'font-size': '16px'
        })
      }
    })
  },

  methods: {
    getLevenshtein(v) {
      let vv = _.trim(v)
      if (this.mainSentence != '' && vv != '') {
        service({
          url: 'Helper/ComputedEditDistanceSimilarity',
          method: 'post',
          data: {
            source: this.mainSentence,
            target: vv
          }
        })
          .then(res => {
            this.looklike = res.data <= 0 ? 0 : (res.data * 100).toFixed(0)
          })
          .catch(err => {
            this.looklike = 0
          })
      } else {
        this.looklike = 0
      }
    },
    getInit() {
      this.saveAndGet({
        target: 0,
        taskId: this.rid,
        data: {
          id: this.id,
          childSentence: this.childSentence
        }
      }).then(
        res => {
          this.id = res.id
          this.mainSentence = res.mainSentence
          this.childSentence = res.childSentence || ''
          this.isFirst = res.isFirst
          this.isLast = res.isLast
          this.position = res.position
          this.allCount = res.allCount
          this.taskGroupStatus = res.taskGroupStatus

          this.doList = _.map(_.range(res.allCount), v => {
            return false
          })
          this.getLevenshtein(res.childSentence || '')
        },
        err => {
          Toast('获取数据出错，请刷新页面')
        }
      )
    },

    getNext(tag) {
      this.goNext(tag)
    },

    goNext(tag) {
      this.sub = true
      this.loading = true
      this.saveAndGet({
        target: 0,
        taskId: this.rid,
        data: {
          id: this.id,
          childSentence: this.childSentence,
          tag: tag
        }
      }).then(
        res => {
          this.sub = false
          this.loading = false
          if (!_.isNull(res)) {
            this.id = res.id
            this.mainSentence = res.mainSentence
            this.childSentence = res.childSentence || ''
            this.isFirst = res.isFirst
            this.isLast = res.isLast
            this.position = res.position
            this.allCount = res.allCount
            this.getLevenshtein(res.childSentence || '')
            this.taskGroupStatus = res.taskGroupStatus

            if (
              this.doList[res.allCount - 2] &&
              !this.doList[res.allCount - 1]
            ) {
              this.doList[res.allCount - 1] = true
            } else {
              this.doList[res.position - 2] = true
            }

            if (res.isLast && this.doList[res.position - 1]) {
              this.sub = true
              this.loading = true
              this.submitTask({
                taskId: this.rid,
                tag: tag
              }).then(() => {
                this.sub = false
                this.loading = false
                Toast('恭喜完成任务')
                this.over = true
                this.$router.push('/home')
              })
            }
          }
        },
        err => {
          this.sub = false
          this.loading = false
          Toast('保存出错，请重试')
        }
      )
    },

    getPrev(tag) {
      this.sub = true
      this.loading = true
      this.saveAndGet({
        target: -1,
        taskId: this.rid,
        data: {
          id: this.id,
          tag: this.tag
          // "childSentence": "",
        }
      }).then(
        res => {
          this.sub = false
          this.loading = false
          this.id = res.id
          this.tag = res.tag
          this.mainSentence = res.mainSentence
          this.childSentence = res.childSentence || ''
          this.isFirst = res.isFirst
          this.isLast = res.isLast
          this.position = res.position
          this.allCount = res.allCount
          this.taskGroupStatus = res.taskGroupStatus
          this.getLevenshtein(res.childSentence || '')

          this.doList[res.position - 1] = false
        },
        err => {
          this.sub = false
          this.loading = false
          Toast('出错，请重试')
        }
      )
    },
    ...mapActions(['saveAndGet', 'submitTask'])
  }
}
</script>

<style lang="scss">
/* 正在保存loading */
.loading_box {
  position: absolute;
    top: 15px;
    left: 75px;
    font-size: 14px;
    color: #8c8b90;
}
.loading_box .van-loading {
  width: 20px !important;
  height: 20px !important;
  margin-right: 5px;
}
.loading_box .van-loading__spinner {
  margin-top: 0 !important;
  margin-right: 5px;
}
.btn-box2 {
  width: 100%;
  padding: 0 20px;
  height: 68px;
  margin: 15px 0 60px;
  position: fixed;
  top: 450px;

  .correct,
  .mistake {
    width: 35%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 20px 0px rgba(37, 48, 98, 0.15);
    border-radius: 10px;
    font-size: 16px;
    color: #525254;
  }

  .w5 {
    width: 5%;
    height: 100%;
    display: inline-block;
  }

  .prev {
    height: 100%;
    width: 25%;
    font-size: 16px;
    float: left;
    color: #525254;
  }

  .icon {
    width: 35px;
    height: 100%;
    line-height: 58px;
    margin: 4px 0 0 10px;
    float: left;
    img {
      width: 100%;
    }
  }

  .text {
    width: calc(100% - 46px);
    float: left;
    height: 68px;
    line-height: 68px;
  }
}
.looklike-box {
  height: 20px;
  margin: 10px 5px 20px;
  width: 100%;
  position: fixed;
  padding: 0 20px;
  top: 400px;
}

.looklike,
.looklike_ts {
  text-align: right;
  font-size: 14px;
  color: rgba(75, 78, 95, 1);
}

.looklike_ts {
  margin-right: 30px;
  color: red;
}

.tongyi-top {
  background: none !important;
}

.van-hairline--bottom:after {
  border: none !important;
}

.end-btn {
  background: none;
  color: #4b4e5f;
  border: 1px solid #bfbfbf;
}

.van-cell-group {
  background: none;
  height: 100% !important;

  .van-cell {
    margin: 0 !important;
    padding: 0;

    .van-cell-group {
      background: none;
      height: 100% !important;

      .van-cell {
        background: none;
        height: 100% !important;
        padding: 0 !important;
      }

      .van-cell__value--alone {
        font-size: 16px !important;
        color: #21232d !important;
      }

      .van-field__body {
        height: 100% !important;
      }

      .van-field__control {
        height: 100% !important;
        color: #21232d !important;
      }

      .van-field__control {
        padding-top: 10px !important;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.btn-box {
  width: 100%;
  height: 44px;
  padding: 0 20px;
  margin: 10px 0 60px !important;

  .prev {
    width: 30%;
    height: 100%;
    color: #525254;
  }

  .next {
    width: 70%;
    height: 100%;
    background: linear-gradient(0deg, #ff9b02, #ffc801);
    border-radius: 22px;
    font-size: 16px;
    color: #fff;
  }
}

.jz-box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.zxjz-box {
  width: 100%;
  height: 140px;
  padding: 0 20px 20px;
  position: fixed;
  top: 46px;
  border-top: 1px solid transparent;
}

.gaixie-box {
  //   margin-top: 0;
  //   padding: 0 20px;
  position: fixed;
  top: 180px;
  width: 100%;
}
.gaixie-box .home-title2 {
  padding: 0 20px;
}

.yuanju-text {
  width: 100%;
  height: 80px;
  overflow-y: scroll;
  text-align: left;
  font-size: 16px;
  color: #8c8b90;
}

.gaixie-text {
  height: 175px;
  padding: 10px 20px 20px;
  background: #f7f7fa;
  resize: none;
}
</style>