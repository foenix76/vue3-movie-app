<template>
  <header>
    <Logo />
    <div class="nav nav-pills">
      <div
        v-for="nav in navigations"
        :key="nav.name"
        class="nav-items">
        <!-- v-bind:to에서 v-bind는 생략 가능 -->
        <RouterLink
          :to="nav.href"
          active-class="active"
          class="nav-link"
          :class="{ active: isMatch(nav.path) }">
          {{ nav.name }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
<script>
import Logo from '~/components/Logo.vue';

export default {
  components: {
    Logo
  },
  data() {
    return {
      navigations: [
        {
          name: 'Search',
          href: '/'
        },
        {
          name: 'Movie',
          href: '/movie/tt10753786',
          path: /^\/movie/
        },
        {
          name: 'About',
          href: '/about'
        },
      ]
    }
  },
  methods: {
    isMatch(path) {
      if (!path) return false
      console.log(this.$route)
      return path.test(this.$route.fullPath)
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  height: 70px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  .logo {
    margin-right: 40px;
  }
}
</style>