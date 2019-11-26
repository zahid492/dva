<template>
   <p>正在退出任务分发管理系统</p>
</template>

<script>
     import store from "@/store/index";

    export default {
        name: "Logout",
        mounted() {
            store.dispatch("signOutOidc");
        }

    };

</script>
