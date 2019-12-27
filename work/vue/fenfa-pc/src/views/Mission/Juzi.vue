<template>
  <div class="jz-box">
    <el-row>
      <el-row>
        <el-col :span="6" :offset="2" class="juzi-title">
          <div>句子对任务{{position}}/{{allCount}}</div>
        </el-col>
        <el-col :span="14" style="text-aling:right;">
          <div class="btn-box">
            <!-- id为0的时候 没有上一个 -->
            <div v-loading="loading" class="loading_box" v-show="loading">正在保存...</div>
            <button class="prev" @click="getPrev" :disabled="sub" v-if="!isFirst">上一个</button>
            <!-- <button class="next" @click="getNext('正确')" v-show="!isLast && taskGroupStatus!==7 && looklike < 60 && childSentence.trim().length !== 0">下一个</button>
            <button class="next" @click="getNext('错误')" v-show="!isLast && taskGroupStatus!==7 && looklike > 60 || childSentence.trim().length == 0">下一个</button>-->

            <button
              class="next"
              :disabled="sub"
              @click="getNext('正确')"
              v-show="taskGroupStatus==7"
            >正确</button>
            <button
              class="next"
              :disabled="sub"
              @click="getNext('错误')"
              v-show="taskGroupStatus==7"
            >错误</button>

            <button
              class="next"
              :disabled="sub"
              @click="getNext('正确')"
              v-show="taskGroupStatus!==7 && looklike <= 60 && childSentence.trim().length !== 0"
            >改好了</button>
            <button
              class="next"
              :disabled="sub"
              @click="getNext('错误')"
              v-show="taskGroupStatus!==7 && looklike > 60 || childSentence.trim().length == 0"
            >改好了</button>
            <button
              class="next"
              :disabled="sub"
              @click="getNext('错误')"
              v-show="taskGroupStatus!==7"
            >改不了</button>

            <!-- <button class="next" @click="getNext('正确')" v-if="isLast && taskGroupStatus!==7">提交</button> -->
          </div>
        </el-col>
      </el-row>
      <el-col :span="20" :offset="2" class="juzi-content">
        <el-row>
          <el-col :span="12" class="juzi-zhuanxie">
            <div class="zxjz-box">
              <div class="home-title2">
                原句
                <span class="fr">{{mainSentence.length}}字</span>
              </div>
              <div class="yuanju-text">{{mainSentence}}</div>
            </div>
          </el-col>
          <el-col :span="12" class="juzi-zhuanxie">
            <div class="gaixie-box">
              <div class="home-title2">
                改写
                <span class="fr">{{childSentence.trim().length}}字</span>
              </div>
              <div class="yuanju-text gaixie-text">
                <el-input
                  type="textarea"
                  :rows="7"
                  placeholder="在此输入改写后的句子"
                  v-model="childSentence"
                  @input="getLevenshtein"
                  class="zhuanxie-input"
                  :readOnly="taskGroupStatus!==7 ? false : true"
                ></el-input>
              </div>
              <div>
                <span class="looklike fr">相似度：{{looklike}}%</span>
                <span v-if="looklike > 60" class="looklike_ts fl">相似度大于60%，不计费。</span>
                <span v-if="childSentence.trim().length == 0" class="looklike_ts fl">字数为0，不计费。</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import service from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import { exitPopupMixin } from '@/mixin/exitPopup'
import '@/scss/common.scss'
import { Col, Row, Input, InputNumber, Loading } from 'element-ui'
// import levenshtein from "levenshtein-edit-distance";

Vue.use(Col)
Vue.use(Row)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Loading)

