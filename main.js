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

// 引入uview库
import uView from "uview-ui";
Vue.use(uView);

// 自定义导航栏组件
import cuCustom from '@/colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

// 加载动画组件
import loading from '@/components/base/loading.vue'
Vue.component('loading',loading)

// 上拉加载下拉刷新组件
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
	
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
		}
	},
	
	computed: {
		
		// 国际化计算属性
		i18n() {
			return this.$i18nMsg().index
			// return this.$t('index')
		},
		
		// 当前语言类型
		currentLang() {
			if(this.$i18n.locale == 'zh') {
				return 'cn'
			}
			return this.$i18n.locale
		},
		
		// 配置文件对象
		configData() {
			return this.$store.getters.configData
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
		},
		
	},
	
	onShow() {
		
	},
	
	methods: {
		
		// 导航栏返回
		pageBack() {
			uni.navigateBack()
		},
		
	},
});

const app = new Vue({
	i18n,
	store,
    ...App
})
app.$mount()
