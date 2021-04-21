import Vue from 'vue'
import VueI18n from 'vue-i18n'


// 自定义的语言包
import zh from './langs/zh.js'
import en from'./langs/en.js'
import th from './langs/th.js'

// 如果有第三方框架如elementUI等UI框架的本地语言包在这里导入即可

Vue.use(VueI18n)

// 组织语言包
// const messages = {
// 	zh: Object.assign({},zh),
// 	en: Object.assign({},en),
// 	th: Object.assign({},th),
// }

// 组织语言包  在uni-app跨平台中使用
const messages = {
	zh: {
		index: Object.assign({},zh)
	},
	en: {
		index: Object.assign({},en)
	},
	th: {
		index: Object.assign({},th)
	},
}

// 设置当前的默认语言
// 如果本地有上次缓存的语言环境则使用本地缓存的语言环境  否则没有则使用用户当前浏览器的语言 如果未找到匹配的话则默认为英文
// 默认语言为英文
let locale = 'en'
let localelang = uni.getStorageSync('lang')
console.log(`当前用户本地缓存语言环境为:${localelang}`);
// 如果本地存在则使用本地存储的语言环境
if(localelang) {
	locale = localelang
}
// 如果本地不存在则获取当前用户的语言环境
else{
	// 检测用户当前语言环境
	try {
		let language = uni.getSystemInfoSync().language;  // 获取的为形如 zh_CN 或者en_US之类的标识 此处截取_前面的标识
		console.log(`系统的语言为:${language}`)
		
		// 判断当前语言是否在语言包中
		let selectlanguage = Object.keys(messages).find((lang) => {return (language.indexOf(lang) > -1)})
		if(selectlanguage) {
			locale = selectlanguage
		}
		
	} catch (e) {
		console.log(`获取用户语言环境失败,${JSON.stringify(e)}`)
	}
}

console.log(`当前用户的语言环境为${locale}`);


const i18n = new VueI18n({
	locale: locale,
	messages: messages
})

// 重要！！！！！  否则在APP平台无法进行国际化
Vue.prototype._i18n = i18n
Vue.prototype.$i18nMsg = function(){
    return i18n.messages[i18n.locale]
}

export default i18n

