<template>
	<view class="persondetail">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.nav.persondetail}}</block>
		</cu-custom>
		
		<!-- 个人详细信息区域 -->
		<form>
			
			<!-- 个人头像 -->
			<!-- <view class="cu-form-group margin-top padding" @tap.stop="chooseimg"> -->
				<!-- <view class="title">{{i18n.me.persondetail.avatar}}</view> -->
				<!-- <template> -->
					<!-- <view v-if="(user && user.avatar) || avatarfile " class="cu-avatar round lg" :style="{backgroundImage: 'url('+(avatarfile ? avatarfile.path : (imgUrl + user.avatar))+')'}"></view>
					<view v-else class="cu-avatar round lg">
						<text class="cuIcon-people"></text>
					</view> -->
					<!-- <uni-file-picker 
					    disable-preview
					    :del-icon="false"
					    return-type="object"
					>选择头像</uni-file-picker> -->
				<!-- </template> -->
			<!-- </view> -->
			
			<!-- 账号 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.account}}</view>
				<input type="text" disabled :value="username" />
			</view>
			
			<!-- 昵称 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.nickname}}</view>
				<input type="text" v-model="nickname" />
			</view>
			
			<!-- 真实姓名 -->
			<!-- <view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.realname}}</view>
				<input type="text" v-model="realname" />
			</view> -->
			
			<!-- 性别 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.gender}}</view>
				<view class="content flex align-center">
					<view class="margin-right">{{ gender===1 ? i18n.base.male : gender === 2 ? i18n.base.female : ''}}</view>
					<switch class='switch-sex' @change="(e) => { this.gender = e.detail.value ? 1 : 2 }" :class="gender===1?'checked':''" :checked="gender===1"></switch>
				</view>
			</view>
			
			<!-- 手机号 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.phone}}</view>
				<input type="number" v-model="mobile" />
			</view>
			
			<!-- 邮箱 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.email}}</view>
				<input type="text" v-model="email" />
			</view>
			
			<!-- 用户身份 -->
			<!-- <view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.usertype}}</view>
				<view class="content">
					<view class="cu-tag radius" :class="[user.type === 0 ? 'bg-blue' : 'bg-cyan']">
						{{ user.type === 0 ? i18n.base.admin : i18n.base.normaladmin }}
					</view>
				</view>
			</view> -->
			
			<!-- 个人简介 -->
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1"  v-model="comment" :placeholder="i18n.me.persondetail.signature"></textarea>
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
	
	const db = uniCloud.database();
	const dbCollectionName = 'uni-id-users';
		
	export default {
		data() {
			return {
				username: '', // 用户名
				avatarfile: null, // 头像图片文件
				nickname: '', // 用户昵称
				// realname: '', // 用户真实姓名
				mobile: '', // 用户手机号
				email: '', // 用户邮箱
				gender: 0, // 用户性别 0未知 1男 2女
				comment: '', //个人简介
				ifmodify: false, // 是否正在修改  默认为否
				btnanimationname: null, // 当前按钮动画  默认为null
			};
		},
		
		onLoad() {
			
			this.nickname = this.user.nickname || ''
			// this.realname = this.user && this.user.realName ? this.user.realName : ''
			this.username = this.user.username || ''
			this.gender = this.user.gender || 0
			this.mobile = this.user.mobile || ''
			this.email = this.user.email || ''
			this.comment = this.user.comment || ''
		},
		
		methods: {
			
			// 点击选择头像
			chooseimg() {
				const _this = this
				_this.$basejs.chooseImage({
					count: 1,
					success(res) {
						_this.avatarfile = res.tempFiles[0]
					}
				})
				
			},
			
			// 修改个人资料
			modifydetail() {
				
				const _this = this
				
				// 使用 clientDB 提交数据
				let updatedata = {
					nickname: this.nickname,
					gender: this.gender,
					mobile: this.mobile,
					email: this.email,
					comment: this.comment
				}
				_this.ifmodify = true // 开始加载动画
				
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

<style lang="scss">

	.persondetail{
		.cu-form-group input{
			text-align: right;
		}
	}
</style>
