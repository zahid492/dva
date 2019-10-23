<template>
  <div class="home">
    <!-- 首页外层盒子 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <SideMenu></SideMenu>
      </el-aside>
      <el-container>
        <!-- 头部 -->
        <!--<el-header>-->
          <!--<Head></Head>-->
        <!--</el-header>-->
        <!-- 主体 -->
        <el-main>
          <!-- 欢迎使用妙笔综合后台！ -->

          <router-view/>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue';
// import Head from '@/views/common/Head';
import SideMenu from '@/views/common/SideMenu';
 import {
        Row,
        Col,
        Container,
        Header,
        Aside,
        Main,

    } from 'element-ui';

  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Container);
  Vue.use(Header);
  Vue.use(Aside);
  Vue.use(Main);
export default {
  name: 'home',
  components: {
    SideMenu
  }
}
</script>
<style lang="scss">
// 修改的ui原有样式
.el-container {
  height: calc(100vh - 50px);
}
.el-form-item__content {
    text-align: left;
}
.el-textarea__inner {
    resize:none !important;
}
.el-dialog {
    margin-top: 6vh !important;
}
.side {
    height: 100vh;
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
}
  .el-header {
    padding: 0;
    height: 80px !important;
    overflow: hidden;
  }
  .el-main {
    background: #f7f7f7;
  }
  .el-table {
      border-radius: 4px;
  }
  .el-dialog__body input {
    width: 300px;
  }
  .el-dialog {
    width: 40%;
  }
  // btn-box
  .btn-box {
    width: 100%;
    height: 100%;
    .edit-btn,.add-btn,.del-btn {
        width: 25%;
        float: left;
        color: #409EFF;
        cursor: pointer;
    }
  }

</style>