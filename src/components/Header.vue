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
    <!-- 
    이동방법 1 RouterLink to속성 이용
    <RouterLink
      to="/about"
      class="user">
      <img
        :src="image"
        :alt="name" />        
    </RouterLink>    
    -->
    <!-- 
    이동방법 2 @click + method 이용
    -->
    <div
      class="user"
      @click="toAbout">
      <img
        :src="image"
        :alt="name" />              
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
  computed: {
    image() {
      return this.$store.state.about.image

    },
    name() {
      return this.$store.state.about.name
    }
  },
  methods: {
    isMatch(path) {
      if (!path) return false
      console.log(this.$route)
      return path.test(this.$route.fullPath)
    },
    toAbout() {
    this.$router.push('/about')
  }    
  },
}
</script>

<style lang="scss" scoped>
header {
  height: 70px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  position: relative;
  .logo {
    margin-right: 40px;
  }
  .user {
    width: 40px;
    height: 40px;
    //padding: 6px;
    border-radius: 50%;
    border: 3px solid $gray-200;
    box-sizing: border-box;
    background-color: $gray-200;
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 40px;
    margin: auto;
    overflow: hidden;
    display: inline-block;    
    transition: .4s;
    &:hover {
      // background-color: darken($gray-200, 10%);
      filter: brightness(0.8); /* 밝기를 50%로 줄임 */
      transition: 0.3s ease; /* 부드러운 전환 효과 */            
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* 이미지가 영역을 꽉 채우면서 비율 유지 */        
      object-position: center;      
    }
  }
  @include media-breakpoint-down(sm) {
    .nav {
      display: none;
    }
  }
}
</style>