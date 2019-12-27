<template>
  <div class="shenhe-box pingjia1-box">
    <van-nav-bar
      :title="`评价任务${position}/${allCount}`"
      :fixed="true"
      :z-index="1000"
      left-text
      left-arrow
      @click-left="toPrevPage"
    ></van-nav-bar>
    <div class="zxjz-box">
      <div class="home-title2">
        原句
        <span class="fr">{{mainSentence.length}}字</span>
      </div>
      <div class="yuanju-text">{{mainSentence}}</div>
    </div>
    <div class="zxjz-box gaixie-box">
      <div class="home-title2">
        改写
        <span class="fr">116字</span>
      </div>
      <div class="yuanju-text gaixie-text">
        <van-cell-group>
          <van-field
            v-model="childSentence"
            type="textarea"
            readonly
            @input="getLevenshtein"
            placeholder="在此输入改写后的句子"
            rows="7"
          ></van-field>
        </van-cell-group>
      </div>
    </div>
    <div class="looklike-box">
      <span class="looklike fr">相似度：{{looklike}}%</span>
      <span v-if="looklike > 60" class="looklike_ts fl">相似度大于60%，不计费。</span>
      <span v-if="childSentence.trim().length == 0" class="looklike_ts fl">字数为0，不计费。</span>
    </div>
    <div class="tongshun">
      <div class="pingfens">
        <span>通顺度评分：</span>
      </div>
      <div class="pingfens">
        <van-rate v-model="Smoothness" :count="10" />
      </div>
      <div class="pingfens" style="width:32px">
        <span>{{Smoothness ? Smoothness + '分' : '0分' }}</span>
      </div>
    </div>
    <div class="btn-box2">
      <button class="prev" :disabled="sub" @click="getPrev" v-if="!isFirst">上一个</button>
      <button class="correct" :disabled="sub" @click="getNext('正确')">
        <div class="icon">
          <img src="../assets/yes11.png" alt v-show="tag==='正确'" />
          <img src="../assets/yes1.png" alt v-show="tag!=='正确'" />
        </div>
        <p class="text">正确</p>
      </button>
      <div class="w5"></div>
      <button class="mistake" :disabled="sub" @click="getNext('错误')">
        <div class="icon">
          <img src="../assets/no11.png" alt v-show="tag==='错误'" />
          <img src="../assets/no1.png" alt v-show="tag!=='错误'" />
        </div>
        <p class="text">错误</p>
      </button>
    </div>

    <over-task :exit-task.sync="exitTask" @notExit="notExit" @yesExit="yesExit"></over-task>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { Field, CellGroup, Toast, NavBar, Popup, Rate } from 'vant'
import { exitPopupMixin } from '@/mixin/exitPopup'
import overTask from '@/components/over-task.vue'
import service from '@/utils/request'

import '@/scss/common.scss'
Vue.use(Field)
Vue.use(CellGroup)
Vue.use(Toast)
Vue.use(NavBar)
Vue.use(Popup)
Vue.use(Rate)

export default {
  name: 'Pingjia',
  props: ['rid'],
  data() {
    return {
      exitTask: false,
      position: 0,
      allCount: 0,
      id: 0,
      looklike: 0,
      mainSentence: '',
      childSentence: '',
      isFirst: true,
      isLast: false,
      tag: '',
      Smoothness: 0,
      doList: [],
      sub: false
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
          childSentence: this.childSentence,
          tag: '',
          smoothness: 0
        }
      }).then(
        res => {
          this.id = res.id
          this.mainSentence = res.mainSentence
          this.childSentence = res.childSentence
          this.isFirst = res.isFirst
          this.isLast = res.isLast
          this.position = res.position
          this.allCount = res.allCount
          this.tag = res.tag
          this.Smoothness = res.smoothness || 0
          this.looklike = 0
          this.doList = _.map(_.range(res.allCount), v => {
            return false
          })
          this.getLevenshtein(res.childSentence || '')
        },
        err => {
          Toast('获取数据出错，请重试')
        }
      )
    },
    getNext(tag) {
      this.sub = true
      if (this.Smoothness === 0) {
        Toast('请选择通顺度评分')
        return
      }
      this.tag = tag
      _.delay(() => {
        this.saveAndGet({
          target: 0,
          taskId: this.rid,
          data: {
            id: this.id,
            childSentence: this.childSentence,
            tag: tag,
            smoothness: this.Smoothness
          }
        }).then(
          res => {
            this.sub = false
            if (!_.isNull(res)) {
              this.id = res.id
              this.mainSentence = res.mainSentence
              this.childSentence = res.childSentence
              this.isFirst = res.isFirst
              this.isLast = res.isLast
              this.position = res.position
              this.allCount = res.allCount
              this.tag = res.tag
              this.Smoothness = res.smoothness || 0
              this.getLevenshtein(res.childSentence || '')

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
                this.submitTask({ taskId: this.rid }).then(() => {
                  this.sub = false
                  Toast('恭喜完成任务')
                  this.$router.push('/home')
                })
              }
            }
          },
          err => {
            this.sub = false
            Toast('保存出错，请重试')
          }
        )
      }, 400)
    },
    getPrev(tag) {
      this.sub = true
      this.saveAndGet({
        target: -1,
        taskId: this.rid,
        data: {
          id: this.id,
          childSentence: this.childSentence,
          tag: this.tag,
          smoothness: this.Smoothness
        }
      }).then(
        res => {
          this.sub = false
          this.id = res.id
          this.mainSentence = res.mainSentence
          this.childSentence = res.childSentence
          this.isFirst = res.isFirst
          this.isLast = res.isLast
          this.position = res.position
          this.allCount = res.allCount
          this.tag = res.tag
          this.Smoothness = res.smoothness || 0
          this.getLevenshtein(res.childSentence || '')
        },
        err => {
          Toast('出错，请重试')
        }
      )
    },
    ...mapActions(['saveAndGet', 'submitTask'])
  }
}
</script>


<style lang="scss">
.pingjia1-box {
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
    margin: 5px 20px 20px;
  }

  .looklike_ts {
    height: 20px;
    margin-right: 30px;
    color: red;
  }
}
.tongshun {
//   margin-top: 50px;
   position: fixed;
    top:440px;
    left: 20px;
  .pingfens {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .pingfens {
    height: 20px !important;
  }
  .van-rate__icon {
    font-size: 18px !important;
  }
  .van-rate__item {
    padding: 0 1px !important;
  }
}
.btn-box2 {
  width: 100%;
  padding: 0 20px;
  height: 68px;
  margin: 15px 0 60px;
   position: fixed;
    top:450px;

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
    width: 61px;
    height: 100%;
    margin: 4px 0 0 10px;
    float: left;

    img {
      width: 100%;
    }
  }

  .text {
    width: 40px;
    float: left;
    height: 68px;
    line-height: 68px;
  }
}
</style>

<style scoped>
.shenhe-box {
  background: #fff !important;
  height: 100vh;
  width: 100vw;
}

.jz-box {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.zxjz-box {
  width: 100%;
  height: 140px;
  /* padding: 10px 20px 20px; */
  border-top: 1px solid transparent;
  position: fixed;
  top: 46px;
}

.gaixie-box {
  /* margin-top: 0;
  padding: 0 20px; */
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
  padding: 0 0 20px;
  text-align: left;
  font-size: 16px;
  color: #8c8b90;
}

.gaixie-text {
  height: 175px;
  padding: 0 20px 20px;
  background: #f7f7fa !important;
  resize: none;
}
</style>