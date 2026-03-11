
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { uniIcons } from '@dcloudio/uni-ui'
import store from './store'
import uView from '@/uni_modules/uview-ui'
import Config from './static/js/config.js'
// vuex管理全局变量 vuex状态交给uview的模式管理
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
// import '@/assets/css/subpages.css'
import api from './api'
import Moment from 'moment'


Vue.component('uni-icons', uniIcons)
Vue.use(uView)
Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.$Config = Config
Vue.prototype.$api = api
Vue.prototype.$moment = Moment;
const bus = new Vue()
Vue.prototype.$bus = bus
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// // #ifdef VUE3
// import { createSSRApp } from 'vue'
// import App from './App.vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// // #endif