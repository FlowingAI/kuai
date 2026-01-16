import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../styles/global.css'
import AdminApp from './AdminApp.vue'

const app = createApp(AdminApp)
app.use(ElementPlus)
app.mount('#admin-app')
