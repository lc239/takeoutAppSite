import '@/assets/base.css'
import '@/assets/class.css'
import '@/assets/transition.css'
import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/es/components/message/style/css'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

//改成按需引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import router from './router'

const app = createApp(App)

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }
// app.use(ElementPlus)

app.use(router)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')
