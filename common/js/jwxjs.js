import basejs from '@/common/js/base.js'

// 微信H5环境下引入jweixin包
var jweixin
let wxsignaturebean // 微信签名信息对象

if(basejs.ifwxH5()) {
	jweixin = require('jweixin-module')
}

// 获取微信签名信息
async function getwxsignature(callback) {
	
	// 调用微信签名接口
	await store.dispatch('app/getWXsignature').then(response => {
		
		// 签名获取成功
		wxsignaturebean = response.data.bean
		// 开始注入微信配置
		configjwxjs(callback)
		
	}).catch(error => {
		//获取数据失败
		uni.showToast({
			title: error.msg || error,
			icon: 'none'
		});
	})
	
}

// 开始配置微信jssdk
function configjwxjs(callback) {
	
	// 检测如果没有jwexin则直接return掉
	if(!jweixin) return
	
	// 注入配置信息
	let debug = process.env.NODE_ENV === 'development'
	jweixin.config({
		debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: wxsignaturebean.appId, // 必填，公众号的唯一标识
		timestamp: wxsignaturebean.timestamp, // 必填，生成签名的时间戳
		nonceStr: wxsignaturebean.nonceStr, // 必填，生成签名的随机串
		signature: wxsignaturebean.signature,// 必填，签名
		jsApiList: [
			'updateAppMessageShareData',
			'updateTimelineShareData',
			'onMenuShareWeibo',
			'onMenuShareQZone',
			'startRecord',
			'stopRecord',
			'onVoiceRecordEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',
			'onVoicePlayEnd',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'translateVoice',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard'
		] // 必填，需要使用的JS接口列表
	})
	
	jweixin.ready(function(){
		// 注入配置完成之后就可以在这里调用相对应的API接口
		if (callback) callback(jweixin) // 配置成功
	})
	
	jweixin.error(function(res){
		// 注入配置失败 清空签名信息
		wxsignaturebean = null
		uni.showToast({
			title: `微信配置失败,请重试:\n${JSON.stringify(res)}`,
			icon: 'none'
		});
	})

}

export default{
	configjwxjs
}