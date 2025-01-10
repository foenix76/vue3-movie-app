<template>
  <div class="container">
    <template v-if="loading">
      <div class="skeletons">
        <div class="skeleton poster"></div>
        <div class="specs">
          <div class="skeleton title"></div>
          <div class="skeleton spec"></div>
          <div class="skeleton plot"></div>
          <div class="skeleton etc"></div>
          <div class="skeleton etc"></div>
        </div>
      </div>
      <Loader
        :size="3"
        :z-index="9"
        fixed />
    </template>
    <div
      v-else
      class="movie-details">
      <div
        :style="{ backgroundImage: `url(${requestDiffSizeImage(theMovie.Poster)})` }"
        class="poster">
        <Loader
          v-if="imageLoading"
          absolute />
      </div>
      <div class="specs">
        <div class="title">
          {{ theMovie.Title }}
        </div>
        <div class="labels">          
          <span>{{ theMovie.Released }}</span>
          <span>{{ theMovie.Runtime }}</span>
          <span>{{ theMovie.Country }}</span>          
        </div>
        <div class="plot">
          {{ theMovie.Plot }}
        </div>
        <div class="ratings">
          <h3>Ratings</h3>
          <div class="rating-wrap">
            <div
              v-for="{ Source: name, Value: score } in theMovie.Ratings"
              :key="name"
              :title="name"
              class="rating">
              <img
                :src="`/images/ratings/${name}.png`"
                :alt="name" />
              <span>{{ score }}</span>
            </div>
          </div>
        </div>
        <div>
          <h3>Actors</h3>
          {{ theMovie.Actors }}        
        </div>
        <div>
          <h3>Director</h3>
          {{ theMovie.Director }}        
        </div>
        <div>
          <h3>Production</h3>
          {{ theMovie.Production }}        
        </div>
        <div>
          <h3>Genre</h3>
          {{ theMovie.Genre }}        
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/Loader.vue';
import { mapState } from 'vuex';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      imageLoading: true // 로딩중 표시
    }
  },
  components : {
    Loader
  },
  computed: {
    ...mapState('movie', [
      'theMovie',
      'loading'
    ])
  },
  created() {
    console.log(this.$route);
    // mapActions를 이용하여 액션을 가져와서 메서드에 등록하여 사용
    // 그러나 코드만 보고는 $store의 액션이라는 것을 알 수 없기 때문에 dispatch를 쓰는게 더 나은 선택일 수 있다.
    // (강의에서는 mapActions는 삭제하여 원복함)
    // 헬퍼는 가능하면 반복적인 코드입력을 줄여주는 state등록에 사용하는것이 좋은 것 같음
    //this.$store.dispatch('movie/searchMovieWithId', {
    this.searchMovieWithId({
      id: this.$route.params.id
    })
  },
  methods: {
    ...mapActions('movie', [
      'searchMovieWithId'
    ]),
    requestDiffSizeImage(url, size = 1000) {
      if (!url || url === 'N/A') {
        this.imageLoading = false
        return '' // 이미지 없을 시 undefined 대신 빈 문자열 지정
      }
            
      const src = url.replace('SX300', `SX${size}`)      
      this.$loadImage(src)
      .then(() => {
        this.imageLoading = false
      })
      return src
    }
  } 
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 40px;  
}
.skeletons {
  display: flex;
  .poster {
    flex-shrink: 0;
    width: 500px;
    height: 500px * 3 / 2;
    margin-right: 70px;
  }
  .specs {
    flex-grow: 1;
  }
  .skeleton {
    border-radius: 10px;
    background-color:  $gray-200;
    &.title {
      width: 80%;
      height: 70px;
    }
    &.spec {
      width: 60%;
      height: 30px;
      margin-top: 20px;
    }
    &.plot {
      width: 100%;
      height: 250px;      
      margin-top: 20px;
    }
    &.etc {
      width: 50%;
      height: 50px;
      margin-top: 20px;
    }
  }
}
.movie-details {
  display: flex;
  color: $gray-600;
  .poster {
    flex-shrink: 0;
    width: 500px;
    height: 500px * 3 / 2;
    margin-right: 70px;
    border-radius: 10px;
    background-color: $gray-200;
    background-size: cover;
    background-position: center;
    position: relative;

  }
  .specs {
    flex-grow: 1;
    .title {
      color: $black;
      font-family: 'Oswald', sans-serif;
      font-size: 70px;
      line-height: 1;
      margin-bottom: 30px;        
    }
    .labels {
      color: $primary;
      span {
        &::after {
          content: "\00b7";
          margin: 0 6px;
        }
        &:last-child::after {
          display: none;
        }
      }
    }
    .plot {
      margin-top: 20px;
    }
    .ratings {
      .rating-wrap {
        display: flex;
        .rating {
          display: flex;
          align-items: cemter;
          margin-right: 32px;
          img {
            height: 30px;
            flex-shrink: 0;
            margin-right: 6px;
          }
        }
      }

    }
    h3 {
      margin: 24px 0 6px;
      color: $black;
      font-family: "Oswald", sans-serif;
      font-size: 20px;
    }
  }

  @include media-breakpoint-down(xl) {
    .poster {
      width: 300px;
      height: 300px * 3 / 2;
      margin-right: 40px;
    }
  }

  @include media-breakpoint-down(lg) {
    display : block;
    .poster {
      margin-bottom: 40px;
    }
  }

  @include media-breakpoint-down(md) {
    .specs {
      .title {
        font-size: 50px;
      }
      .ratings {
        .raring-wrap {
          display:block;
          .rating {
            margin-top: 10px;
          }
        }        
      }
    }
  }  
}
</style>