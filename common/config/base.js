// 应用的基础信息
import store from '@/store'

//title 主标题名称
const title = function() {
	return 'StorageManager'
}

//appcolor 应用主色调 在组件或者页面的参数中使用
const appcolor = function() {
	return '#000000'
}

//首页路由
const rootrouterpath = function() {
	return'/pages/home/index'
}

//plat_code  平台信息
const plat_code = function() {
	
	if( uni.getStorageSync('plat_code') && uni.getStorageSync('plat_code') !== '' ){
		return uni.getStorageSync('plat_code')
	}
	else {
		return 'yspt'
	}
}

//share_plat_code  APP分享/跳转到其他子平台链接的时候拼接的参数，值为plat_code值
//无论是H5还是小程序还是APP  只要本地有最新的share_plat_code 则上送该最新的share_plat_code  否则上送空字符串
const share_plat_code = function() {
	
	if( uni.getStorageSync('share_plat_code') && uni.getStorageSync('share_plat_code') !== '' ){
		return uni.getStorageSync('share_plat_code')
	}
	else {
		return ''
	}
	
}

//app_key  后台服务器提供 用于接口请求的签名信息
const app_key = function() {
	return 'awerruyfhsjt234WQWR'
}

//app_id 应用ID，后台分配 用于接口请求的签名信息
const app_id = function() {
	return '40020001'
}

//app_version  应用版本号
const app_version = function() {
	return '1.0.0'
}

//根据不同环境选择不同的接口请求前缀映射
const baseUrl = function() {
	// 开发环境
	if (process.env.NODE_ENV === 'development') {
		// #ifdef H5
		return '/apiapp'
		// #endif
		
		// #ifndef H5
		return 'https://jxc.xiaohemu.net/user/test/apiapp'
		// #endif
		
	}
	// 生产环境
	else if(process.env.NODE_ENV === 'production') {
		// #ifdef H5
		return '/user/test/apiapp'
		// #endif
		
		// #ifndef H5
		return 'https://jxc.xiaohemu.net/user/test/apiapp'
		// #endif
	}
	// 其他环境
	else{
		// #ifdef H5
		return '/user/test/apiapp'
		// #endif
		
		// #ifndef H5
		return 'https://jxc.xiaohemu.net/user/test/apiapp'
		// #endif
	}
}

//根据不同环境选择不同的oss文件上传签名环境信息   xhmtest测试环境 xhmyfb预发布环境 xhmpro生产环境
const osssignenv = function() {
	if (process.env.NODE_ENV === 'development') {
		// 开发环境
		return 'xhmtest'
	} else if (process.env.NODE_ENV === 'production') {
		// 生产环境
		return 'xhmtest'
	} else {
		// 其他环境
		return 'xhmtest'
	}
}

//图片上传的文件前缀
const picuploadurl = function() {
	// 配置列表信息
	var configlist = store.getters.configList
	for(var i=0; i<configlist.length;i++){
		var configdata = configlist[i]
		if (configdata.itemKey === 'picUploadurl') {
			var servicephone = configdata.itemVal
			return servicephone
		}
		// 如果到最后也没有找到则返回空字符串
		if(i === configlist.length - 1){
			return ''
		}
	}
}


// 工程部署链接地址前缀
const httporigin = function(){
	
	var httporigin = window.location.href.split('#')[0] + '#'
	return httporigin

}

// 后台返回的图片标识字样
const imgTagStr = function() {
	return 'xhm_img'
}

// 阿里云图片前缀
const imgUrl = function() {
	// 配置列表信息
	var configlist = store.getters.configList
	for(var i=0; i<configlist.length;i++){
		var configdata = configlist[i]
		if (configdata.itemKey === 'imgUrlPrefix') {
			var imgUrl = configdata.itemVal
			return imgUrl
		}
		// 如果到最后也没有找到图片前缀的话则返回默认的图片前缀
		if(i === configlist.length - 1){
			return ''
		}
	}
}


export default {
	title: title, // 应用主标题
	appcolor: appcolor, // 应用主色调
	rootrouterpath: rootrouterpath, // 根路由路径
	plat_code: plat_code, // 平台信息 , 如yspt代表东书房应用平台，cjsq代表超级社区应用平台
	share_plat_code: share_plat_code, // APP分享/跳转到其他子平台链接的时候拼接的参数，值为plat_code值
	app_key: app_key, // appkey  后台服务器提供 用于接口请求的签名信息
	app_id: app_id, // 应用ID，后台分配 用于接口请求的签名信息
	app_version: app_version, // 应用版本号
	baseUrl: baseUrl, // 应用接口请求的前缀,
	osssignenv: osssignenv, // 应用oss文件上传的签名环境信息
	picuploadurl: picuploadurl, //图片上传的文件名前缀
	imgUrl: imgUrl, // 应用阿里云图片前缀
	imgTagStr: imgTagStr, // 后台返回的图片标识
	httporigin: httporigin, //应用工程链接前缀
}