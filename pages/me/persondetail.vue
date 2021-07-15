<template>
	<view class="persondetail">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.nav.persondetail}}</block>
		</cu-custom>
		
		<!-- 个人详细信息区域 -->
		<form v-if="userInfo">
			
			<!-- 个人头像 -->
			<view class="cu-form-group margin-top padding">
				<view class="title">{{ i18n.me.persondetail.avatar }}</view>
				
				<template>
					<uni-file-picker ref="filepickerref" v-model="filesArr" :limit="1" return-type="array" :del-icon="false" :auto-upload="false" mode='grid' disable-preview :imageStyles="imageStyles" file-mediatype="image" @select="fileselect" @progress="fileprogress" @success="filesuccess" @fail="filefail"></uni-file-picker>
				</template>
			</view>
			
			<!-- 账号 -->
			<view class="cu-form-group text-grey">
				<view class="title">{{i18n.me.persondetail.account}}</view>
				<input type="text" disabled :value="userInfo.username" />
			</view>
			
			<!-- 用户身份 -->
			 <view class="cu-form-group">
				<view class="title flex-sub">{{i18n.me.persondetail.usertype}}</view>
				<view class="content">
					<view class="usertag cu-tag radius" :class="[ $basejs.getrolenameandcolor(user.role).bgColor ]">
						{{ $basejs.getrolenameandcolor(user.role).title }}
					</view>
				</view>
			</view>
			
			<!-- 昵称 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.nickname}}</view>
				<input type="text" v-model="userInfo.nickname" />
			</view>
			
			<!-- 真实姓名 -->
			<!-- <view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.realname}}</view>
				<input type="text" v-model="userInfo.realname" />
			</view> -->
			
			<!-- 性别 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.gender}}</view>
				<picker v-if="pickerRange" @change="pickerChange" :value="pickerIndex" :range="pickerRange" range-key="title">
					<view class="picker">
						{{ pickerRange[pickerIndex].title }}
					</view>
				</picker>
			</view>
			
			<!-- 手机号 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.phone}}</view>
				<input type="number" v-model="userInfo.mobile" />
			</view>
			
			<!-- 邮箱 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.email}}</view>
				<input type="text" v-model="userInfo.email" />
			</view>
			
			<!-- #ifdef MP-WEIXIN -->
			<!-- 是否绑定微信 -->
			<view class="cu-form-group">
				
				<view class="title">
					<text class="cuIcon cuIcon-weixin text-green margin-right-sm"></text>
					微信/WeChat
				</view>
				
				<u-switch v-model="ifBindWx" @change="bindwx"></u-switch>
				<!-- <switch :checked="ifBindWx" @change="bindwx" /> -->
				
			</view>
			<!-- #endif -->
			
			<!-- 个人简介 -->
			<view class="cu-form-group">
				<textarea maxlength="-1"  v-model="userInfo.comment" :placeholder="i18n.me.persondetail.signature"></textarea>
			</view>
			
		</form>
		
		<!-- 按钮 -->
		<view class="btnview padding flex flex-direction">
			<button class="cu-btn bg-gradual-orange round shadow lg"
					:class="[btnanimationname ? 'animation-' + btnanimationname :'']"
					:data-class="btnanimationname ? btnanimationname : '' "
					@tap.stop="modifydetail" :loading="ifmodify">{{i18n.base.save}}</button>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	const db = uniCloud.database();
	const dbCollectionName = 'uni-id-users';
		
	export default {
		data() {
			return {
				imageStyles:{
					width:64,
					height:64,
					border: {
						radius: '50%'
					}
				},
				
				filesArr: [],
				
				userInfo: null,
				
				pickerIndex: 0, // 默认选中第0个
				pickerRange: [], // 单选数据内容
				
				ifBindWx: false, // 是否绑定了微信
				
				ifmodify: false, // 是否正在修改  默认为否
				btnanimationname: null, // 当前按钮动画  默认为null
			};
		},
		
		onLoad() {
			
			_this = this
			
			// 选择要更新和展示的用户信息
			this.userInfo = {
				avatar: this.user.avatar,
				username: this.user.username,
				nickname: this.user.nickname,
				gender: this.user.gender,
				mobile: this.user.mobile,
				email: this.user.email,
				comment: this.user.comment,
			}
			
			// 返显头像
			this.filesArr = [
				{
					name: '',
					extname: '',
					url: this.user.avatar
				}
			]
			
			// 设置性别数据内容
			let pickerRange = [
				{
					title: this.i18n.base.unknown,
					value: 0
				},
				{
					title: this.i18n.base.male,
					value: 1
				},
				{
					title: this.i18n.base.female,
					value: 2
				}
			]
			this.pickerRange = pickerRange
			
			// 返显性别
			let pickerIndex = pickerRange.findIndex(item => (item.value == this.user.gender))
			if(pickerIndex > -1) {
				this.pickerIndex = pickerIndex
			}
			
			// 设置是否绑定了微信
			if(this.user && this.user.wx_openid && this.user.wx_openid['mp-weixin']) {
				this.ifBindWx = true
			}
			
		},
		
		computed: {
			
			// ifBindWx() {
				
			// 	let ifBindWx = Boolean(this.user && this.user.wx_openid && this.user.wx_openid['mp-weixin'])
			// 	return ifBindWx
				
			// }
			
		},
		
		methods: {
			
			// 选择图片成功
			fileselect(e) {
				console.log(`图片选择成功,`);
				console.log(e);
				this.filesArr = e.tempFiles
			},
			
			// 图片上传
			fileprogress(e) {
				console.log(`上传图片中`);
				console.log(e);
			},
			
			// 上传图片成功
			filesuccess(e) {
				console.log(`上传图片成功,`);
				console.log(e);
				this.ifmodify = false // 关闭加载动画
				this.filesArr = e.tempFiles
				let avatar = e.tempFilePaths[0]
				this.userInfo.avatar = avatar
				this.modifydetail() // 开始上传其他数据
			},
			
			// 上传图片失败
			filefail(e) {
				// 上传图片失败
				console.log(`上传图片失败`);
				console.log(e);
				this.ifmodify = false // 关闭加载动画
			},
			
			// 单选
			pickerChange(e) {
				let selectIndex = e.detail.value
				this.pickerIndex = selectIndex
				
				let gendervalue = this.pickerRange[this.pickerIndex].value
				this.$set(this.userInfo, 'gender', gendervalue)
			},
			
			// 绑定微信
			bindwx(value) {
				
				// 已绑定  进行解绑
				if(!value) {
					
					uni.showLoading({
						mask: true
					})
					uniCloud.callFunction({
						name: 'user',
						data: {
							type: 'unbindwx',
							info: {}
						},
						success(res) {
							if(res.result.code == 0) {
								// 解绑成功
								_this.ifBindWx = false
								uni.showToast({
									title: _this.i18n.tip.fixsuccess,
									icon: 'none'
								});
								
								// 重新获取用户信息
								_this.$store.dispatch('user/getuserdetail').then(() => {
									// 获取成功
								}).catch(error => {
									// 获取失败
									uni.showToast({
										title: _this.i18n.error.networkerror,
										icon: 'none'
									});
								})
							}
							else {
								_this.ifBindWx = true
								uni.showToast({
									title: `${res.result.message}`,
									icon: 'none'
								});
							}
						},
						complete() {
							uni.hideLoading()
						}
					})
					
				}
				// 未绑定 进行绑定
				else {
					
					// #ifdef MP-WEIXIN
					// 开始绑定微信
					uni.login({
						provider: 'weixin',
						success(res) {
							let code = res.code
							// 开始绑定
							uni.showLoading({mask: true})
							uniCloud.callFunction({
								name: 'user',
								data: {
									type: 'bindwx',
									info: {
										wxcode: code
									}
								},
								success(res) {
									if(res.result.code == 0) {
										// 绑定成功
										uni.showToast({
											title: _this.i18n.tip.fixsuccess,
											icon: 'none'
										});
										
										_this.ifBindWx = true
										
										// 重新获取用户信息
										_this.$store.dispatch('user/getuserdetail').then(() => {
											// 获取成功
										}).catch(error => {
											// 获取失败
											uni.showToast({
												title: _this.i18n.error.networkerror,
												icon: 'none'
											});
										})
										
									}
									// 绑定失败
									else {
										_this.ifBindWx = false
										uni.showToast({
											title: `${res.result.message}`,
											icon: 'none'
										});
									}
								},
								complete() {
									uni.hideLoading()
								}
							})
						}
					})
					// #endif
					
				}
				
			},
			
			// 修改个人资料
			modifydetail() {
				
				const _this = this
				
				_this.ifmodify = true // 开始加载动画
				
				// 根据文件是否有path字段来判断是否选择了新的本地图片 来决定是否上传
				if(this.filesArr.find(item => {return item.progress == 0})) {
					console.log(`存在新图片 此时要进行上传`);
					// 开始上传图片
					_this.$refs.filepickerref.upload()
					return
				}
				else {
					console.log(`不存在新图片  直接进行上传`);
				}
				// 使用 clientDB 提交数据
				let updatedata = {...this.userInfo}
				
				db.collection(dbCollectionName).doc(this.user._id).update(updatedata).then((res) => {
				  
					// 修改成功
					// 开始修改vuex的用户信息
					_this.$store.dispatch('user/updateuserdetail', updatedata).then(() => {
						// 更新成功
						_this.avatarfile = null // 重置头像文件
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none'
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					})
				  
				}).catch((err) => {
					
					// 修改失败
					uni.showToast({
						title: _this.i18n.error.fixerror,
						icon: 'none'
					});
					
					_this.btnanimationname = 'shake'
					setTimeout(function() {
						_this.btnanimationname = null
					}, 1000);
				  
				}).finally(() => {
				  _this.ifmodify = false // 关闭加载动画
				})
				
				return
				
				// 修改其它信息资料
				const modifyother = function(avatarUrl) {
					
					_this.ifmodify = true // 开始加载动画
					
					let data = {
						// realName: _this.realname,
						username: _this.username,
						gender: _this.gender,
						mobile: _this.mobile,
						email: _this.email,
						// avatar: avatarUrl,
						comment: _this.comment
					}
					
					// 开始修改个人信息
					
					
					_this.$api.userapi.modifyuserdetail(data).then(response => {
						// 修改成功
						// 开始修改vuex的用户信息
						
						let olduser = _this.$store.getters.user
						
						let modifyuser = {
							realName: data.realName,
							userName: data.userName,
							sex: data.sex,
							phone: data.phone,
							email: data.email,
							avatar: data.avatar || olduser.avatar || null ,
							signature: data.signature
						}
						let newuser = Object.assign({}, olduser, modifyuser)
						
						_this.$store.dispatch('user/updateuserdetail', newuser).then(() => {
							// 更新成功
							_this.ifmodify = false // 关闭加载动画
							_this.avatarfile = null // 重置头像文件
							uni.showToast({
								title: _this.i18n.tip.fixsuccess,
								icon: 'none'
							});
						})
						
						
					}).catch(error => {
						// 修改失败
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
						
						_this.ifmodify = false // 关闭加载动画
						_this.btnanimationname = 'shake'
						setTimeout(function() {
							_this.btnanimationname = null
						}, 1000);
						
					})
					
					
				}
				
				// 如果有头像文件则说明修改了头像 开始上传头像文件
				if(this.avatarfile) {
					
					this.ifmodify = true // 开始加载动画
					
					this.$basejs.uploadmultipleimgs([this.avatarfile]).then(imgUrls => {
						_this.ifmodify = false // 取消加载动画
						
						// 上传图片成功
						let avatarUrl = imgUrls[0]
						// 开始修改其它资料
						modifyother(avatarUrl)
						
					}).catch(error => {
						_this.ifmodify = false // 取消加载动画
						// 上传图片失败
						uni.showToast({
							title: this.i18n.error.picuploaderror,
							icon: 'none'
						});
					})
				}
				// 没有头像则直接开始修改其它资料
				else{
					// 开始修改其它资料
					modifyother()
				}
				
			}
		},
	}
</script>

<style lang="scss" scoped>

	.persondetail{
		.cu-form-group input{
			text-align: right;
		}
	}
</style>