export default {
  name: 'Juzi',
  props: ['rid'],
  data() {
    return {
      position: 0,
      allCount: 0,
      id: 0,
      mainSentence: '',
      childSentence: '',
      isFirst: true,
      isLast: false,
      show: true,
      looklike: 0,
      over: false,
      doList: [],
      taskGroupStatus: 0,
      fullscreenLoading: false,
      sub: false,
      loading: false
    }
  },
  mixins: [exitPopupMixin],

  computed: {
    ...mapGetters(['acceptedTasks'])
  },
  beforeRouteLeave(to, from, next) {
    console.log('leave', to, from)
    if (!this.over) {
      this.$confirm('没做完就退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnHashChange: false,
        type: 'warning'
      })
        .then(() => {
          next()
        })
        .catch(() => {
          next(false)
        })

      next(false)
    } else {
      next()
    }
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
            this.looklike = (res.data * 100).toFixed(0)
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
          this.looklike = 0
          this.taskGroupStatus = res.taskGroupStatus

          this.doList = _.map(_.range(res.allCount), v => {
            return false
          })

          this.getLevenshtein(res.childSentence || '')
        },
        err => {
          console.log(this)
          this.$router.push('/home')
          this.$message('获取数据出错，请刷新页面')
        }
      )
    },

    submit() {
      // res.childSentence && res.childSentence.length > 0 &&
      // if (res.isLast && this.doList[res.position - 1]) {
      this.submitTask({ taskId: this.rid }).then(() => {
        this.$message.success('恭喜完成任务')
        this.over = true
        this.$router.push('/home')
      })
      // }
    },

    getNext(tag) {
      this.sub = true,
      this.loading = true,
      this.saveAndGet({
        target: 0,
        taskId: this.rid,
        data: {
          id: this.id,
          childSentence: this.childSentence,
          tag: tag
        },

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
            this.taskGroupStatus = res.taskGroupStatus
            this.getLevenshtein(res.childSentence || '')

            if (
              this.doList[res.allCount - 2] &&
              !this.doList[res.allCount - 1]
            ) {
              this.doList[res.allCount - 1] = true
            } else {
              this.doList[res.position - 2] = true
            }

            // res.childSentence && res.childSentence.length > 0 &&
            if (res.isLast && this.doList[res.position - 1]) {
              this.sub = true,
              this.loading = true,
              this.submitTask({
                taskId: this.rid,
                tag: tag
              }).then(() => {
                this.sub = false,
                this.loading = false,
                this.$message.success('恭喜完成任务')
                this.over = true
                this.$router.push('/home')
              })
            }
          }
        },
        err => {
          this.sub = false
          this.loading = false,
          this.$message('保存出错，请重试')
        }
      )
    },

    getPrev() {
      this.sub = true
      this.loading = true,
      this.saveAndGet({
        target: -1,
        taskId: this.rid,
        data: {
          id: this.id
          // "childSentence": "",
        }
      })
        .then(res => {
          this.sub = false
          this.loading = false,
          this.id = res.id
          this.mainSentence = res.mainSentence
          this.childSentence = res.childSentence || ''
          this.isFirst = res.isFirst
          this.isLast = res.isLast
          this.position = res.position
          this.allCount = res.allCount
          this.taskGroupStatus = res.taskGroupStatus
          this.getLevenshtein(res.childSentence || '')
          this.doList[res.position - 1] = false
        })
        .catch(() => {
          this.sub = false
          this.loading = false
          this.$message('出错，请重试')
        })
    },
    ...mapActions(['saveAndGet', 'submitTask'])
  }
}
</script>

<style lang="scss">
.loading_box {
    float: left;
    margin-top: 13px;
    font-size: 14px;
}
.loading_box .el-loading-mask {
    background: none;
}
.loading_box .el-loading-spinner {
    left: -48px;
    margin-top: -15px;
}
.loading_box .el-loading-spinner .circular {
  height: 28px;
}

.looklike,
.looklike_ts {
  text-align: right;
  font-size: 14px;
  color: rgba(75, 78, 95, 1);
  margin-top: 5px;
}

.looklike_ts {
  margin-right: 30px;
  color: red;
}

.juzi-title {
  height: 100px;
  line-height: 100px;
  text-align: left;
  font-size: 30px;
  color: rgba(75, 78, 95, 1);
}

.juzi-content {
  height: 80vh;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 10px 20px 0px rgba(54, 107, 213, 0.1);
  border-radius: 6px;
  padding: 30px 45px 50px;

  .home-title2 {
    font-size: 30px;
  }

  .yuanju-text {
    font-size: 18px;
    line-height: 20px;
  }
}

.juzi-zhuanxie {
  // background: pink;
  height: 400px;
}

.zhuanxie-input {
  .el-textarea__inner {
    resize: none;
    height: 325px;
    font-size: 18px;
  }
}

// ---------------------------------------
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
        height: 135px !important;
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
  width: 60%;
  height: 44px;
  float: right;
  padding: 0;
  text-align: right;
  margin: 24px 0 40px 0 !important;

  .prev {
    width: 16%;
    height: 100%;
    color: #525254;
  }

  .next {
    width: 25%;
    height: 100%;
    background: linear-gradient(0deg, #ff9b02, #ffc801);
    border-radius: 22px;
    font-size: 16px;
    color: #fff;
    margin-right: 10px;
  }
}

.jz-box {
  width: 100%;
  /*overflow: hidden;*/
}

.zxjz-box {
  width: 100%;
  height: 400px;
  padding: 0 20px 20px;
  border-top: 1px solid transparent;
}

.gaixie-box {
  height: 100%;
  padding: 0 20px 20px;
}

.yuanju-text {
  width: 100%;
  height: 85%;
  text-align: left;
  font-size: 16px;
  color: #8c8b90;
}

.gaixie-text {
  width: 100%;
  height: 85%;
  padding: 0 !important;
  resize: none;
}
</style>