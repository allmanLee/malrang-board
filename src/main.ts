

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

// md-editor-v3
import { MdEditor } from 'md-editor-v3';
import { config } from 'md-editor-v3';


const app = createApp(App)

app.component('MdEditor', MdEditor)

// md-editor-v3 마운트

config({
  editorConfig: {
    // Default 500ms. It is set to 0ms when preview only and not set.
    renderDelay: 0
  }
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(createPinia())
app.use(router)
app.use(MdEditor)
// app.use(ElementPlus)

app.mount('#app')
