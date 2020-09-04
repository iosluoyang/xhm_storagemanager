import Vue from 'vue'
import App from './App'
import i18n from '@/common/js/i18n/i18n.js'


Vue.config.productionTip = false

App.mpType = 'app'


import store from '@/store'
Vue.prototype.$store = store

import defaultconfig from '@/common/config/base.js'
Vue.prototype.$config = defaultconfig

import basejs from '@/common/js/base.js'
Vue.prototype.$basejs = basejs

import api from '@/api/index.js'
Vue.prototype.$api = api

// 引入微信wxjssdk
import jwxjs from '@/common/js/jwxjs.js'
Vue.prototype.$jwxjs = jwxjs

// 引入moment库
import moment from 'moment'
Vue.prototype.$moment = moment

import cuCustom from '@/colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import loading from '@/components/base/loading.vue'
Vue.component('loading',loading)

import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)

Vue.mixin({
	
	data() {
		return {
			helloworld: "你好世界",
		}
	},
	
	onLoad() {
		
	},
	
	computed: {
		
		// 国际化计算属性
		i18n() {
			return this.$i18nMsg().index
			// return this.$t('index')
		},
		
		// 后台返回图片标识
		imgTagStr() {
			return defaultconfig.imgTagStr()
		},
		
		// 阿里云图片前缀
		imgUrl() {
			return defaultconfig.imgUrl()
		},
		// 是否登录
		iflogin() {
			return basejs.ifloginflag()
		},
		// 用户信息
		user() {
			return store.getters.user
		}
	},
	
	onShow() {
		
	},
	
	methods: {
		
	},
});

const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
