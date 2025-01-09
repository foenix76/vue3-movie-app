import { createApp } from 'vue'
import App from './App.vue'
// index.js는 생략이 가능 './routes/index.js' -> './routes'
import router from './routes'
import store from './store'
import loadImage from './plugins/loadImage'

createApp(App)
  .use(router) // 특정한 플러그인 사용시 .use 사용
  .use(store)
  .use(loadImage) // $loadImage 플러그인 등록
  .mount('#app')