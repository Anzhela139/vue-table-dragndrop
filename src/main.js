import './assets/main.css'
import './assets/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'

import "vuetify/styles";
import "@/styles/main.scss";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { plugin as Slicksort } from 'vue-slicksort';
import worker from './mocks/browser'
import router from './router'

const vuetify = createVuetify({
    components,
    directives,
})

if (process.env.NODE_ENV === 'development') {
    worker.start()
}  

createApp(App).use(router).use(vuetify).use(Slicksort).mount('#app')
