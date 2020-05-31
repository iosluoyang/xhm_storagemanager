import store from '@/store/index.js'
var wx
let ifalreadyconfig = false // 是否已经配置了的标识 默认为否

// 开始配置微信jssdk
async function configjwxjs(callback) {
	
	// 如果是微信H5环境则进行引入微信jssdk
	// #ifdef H5
	let ua = window.navigator.userAgent.toLowerCase();
	let ifwxH5 =  ua.match(/MicroMessenger/i) == 'micromessenger';
	if(ifwxH5) {
		
		// 如果是已经配置过的话则直接返回wx对象
		if(ifalreadyconfig) {
			callback(wx) // 返回之前的配置对象
			return
		}
		else {
			// 开始重新配置
			console.log(`开始配置微信jssdk……`);
			
			wx = require('jweixin-module')
			
			// 调用微信签名接口
			await store.dispatch('app/getWXsignature').then(response => {
				
				// 签名获取成功
				let wxsignaturebean = response.data.bean
				
				// 注入配置信息
				let debug = process.env.NODE_ENV === 'development'
				wx.config({
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
				
				wx.ready(function(){
					// 注入配置完成之后就可以在这里调用相对应的API接口
					ifalreadyconfig = true
					callback(wx)
				})
				
				wx.error(function(res){
					// 注入配置失败
					ifalreadyconfig = false
					uni.showToast({
						title: `微信配置失败,请重试:\n${JSON.stringify(res)}`,
						icon: 'none'
					});
				})
				
			}).catch(error => {
				//获取数据失败
				uni.showToast({
					title: error.msg || error,
					icon: 'none'
				});
			})
			
		}
		
	}
	// #endif
	
}

export default{
	configjwxjs
}