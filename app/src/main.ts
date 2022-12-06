import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Router from "./route";

import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(Router);

app.mount("#app");

