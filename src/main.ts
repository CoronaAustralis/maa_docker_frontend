import './assets/main.css'
import 'vue-diff/dist/index.css'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import { definePreset } from '@primevue/themes'
import Toast from 'vue-toastification'
import VueDiff from 'vue-diff'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

app.use(createPinia())
app.use(ConfirmationService)
app.use(Toast, { timeout: 2000 })
app.use(VueDiff)

const NewAura = definePreset(Aura, {
  components: {
    card: {
      bodyPadding: '0.5rem',
      titleFontSize: '1rem',
      marginBottom: '1rem',
    },
    panel: {
      titleFontWeight: 'var(--p-card-title-font-weight)',
    },
  },
})
app.use(PrimeVue, {
  theme: {
    preset: NewAura,
    options: {
      prefix: 'p',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
  pt: {
    card: {
      root: {
        style: {
          position: 'relative',
          'border-radius': 'var(--p-panel-border-radius)',
          border: '1px solid var(--p-panel-border-color)',
          'box-shadow': 'none',
        },
      },
      body: {
        // class:"text-sm hover:bg-gray-100 cursor-pointer"
      },
    },
  },
})
app.mount('#app')
