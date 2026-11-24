
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { uniIcons } from '@dcloudio/uni-ui'
import store from './store'
import uView from '@/uni_modules/uview-ui'
import Config from './static/js/config.js'
// vuex 管理全局变量
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
import api from './api'
import Moment from 'moment'

// #ifdef MP-WEIXIN
// 微信小程序会把 console 输出写入本地日志文件，日志量过大时会报
// "log writeFile err: the maximum size of the file storage limit is exceeded"。
// 这里对普通日志做限流 + 相同内容去重；error/warn 不拦截，避免影响排障。
(function guardMpConsole() {
    const MAX_PER_SECOND = 15
    const DEDUPE_MS = 3000
    const nativeLog = console.log.bind(console)
    let windowStart = Date.now()
    let emitted = 0
    const seen = new Map()
    console.log = (...args) => {
        const now = Date.now()
        if (now - windowStart >= 1000) {
            windowStart = now
            emitted = 0
            seen.clear()
        }
        if (emitted >= MAX_PER_SECOND) return
        const first = args[0]
        if (typeof first === 'string') {
            const key = first.length > 200 ? first.slice(0, 200) : first
            if (now - (seen.get(key) || 0) < DEDUPE_MS) return
            seen.set(key, now)
        }
        emitted++
        nativeLog(...args)
    }
})()
// #endif

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