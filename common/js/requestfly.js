import store from '@/store'
import defaultconfig from "@/common/config/base.js"
import md5 from 'js-md5'
import i18n from '@/common/js/i18n/i18n.js'
import { getrequestbasepara } from "@/common/js/base.js"


// 根据不同平台引入不同的fly库

// 浏览器和React Native 引入默认的fly库
// #ifdef H5
var Fly = require("flyio/dist/npm/fly")
// #endif

// #ifdef APP-PLUS
var Fly = require("flyio/dist/npm/wx")
// #endif

// 在微信小程序中 引入fly/wx库
// #ifdef MP-WEIXIN
var Fly = require("flyio/dist/npm/wx")
// #endif

// 在weex应用中  引入fly/weex库
// #ifdef APP-PLUS-NVUE
var Fly = require("flyio/dist/npm/weex")
// #endif


var fly = new Fly
var newfly = new Fly



//fly的基础配置

// 配置请求根域名
fly.config.baseURL = defaultconfig.baseUrl()
fly.config.timeout = 60000
fly.config.method = 'POST'
fly.config.withCredentials = true

newfly.config = fly.config // 将fly的config复制给newfly的config  保持所有请求的通用配置都一致

var ifneedrefreshtoken = false // 是否需要刷新token的标识 默认不需要刷新token(开发调试的时候用 后期可能根据是否临近失效时间而定)

// 拦截请求参数然后对其进行参数包装
function makeparamsforrequest(config) {
	
  // 添加content-type
  if (!config.headers) config.headers = {}
  
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // 如果有access的话则添加accessToken至header中
  if (store.getters.accessToken) {
    config.headers['accessToken'] = store.getters.accessToken
  }

  // 添加必传参数的数据
  var originaldata = getrequestbasepara(config.body)
  config.body = originaldata
  
  return config
}

// 配置请求拦截器
/*
请求拦截器中的request对象结构如下：
	baseURL,  //请求的基地址
	body, //请求的参数
	headers, //自定义的请求头
	method, // 请求方法
	timeout, //本次请求的超时时间
	url, // 本次请求的地址
	withCredentials //跨域请求是否发送第三方cookie
*/
var requestinterceptor = function(config) { //不要使用箭头函数，否则调用this.lock()时，this指向不对

	console.log(`本次接口请求上送的数据为:\n${JSON.stringify(config.body)}`)
	
	// 在拦截请求的时候判断accessToken是否失效需要重新获取refreshtoken
	// 如果需要刷新token并且当前不并在刷新token的过程中 则开始请求新的token
	if (ifneedrefreshtoken) {
		fly.lock()
		ifneedrefreshtoken = false
		
		// 开始请求refreshtoken 注意这里需要使用一个新的fly实例去请求refreshtoken的数据 如果用同一个fly实例的话会导致死锁的问题
		return store.dispatch('user/refreshtoken').then((accessToken) => {
			// 获取到最新的accessToken
			config = makeparamsforrequest(config)
			return config// 只有最终返回config对象时，原来的请求才会继续
		}).finally(() => {
			fly.unlock()
		})
		
	}
	else {
		// 不需要重新获取token 直接包装请求参数即可
		config = makeparamsforrequest(config)
		return config // 显式返回包装过的config
	}
}

fly.interceptors.request.use(requestinterceptor)
newfly.interceptors.request.use(requestinterceptor)

