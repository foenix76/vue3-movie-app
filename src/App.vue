<template>
  <Header />
  <RouterView />
</template>

<script>
import Header from '~/components/Header'

export default {
  components: {
    Header
  },
  created() {
    console.log('이 소스 맞냐?');
  }
}
</script>

<style lang="scss">
@import "~/scss/main";
</style>