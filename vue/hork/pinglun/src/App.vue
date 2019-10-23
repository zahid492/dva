<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name:"app",
    }
</script>

<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        height:100%;
    }

    .el-menu-vertical {
        width: 100%;
        min-height: 400px;
    }

    .el-submenu .el-menu-item {
        min-width: 100px;
    }

    .tab {
        height: 100px;
        line-height: 100px;
    }

    .tab_list {
        width: 100%;
        text-align: left;
    }

    .tab_list .item {
        font-size: 24px;
        font-weight: bold;
        float: left;
        margin-right: 30px;
        cursor: pointer;
    }

    .tab_list .item:hover {
        color: rgb(22, 132, 216);
    }

    .active {
        color: rgb(22, 132, 216);
    }
</style>
