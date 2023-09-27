import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Router from "./route";
import GlobalComponents from "./components/global";

import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

// global components
Object.keys(GlobalComponents).forEach(key => {
    app.component(key, GlobalComponents[key]);
});

app.use(pinia);
app.use(Router);

app.mount("#app");

