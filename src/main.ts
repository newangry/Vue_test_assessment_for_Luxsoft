import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import vuetify from './plugins/vuetify'
//import { useGlobalState } from './globalState';

const app = createApp(App).use(store).use(router);
//useGlobalState(); // Provide the global state
app.mount('#app')
