<template>
	<view class="persondetail">
		
		<!-- 导航栏 -->
		<cu-custom class="menavbar" bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{i18n.nav.persondetail}}</block>
		</cu-custom>
		
		<!-- 个人详细信息区域 -->
		<form>
			
			<!-- 个人头像 -->
			<view class="cu-form-group margin-top padding" @tap.stop="chooseimg">
				<view class="title">{{i18n.me.persondetail.avatar}}</view>
				<template>
					<view v-if="(user && user.avatar) || avatarfile " class="cu-avatar round lg" :style="{backgroundImage: 'url('+(avatarfile ? avatarfile.path : (imgUrl + user.avatar))+')'}"></view>
					<view v-else class="cu-avatar round lg">
						<text class="cuIcon-people"></text>
					</view>
				</template>
			</view>
			
			<!-- 昵称 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.nickname}}</view>
				<input type="text" v-model="nickname" />
			</view>
			
			<!-- 真实姓名 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.realname}}</view>
				<input type="text" v-model="realname" />
				
			</view>
			
			<!-- 账号 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.account}}</view>
				<input type="text" disabled :value="account" />
			</view>
			
			<!-- 手机号 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.phone}}</view>
				<input type="number" v-model="phone" />
			</view>
			
			<!-- 邮箱 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.email}}</view>
				<input type="text" v-model="email" />
			</view>
			
			<!-- 性别 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.gender}}</view>
				<view class="content flex align-center">
					<view class="margin-right">{{sex===0 ? i18n.base.female : i18n.base.male}}</view>
					<switch class='switch-sex' @change="chooseGender" :class="sex===1?'checked':''" :checked="sex===1"></switch>
				</view>
			</view>
			
			<!-- 用户身份 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.persondetail.usertype}}</view>
				<view class="content">
					<view class="cu-tag radius" :class="[user.type === 0 ? 'bg-blue' : 'bg-cyan']">
						{{ user.type === 0 ? i18n.base.admin : i18n.base.normaladmin }}
					</view>
				</view>
			</view>
			
			<!-- 个人简介 -->
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1"  v-model="signature" :placeholder="i18n.me.persondetail.signature"></textarea>
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
	export default {
		data() {
			return {
				avatarfile: null, // 头像图片文件
				nickname: '', // 用户昵称
				realname: '', // 用户真实姓名
				account: '', // 用户账号
				phone: '', // 用户手机号
				email: '', // 用户邮箱
				sex: 0, // 用户性别 0女1男2保密
				signature: '', //个人简介
				ifmodify: false, // 是否正在修改  默认为否
				btnanimationname: null, // 当前按钮动画  默认为null
			};
		},
		
		onLoad() {
			
			this.nickname = this.user && this.user.userName ? this.user.userName : ''
			this.realname = this.user && this.user.realName ? this.user.realName : ''
			this.account = this.user && this.user.account ? this.user.account : ''
			this.sex = this.user && this.user.sex ? this.user.sex : 0
			this.phone = this.user && this.user.phone ? this.user.phone : ''
			this.email = this.user && this.user.email ? this.user.email : ''
			this.signature = this.user && this.user.signature ? this.user.signature : ''
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
		
			// 选择性别
			chooseGender(e) {
				this.sex = e.detail.value ? 1 : 0
			},
			
			// 修改个人资料
			modifydetail() {
				
				const _this = this
				
				// 修改其它信息资料
				const modifyother = function(avatarUrl) {
					
					_this.ifmodify = true // 开始加载动画
					
					let data = {
						realName: _this.realname,
						userName: _this.nickname,
						sex: _this.sex,
						phone: _this.phone,
						email: _this.email,
						avatar: avatarUrl,
						signature: _this.signature
					}
					
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
