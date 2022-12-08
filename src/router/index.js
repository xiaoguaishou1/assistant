import { createRouter, createWebHashHistory } from 'vue-router'
//懒加载引入
const Index = () => import('../view/IndexPage.vue');
const Fabric = () => import('../components/Farbic.vue');
const Canvas = () => import('../components/Canvas.vue');
const routes = [
    //路由配置
    { path: '/', component: Fabric },
    {
        path: '/a',
        component: Fabric,
        name: 'a'
    },
    {
        path: "/b",
        component: Canvas,
        name: 'b'
    }

]
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})