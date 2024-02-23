

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // Element Plus icons
// import 'element-plus/theme-chalk/dark/css-vars.css' // dark mode
import './assets/main.scss' // global css

import App from './App.vue'
import router from './router'

// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/message.scss";

// messagebox
import "element-plus/theme-chalk/src/message-box.scss";

// notification
import "element-plus/theme-chalk/src/notification.scss";

// import './styles/element/index.scss' // custom Element Plus css

// import 'element-plus/dist/index.css' // global Element Plus css
// import "element-plus/dist/index.css";
const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(createPinia())
app.use(router)
// app.use(ElementPlus)

app.mount('#app')
