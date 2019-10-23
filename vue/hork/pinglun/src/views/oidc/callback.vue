<template>
    <div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import store from '@/store/index';

    export default {
        name: 'OidcCallback',
        methods: {
            ...mapActions([
                'oidcSignInCallback'
            ])
        },
        mounted() {
            this.oidcSignInCallback()
                .then((redirectPath) => {

                    let role = store.getters.userRole;

                    if (role === "维护员" || _.includes(role, "维护员")) {
                        this.$router.push("/")
                    }

                    if (role === "供应商执行员" || _.includes(role, "供应商执行员")) {
                        this.$router.push("/sub/distributor")
                    }

                    if (role === "客户" || _.includes(role, "客户")) {
                        this.$router.push("/sub/client")
                    }

                    if (role === "超级管理员" || _.includes(role, "超级管理员")) {
                        this.$router.push("/")
                    }
                })
                .catch((err) => {
                    //发生错误，刷新页面？
                    console.error(err);
                    this.$router.push('/callback-error');
                })
        }
    }
</script>
