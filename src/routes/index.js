import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home.vue'
import About from './About.vue'
import Movie from './Movie.vue'
import NotFound from './NotFound.vue'

export default createRouter({
    history: createWebHashHistory(),
    // scrollBehavior 적용하지 않아도 상단으로 스크롤 됨
    scrollBehavior() {
        return { top: 0 }
    },
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/movie/:id',
            component: Movie
        },
        {
            path: '/about',
            component: About
        },
        {
            path: '/:notPound(.*)',
            component: NotFound
        }
    ]
})