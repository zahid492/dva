<template>
    <div>
        重定向中...
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import store from '@/store/index';

    export default {
        name: 'OidcCallback',
        methods: {
            ...mapActions([
                'oidcSignInCallback'
            ])
        },
        created() {
            this.oidcSignInCallback()
                .then((redirectPath) => {
                    let role = store.getters.oidcUser.role;

                    if (role === "人力资源" || _.includes(role, "人力资源")) {
                        this.$router.push("/account")
                    } else if (role === "游客" || _.includes(role, "游客")) {
                        this.$router.push("/mpassword")
                    } else {
                        this.$router.push(redirectPath)
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
