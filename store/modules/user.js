import basapi from '@/api/base.js'
import userapi from "@/api/user.js"


const state = {
	accessToken: uni.getStorageSync('accessToken'),
	accessTokenExpiredDate: uni.getStorageSync('accessTokenExpiredDate'),
	refreshToken: uni.getStorageSync('refreshToken'),
	user: uni.getStorageSync('user'),
	shoppingcartNum: 0, // 用户购物车数量
}

const mutations = {
	SET_ACCESSTOKEN: (state, accessToken) => {
		state.accessToken = accessToken
		//如果accessToken存在则存储到本地 如果不存在则移除本地缓存
		if(accessToken){
			uni.setStorageSync('uni_id_token',accessToken)
		}
		else{
			uni.removeStorageSync('uni_id_token')
		}
	},
	SET_ACCESSTOKENEXPIREDDATE: (state, accessTokenExpiredDate) => {
		state.accessTokenExpiredDate = accessTokenExpiredDate
		//如果accessTokenExpiredDate存在则存储到本地 如果不存在则移除本地缓存
		if(accessTokenExpiredDate){
			uni.setStorageSync('uni_id_token_expired',accessTokenExpiredDate)
		}
		else{
			uni.removeStorageSync('uni_id_token_expired')
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
		let userwithuid = user ? {...user, ...{uid: user._id}} : null // 增加user的uid字段
		// 更改user的role为单个值
		if(userwithuid) {
			userwithuid.role = userwithuid.role && Array.isArray(userwithuid.role) && userwithuid.role.length > 0 ? userwithuid.role[0] : null
		}
		state.user = userwithuid
		
		//如果user存在则存储到本地 如果不存在则移除本地缓存
		if(user){
			uni.setStorageSync('user',userwithuid)
		}
		else{
			uni.removeStorageSync('user')
		}
	},
	SET_SHOPPINGCARTNUM: (state, shoppingcartnum) => {
		state.shoppingcartNum = shoppingcartnum
	},
	
}

const actions = {
	
	// register
	register({ commit }, data) {
		return new Promise((resolve, reject) => {
			// 调用云函数注册接口
			uniCloud.callFunction({
				name: 'user',
				data: {
					type: 'register',
					info: {
						account: data.account,
						password: data.password,
						invitecode: data.invitecode,
						role: data.role,
						store: data.store,
						shipping: data.shipping
					}
				},
				success(res) {
					// 注册成功
					if(res.result.code == 0) {
						resolve(res.result)
					}
					// 注册出错
					else {
						reject(res.result)
					}
				},
				fail(err) {
					console.log(err);
					reject(err)
				}
			})
		})
	},
	
	// login
	login({ commit },data){
		return new Promise((resolve, reject) => {
			// 调用云函数登录接口
			uniCloud.callFunction({
				name: 'user',
				data: {
					type: 'login',
					info: {
						account: data.account,
						password: data.password,
					}
				},
				success(res) {
					// 登录成功
					if(res.result.code == 0) {
						let token = res.result.token
						let tokenExpiredDate = res.result.tokenExpired
						let userInfo = res.result.userInfo
						commit('SET_ACCESSTOKEN',token)
						commit('SET_ACCESSTOKENEXPIREDDATE',tokenExpiredDate)
						commit('SET_USER',userInfo)
						resolve(res.result)
					}
					// 登录出错
					else {
						reject(res.result)
					}
				},
				fail(err) {
					console.log(err);
					reject(err)
				}
			})
		})
	},
	
	// wxlogin
	wxlogin({ commit },data){
		return new Promise((resolve, reject) => {
			
			uni.login({
				provider:'weixin',
				success(res) {
					let code = res.code
					
					// 调用云函数微信登录接口
					uniCloud.callFunction({
						name: 'user',
						data: {
							type: 'wxlogin',
							info: Object.assign({}, {wxcode: code}, data && data.invitecode ? {invitecode: data.invitecode} : null )
						},
						success(res) {
							// 登录成功
							if(res.result.code == 0) {
								let token = res.result.token
								let tokenExpiredDate = res.result.tokenExpired
								let userInfo = res.result.userInfo
								commit('SET_ACCESSTOKEN',token)
								commit('SET_ACCESSTOKENEXPIREDDATE',tokenExpiredDate)
								commit('SET_USER',userInfo)
								resolve(res.result)
							}
							// 登录出错
							else {
								reject(res.result)
							}
						},
						fail(err) {
							console.log(err);
							reject(err)
						}
					})
					
				}
			})
			
		})
	},
	
	// bindwx
	bindwx({ commit }, data) {
		return new Promise((resolve, reject) => {
			// 调用云函数绑定微信接口
			uniCloud.callFunction({
				name: 'user',
				data: {
					type: 'register',
					info: {
						account: data.account,
						password: data.password
					}
				},
				success(res) {
					// 注册成功之后
					// 注册成功 返回用户信息相关的东西
					if(res.result.code == 0) {
						let token = res.result.token
						let tokenExpiredDate = res.result.tokenExpired
						let userInfo = res.result.userInfo
						commit('SET_ACCESSTOKEN',token)
						commit('SET_ACCESSTOKENEXPIREDDATE',tokenExpiredDate)
						resolve(res.result)
					}
					// 注册出错
					else {
						reject(res.result)
					}
				},
				fail(err) {
					console.log(err);
					reject(err)
				}
			})
		})
	},
	
	// logout
	logout({ dispatch, commit }){
		return new Promise((resolve, reject) => {
			
			// 调用云函数登出
			uniCloud.callFunction({
				name: 'user',
				data: {
					type: 'logout'
				},
				success(res) {
					// 登出成功
					if(res.result.code == 0) {
							// 登出成功  清除本地用户信息数据
							commit('SET_ACCESSTOKEN',null)
							commit('SET_REFRESHTOKEN',null)
							commit('SET_USER',null)
							commit('SET_SHOPPINGCARTNUM', 0)
							resolve()
					}
					// 登出失败
					else {
						reject(res.result)
					}
				}
			})
			
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
			commit('SET_SHOPPINGCARTNUM', 0)
	
			resolve()
		})
	},
	
	// get userdetail
	getuserdetail({ dispatch, commit }){
		return new Promise((resolve,reject) => {
			
			uniCloud.callFunction({
				name: 'user',
				data: {
					type: 'getuserinfo'
				}
			}).then(res => {
				// 获取成功
				if(res.result.code == 0) {
					// 加载个人信息成功
					let user = res.result.userInfo
					commit('SET_USER',user)
					resolve()
				}
				else {
					reject(res.result)
				}
			}).catch(err => {
				// 加载失败
				reject(err)
			})
			
		})
	},
	
	// update userdetail 更新用户的信息
	updateuserdetail({ state, commit }, user){
		return new Promise(resolve => {
			if(user){ 
				let newuser = {...state.user, ...user}
				commit('SET_USER',newuser)
			}
			resolve()
		})
	},
	
	// get user shoppingcart number
	getshoppingcartnum({commit}) {
		return new Promise((resolve,reject) => {
			
			const db = uniCloud.database();
			db.collection('wish-draft-product')
			.where(`creatUid == $cloudEnv_uid && status == 0`)
			.count()
			.then(response => {
				if(response.result.code == 0) {
					let shoppingcartnum = response.result.total
					commit('SET_SHOPPINGCARTNUM',shoppingcartnum)
					resolve()
				}
				else {
					console.log(`获取购物车数量失败`);
					reject(res.result)
				}
			})
			.catch(error => {
				console.log(`获取购物车数量失败`);
				console.log(error);
				reject(error)
			})
			
		})
	}
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}