import { createMemoryHistory, createRouter } from 'vue-router'
import NotImplemented from './components/NotImplemented.vue'
import Products from './components/Products.vue'

const routes = [
    { path: '/', component: Products },
    { path: '/not-yet', component: NotImplemented },
    { path: '/products', component: Products },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes // short for `routes: routes`
})

export default router