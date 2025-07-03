import { createRouter, createWebHistory } from 'vue-router'
import PaginaPrincipal from '../components/PaginaPrincipal.vue'
import DetalheTanque from '../components/DetalheTanque.vue'

const routes = [
    { path: '/', component: PaginaPrincipal },
    { path: '/detalhe/:id', component: DetalheTanque, props: true }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})