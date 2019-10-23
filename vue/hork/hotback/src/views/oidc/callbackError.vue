<template>
  <div>
    <h1>认证发生错误，请重试</h1>
  </div>
</template>

<script>
export default {
  name: 'OidcCallbackError',
  mounted(){
    this.$router.push("/")
  }
}
</script>
