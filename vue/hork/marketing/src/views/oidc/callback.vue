<template>
  <div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'OidcCallback',
  methods: {
    ...mapActions([
      'oidcSignInCallback'
    ])
  },
  created () {
    this.oidcSignInCallback()
      .then((redirectPath) => {
        console.log(redirectPath);
        this.$router.push('/missionlist')
      })
      .catch((err) => {
        //发生错误，刷新页面？
        console.error(err);
        this.$router.push('/callback-error');
      })
  }
}
</script>