// 配置响应拦截器
/*
响应拦截器中的response对象结构如下
	data, //服务器返回的数据
	engine, //请求使用的http engine(见下面文档),浏览器中为本次请求的XMLHttpRequest对象
	headers, //响应头信息
	request  //本次响应对应的请求信息
*/
var responseinterceptor = function(response) {
	
	// console.log(`本次接口返回的信息为:${JSON.stringify(response)}`);
	console.log(`本次接口返回的状态为:\n${JSON.stringify(response.data.msg)}`)
	
	const res = response.data

	// 首先进行验签操作 当sign数据为非 no sign 字样的时候进行验签
	if (fres.sign !== 'no sign') {
		var timestamp = res.timestamp

		// 前端进行签名字符串 使用MD5的方式进行签名，待签名字符串为， timestamp=xxx&app_key
		var originalsign = 'timestamp=' + timestamp + '&' + defaultconfig.app_key()
		var mycountsign = md5(originalsign).toUpperCase()

		// 判断本地计算出来的签名和后台返回的签名是否一致 一致再进行下一步操作 否则报错直接返回
		if (mycountsign !== res.sign) {
			return Promise.reject({msg:'接口验签失败'})
		}
    }

	// 统一的错误码处理 报接口错误信息  特殊错误码做特殊处理
	// E10019/E10029/E30003	用户被禁用/账号信息不存在/非本人token	跳转到登录页面
	// E10023 系统配置信息需要更新
	// E10027	强制版本升级
	// E20006 非工作时间段不能进行此业务操作
	// E30001 token失效，调用refreshToken接口获取新token
	// E30004 refreshToken过期需要跳转到登录页面用户重新登录
	// E30005 该用户已在其他地方登陆
	if (res.errorCode === '000000') {
		// 接口调用成功
		return res
	} 
	else if (res.errorCode === 'E10019' || res.errorCode === 'E10029' || res.errorCode === 'E30003') {
		// 用户被冻结
		uni.showModal({
			content: i18n.messages[i18n.locale].index.managepeople.handlemember.userfreeze,
			showCancel: false,
			confirmText: i18n.messages[i18n.locale].index.base.confirm,
			success: res => {
				if(res.confirm) {
					// 重置至登录页面  首先需要删除本地的token信息
					store.dispatch('user/resettoken').then(() => {
						uni.reLaunch({
							url: `/pages/base/login?forbidback=true` // 禁止后退
						})
					})
				}
			}
		})
		return Promise.reject(res || {msg:i18n.messages[i18n.locale].index.managepeople.userfreeze} )
	}
	else if (res.errorCode === 'E10023') {
		// 系统配置信息需要更新
		
		//锁定响应拦截器
		fly.lock()
		// 开始请求app/setConfigData 注意这里需要使用一个新的fly实例去请求app/setConfigData的数据 如果用同一个fly实例的话会导致死锁的问题
		return store.dispatch('app/setConfigData',{request: 'newfly'}).then(() => {
			// 获取到最新的配置信息
		})
		.finally(() => {
			fly.unlock() // 解锁
		}).then(() => {
			return fly.request(response.request) // 重新发起之前的请求
		})
		
	} 
	else if (res.errorCode === 'E10027') {
		
		// 强制版本升级
		uni.showModal({
			content: i18n.messages[i18n.locale].index.tip.findnewversion,
			showCancel: false,
			confirmText: i18n.messages[i18n.locale].index.base.confirm,
			success: res => {
				if(res.confirm) {
					// 开始下载新版本
					
					const downloadTask = uni.downloadFile({
					    url: 'http://www.example.com/file/test', //仅为示例，并非真实的资源
					    success: (res) => {
					        if (res.statusCode === 200) {
					            console.log('下载成功');
					        }
					    }
					});
					
					downloadTask.onProgressUpdate((res) => {
					    console.log('下载进度' + res.progress);
					    console.log('已经下载的数据长度' + res.totalBytesWritten);
					    console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
					
					    // 测试条件，取消下载任务。
					    if (res.progress > 50) {
					        downloadTask.abort();
					    }
					});
					
				}
			}
		})
		
		return Promise.reject({msg:'Updating……'} )
		
	}
	else if (res.errorCode === 'E20006') {
		// 非工作时间段不能进行此业务操作
		uni.showModal({
			content: i18n.messages[i18n.locale].index.tip.notinworkingtime,
			showCancel: false,
			confirmText: i18n.messages[i18n.locale].index.base.confirm
		})
		return Promise.reject({msg:i18n.messages[i18n.locale].index.tip.notinworkingtime} )
	}
	else if (res.errorCode === 'E30001') {
		// token失效，调用refreshToken接口获取新token
		// 锁定响应拦截器
		fly.lock()
		// 开始请求refreshtoken 注意这里需要使用一个新的fly实例去请求refreshtoken的数据 如果用同一个fly实例的话会导致死锁的问题
		return store.dispatch('user/refreshtoken',{request: 'newfly'}).then((accesstoken) => {
			console.log(accesstoken);
		})
		.finally(() => {
			fly.unlock() // 解锁
		}).then(() => {
			return fly.request(response.request) // 重新发起之前的请求
		})
		
    } 
	else if (res.errorCode === 'E30004') {
      // refreshToken过期或者用户信息不存在需要跳转到登录页面用户重新登录
      // 首先需要删除本地的token信息
      return store.dispatch('user/resettoken').then(() => {
        uni.reLaunch({
        	url: '/pages/base/login'
        })
        reject(res || {msg:'登录态失效'})
      })
    }
	else if (res.errorCode === 'E30005') {
      // 该用户已在其他地方登录  弹出提示框然后进行页面跳转
	  uni.showModal({
	  	content: i18n.messages[i18n.locale].index.tip.loginotherplace,
	  	showCancel: false,
	  	confirmText: i18n.messages[i18n.locale].index.base.confirm,
	  	success: res => {
	  		if(res.confirm) {
	  			// 跳转至登录页面  首先需要删除本地的token信息
	  			return store.dispatch('user/resettoken').then(() => {
	  				uni.reLaunch({
	  					url: '/pages/base/login?forbidback=true'
	  				})
	  				
	  			})
	  		}
	  	}
	  })
	  return Promise.reject(res || {msg:i18n.messages[i18n.locale].index.tip.loginotherplace} )
		
    } 
	else {
      // 其他常见错误
      return Promise.reject(res)
    }
}

fly.interceptors.response.use(responseinterceptor)
newfly.interceptors.response.use(responseinterceptor)


export default {
	fly: fly,// 正常接口的请求实例
	newfly: newfly // 当需要调起正常接口的请求发送特殊请求的时候的实例
}