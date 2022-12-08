import './style.less';
import 'view-ui-plus/dist/styles/viewuiplus.css'
import App from './App.vue';
import fabricVue from './components/Farbic.vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import { createApp } from 'vue'
import ViewUIPlus from 'view-ui-plus'
import { createPinia } from "pinia";
import { router } from './router';

//数据持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
const app = createApp(fabricVue);
//状态管理
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(ViewUIPlus);
app.use(ContextMenu);


app.mount('#app')
