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
        this.$router.push('/mymedia-platforms')
      })
      .catch((err) => {
        //发生错误，刷新页面？
        this.$router.push('/callback-error');
      })
  }
}
</script>
