import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/index.scss'
import 'virtual:uno.css'
import 'virtual:unocss-devtools'
import { register } from './plugin'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())

  await register(app)

  app.mount('#app')
}

bootstrap()
