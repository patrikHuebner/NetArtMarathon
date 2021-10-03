import { createApp } from 'vue'
import App from './App.vue'
import { newRouter } from './router';
import store from './store'

import "@/assets/bootstrap/bootstrap.min.css";

require('@/assets/styles/index.scss')

newRouter().then((router) => {
    createApp(App).use(store).use(router).mount('#app');
})
