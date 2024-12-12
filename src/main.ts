import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import App from './App.vue'
import { definePreset } from '@primevue/themes'

const app = createApp(App)

app.use(createPinia())

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
        }
      },
      body: {
        // class:"text-sm hover:bg-gray-100 cursor-pointer"
      },
    },
  },
})
app.mount('#app')
