<template>
  <div class="about">
    <div class="photo">
      <Loader
        v-if="imageLoading"
        absolute />
      <img
        :src="image"
        :alt="name" />
    </div>
    <div class="name">
      {{ name }}
    </div>
    <div class="email">
      {{ email }}
    </div>
    <div class="blog">
      {{ blog }}
    </div>
  </div>
</template>

<script>
import Loader from '~/components/Loader.vue';
import { mapState } from 'vuex';

export default {
  components: {
    Loader
  },
  data() {
    return {
      imageLoading: true
    }
  },
  /**
   * computed: mapState 형태로도 사용가능하지만 computed안에서 다른 변수도 사용할 수 있으므로 전개연산자...으로 할당하는것을 추천
   */
  computed: {
    ...mapState('about', [
      'image',
      'name',
      'email',
      'blog'
    ])        
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.$loadImage(this.image)
      this.imageLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.about {
  text-align: center;
  .photo {
    width: 250px;
    height: 250px;
    margin: 40px auto 20px;
    //padding: 30px;
    border: 10px solid $gray-300;
    border-radius: 50%;
    box-sizing: border-box;
    background-color: $gray-200;
    overflow: hidden;
    display: inline-block;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover; /* 이미지가 영역을 꽉 채우면서 비율 유지 */        
      object-position: center;
    }
  }
  .name {
    font-size: 40px;
    font-family: "Oswald", sans-serif;
    margin-bottom: 20px;    
  }
}
</style>