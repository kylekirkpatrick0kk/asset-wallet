import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import './style.css'
import App from './App.vue'
import queryClient from './helpers/queryClient'

const app = createApp(App);

app.use(VueQueryPlugin, { queryClient });

app.mount('#app');
