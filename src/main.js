import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/index.js'

createApp(App)
  .use(router) // 특정한 플러그인 사용시 .use 사용
  .mount('#app')