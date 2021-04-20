import basapi from '@/api/base.js'
import userapi from "@/api/user.js"


const state = {
	accessToken: uni.getStorageSync('accessToken'),
	refreshToken: uni.getStorageSync('refreshToken'),
	user: uni.getStorageSync('user'),
}

const mutations = {
	SET_ACCESSTOKEN: (state, accessToken) => {
		state.accessToken = accessToken
		//如果accessToken存在则存储到本地 如果不存在则移除本地缓存
		if(accessToken){
			uni.setStorageSync('accessToken',accessToken)
		}
		else{
			uni.removeStorageSync('accessToken')
		}
	},
	SET_REFRESHTOKEN: (state, refreshToken) => {
		state.refreshToken = refreshToken
		//如果refreshToken存在则存储到本地 如果不存在则移除本地缓存
		if(refreshToken){
			uni.setStorageSync('refreshToken',refreshToken)
		}
		else{
			uni.removeStorageSync('refreshToken')
		}
	},
	SET_USER: (state, user) => {
		state.user = user
		//如果user存在则存储到本地 如果不存在则移除本地缓存
		if(user){
			uni.setStorageSync('user',user)
		}
		else{
			uni.removeStorageSync('user')
		}
	},
	
}

const actions = {
	
	// login
	login({ commit },data){
		return new Promise((resolve, reject) => {
			// userapi.login(data).then(response => {
				
			// 	//将获取到的用户数据存储到本地
			// 	const { data } = response
			// 	commit('SET_ACCESSTOKEN',data.accessToken)
			// 	commit('SET_REFRESHTOKEN',data.refreshToken)
			// 	commit('SET_USER',data.user)
				
			// 	resolve()
				
			// }).catch(error => {
			// 	reject(error)
			// })
			// 调用云函数登录接口
			uniCloud.callFunction({
				name: 'user',
				data: {
					type: 'login',
					info: {
						account: data.account,
						password: data.password
					}
				},
				success(res) {
					// 登录成功之后
					console.log(res.result.data)
					// 	commit('SET_ACCESSTOKEN',data.accessToken)
					// 	commit('SET_REFRESHTOKEN',data.refreshToken)
					// 	commit('SET_USER',data.user)
					resolve(res.result.data)
				},
				fail(err) {
					console.log(err);
					reject(err)
				}
			})
		})
	},
	
	// logout
	logout({ commit }){
		return new Promise((resolve, reject) => {
			userapi.logout().then(() => {
				
				// 登出成功  清除本地用户信息数据
				commit('SET_ACCESSTOKEN',null)
				commit('SET_REFRESHTOKEN',null)
				commit('SET_USER',null)
				
				resolve()
			}).catch(error => {reject(error)})
		})
	},
	
	// refresh token
	refreshtoken({ commit }) {
		
		return new Promise((resolve, reject) => {
			baseapi.refreshtoken().then(response => {
				// 获取到最新的token之后刷新本地的token
				const { data } = response
				commit('SET_ACCESSTOKEN', data.accessToken) // 更改全局状态的accessToken
				resolve(data.accessToken)
			}).catch(error => {
				reject(error)
			})
		})
		
	},
	
	// reset token
	resettoken({ commit }){
		// refreshToken过期 删除当前的用户数据
		return new Promise(resolve => {
			
			commit('SET_ACCESSTOKEN',null)
			commit('SET_REFRESHTOKEN',null)
			commit('SET_USER',null)
	
			resolve()
		})
		
	},
	
	// get userdetail
	getuserdetail({ commit }){
		return new Promise((resolve,reject) => {
			userapi.getuserdetail().then(response => {
				// 获取用户基本资料成功
				let user = response.data.user
				commit('SET_USER',user)
				resolve()
			}).catch(error => {reject(error)})
		})
	},
	
	// update userdetail 更新用户的信息
	updateuserdetail({ commit }, user){
		
		return new Promise(resolve => {
			if(user){ 
				commit('SET_USER',user)
			}
			resolve()
		})
		
	},
	
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}