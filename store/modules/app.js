import baseapi from '@/api/base.js'
import config from '@/common/config/base.js'

const state = {
	// configVersion: uni.getStorageSync('config_version'),// 系统配置版本号信息，公共请求参数需要上送
	// configList: uni.getStorageSync('config_list'),// 系统配置信息
	configData: null,
}

const mutations = {
	SET_CONFIG: (state, configdata) => {
		state.configData = configdata
	}
}

const actions = {
	
	// 获取配置信息
	setConfigData({ commit },data) {
		
		return new Promise((resolve, reject) => {
			
			// 使用openDB获取配置文件
			const db = uniCloud.database();
			db.collection('config').get({getOne:true})
			.then(res => {
				let configdata = res.result.data
				if(configdata) {
					commit('SET_CONFIG',configdata)
					resolve(res.result)
				}
				else {
					reject(res.result)
				}
			})
			.catch(err => {
				reject(err.message)
			})
			
		})
		
	},
	
	// 获取OSS文件上传签名信息
	getosssignobj({ commit }) {
		
		return new Promise((resolve, reject) => {
			
			//根据本地是否有签名信息以及签名信息是否已经过期来判断是否需要重新请求签名信息
			//这里多增加一个设置 每次都清空本地缓存
			uni.removeStorageSync('osssignobj')
			let osssignobj = uni.getStorageSync('osssignobj')
			if( !osssignobj || osssignobj.expire > new Date().getTime() ){
				
				//需要重新来获取签名信息
				var data = {
					envinfo: config.osssignenv() // 环境信息 cjsqtest测试环境 cjsqyfb预发布环境 cjsqpro生产环境
				}
				baseapi.getosssignature(data).then(response => {
					//获取签名信息成功
					let osssignobj = response.data
					//存储到本地
					uni.setStorageSync('osssignobj',osssignobj)
					resolve(osssignobj)
				}).catch(error => {
					reject(error)
				})
			
			}
			else{
				//未过期 直接使用即可
				resolve(osssignobj)
			}
			
		})
		
	},
	
	// 获取微信JS签名信息
	getwxsignature() {
		
		return new Promise((resolve, reject) => {
			var data = {url: location.href.split('#')[0]}
			baseapi.getwxsignature(data).then(response => {resolve(response)}).catch(error => {reject(error)})
		})
		
	},
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}