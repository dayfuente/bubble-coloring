// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
