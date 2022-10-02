import { createApp } from "vue";
// import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import SvgIconVue from "./components/SvgIcon.vue";
import "virtual:svg-icons-register";
import "uno.css";
const app = createApp(App);

// app.use(createPinia());
app.use(router);
app.component("SvgIcon", SvgIconVue);

app.mount("#app");
