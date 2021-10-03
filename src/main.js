import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

require('@/assets/styles/fonts.css')
require('@/assets/styles/main.css')
require('@/assets/styles/responsive.css')

createApp(App).use(store).use(router).mount('#app')
