import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { initializeGoogleAuth } from './services/googleAuth';

// Create Vuetify instance
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

// Create Vue app
const app = createApp(App);

// Use plugins
app.use(router);
app.use(store);
app.use(vuetify);

// Initialize Google Auth for Workplace for Education
initializeGoogleAuth()
  .catch(error => {
    console.error('Failed to initialize Google Auth:', error);
  })
  .finally(() => {
    // Mount app regardless of auth initialization result
    app.mount('#app');
  });