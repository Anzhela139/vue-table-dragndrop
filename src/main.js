import './assets/main.css'
import './assets/materialdesignicons.css'

import { createApp } from 'vue'
import App from './App.vue'
// Vuetify
import "vuetify/styles";
import "@/styles/main.scss";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { plugin as Slicksort } from 'vue-slicksort';

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App).use(vuetify).use(Slicksort).mount('#app')
