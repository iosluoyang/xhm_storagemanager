<template>
	<view class="handlemember">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-purple" isBack>
			<block slot="content">{{navtitle}}</block>
		</cu-custom>
		
		<!-- 添加的列表内容 -->
		<form>
			<!-- 人员名称 -->
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.managepeople.handlemember.name}}</view>
				<input type="text" v-model="membername" />
			</view>
			
			<!-- 人员账号 编辑状态下有 -->
			<view v-if="type === 'edit'" class="cu-form-group">
				<view class="title text-gray">{{i18n.managepeople.handlemember.account}}</view>
				<input disabled :value="memberaccount" />
			</view>
			
			<!-- 人员备注 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					{{i18n.managepeople.handlemember.remark}}
				</view>
			</view>
			
			<view class="cu-form-group">
				<textarea maxlength="-1" v-model="memberremark" :placeholder="i18n.managepeople.handlemember.remarkplaceholder"></textarea>
			</view>
			
			<!-- 冻结/解冻用户 -->
			<view v-if="type==='edit'" class="cu-list menu margin-top">
				
				<view class="cu-item freezeitem">
					<view class="content">
						<view>
							<text class="text-black">{{i18n.managepeople.handlemember.freezemember}}</text>
						</view>
						
						<view>
							<text class="text-grey text-sm">{{iffreeze ? i18n.managepeople.handlemember.userfreeze : i18n.managepeople.handlemember.userunfreeze}}</text>
						</view>
						
						
					</view>
					<view class="action">
						<switch @change="freezemember" :class="iffreeze?'checked':''" :checked="iffreeze"></switch>
					</view>
				</view>
				
			</view>
			
			<!-- 重置用户密码为初始密码 -->
			<view v-if="type==='edit'" class="cu-form-group" @tap.stop="resetmemberpwd">
				<view class="title text-red">{{i18n.managepeople.handlemember.resetmemberpwd}}</view>
			</view>
			
			<!-- 删除用户 -->
			<view v-if="type==='edit'" class="cu-form-group" @tap.stop="deletemember">
				<view class="title text-red">{{i18n.managepeople.handlemember.deleteuser}}</view>
			</view>
		</form>
		
		<!-- 确定按钮 -->
		<view class="btnview padding flex flex-direction">
			<button class="cu-btn bg-gradual-purple round shadow lg"
					:class="[btnanimationname ? 'animation-' + btnanimationname :'']"
					:data-class="btnanimationname ? btnanimationname : '' " @tap.stop="confirm">{{i18n.base.save}}</button>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'add', // 页面类型 默认为新增成员  type=add为新增  type=edit为编辑
				navtitle: '', // 页面标题
				
				membername: "", // 人员名称
				memberaccount: "", // 账号信息
				memberremark: "", // 人员备注
				memberuid: null, // 人员uid  编辑状态下有值
				iffreeze: false, // 人员是否被冻结  默认为否
				btnanimationname: null, // 按钮动画  默认为null
				
				
				
			};
		},
		
		onLoad(option) {
			
			let type = option.type
			if(!type) {
				uni.navigateBack();
			}
			this.type = type
			this.navtitle = this.type === 'add' ? this.i18n.nav.addmember : this.i18n.nav.editmember
			
			uni.setNavigationBarTitle({
				title: this.navtitle
			})
			
			if(this.type === 'edit') {
				// 获取编辑用户的信息
				let editmember = uni.getStorageSync('editmember')
				this.membername = editmember.realName
				this.memberaccount = editmember.account
				this.memberremark = editmember.remark
				this.iffreeze = editmember.freezeFlag === 1
				this.memberuid = editmember.uid
			}
			
		},
		
		destroyed() {
			uni.removeStorageSync('editmember')
		},
		
		methods: {
			
			// 冻结用户
			freezemember(e) {
				
				// 二次确认
				const _this = this
				let tempiffreeze = this.iffreeze // 设置临时变量
				// 先赋值 保持开关和数值同步
				this.iffreeze = e.detail.value
				
				let freezetype = tempiffreeze ? this.i18n.managepeople.handlemember.unfreeze : this.i18n.managepeople.handlemember.freeze
				uni.showModal({
					content: this.i18n.tip.freezeconfirm,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始冻结/解冻用户
							
							let data = {
								uid: _this.memberuid,
								flag: tempiffreeze ? 0 : 1
							}
							_this.$api.managepeopleapi.freezemember(data).then(response => {
								
								// 冻结/解冻成功
								uni.showToast({
									title: freezetype + _this.i18n.base.success,
									icon: 'none',
									duration:1500
								});
								_this.iffreeze = !tempiffreeze
								uni.$emit('updatemember')
								
							}).catch(error => {
								// 冻结/解冻失败
								uni.showToast({
									title: freezetype + _this.i18n.base.fail,
									icon: 'none',
									duration:1500
								});
								
								_this.iffreeze = tempiffreeze
							})
							
						}
						// 点击了取消 恢复原状
						else if(res.cancel) {
							_this.iffreeze = tempiffreeze
						}
					}
				});
				
			},
			
			// 重置用户密码
			resetmemberpwd() {
				const _this = this
				
				uni.showModal({
					title: this.i18n.tip.resetconfirm,
					content: this.i18n.managepeople.handlemember.resetmemberpwdtip,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始重置密码
							let data = {
								uid: _this.memberuid
							}
							_this.$api.managepeopleapi.resetmemberpwd(data).then(response => {
								// 重置用户密码成功
								uni.showToast({
									title: _this.i18n.tip.resetsuccess,
									icon: 'none',
									duration: 1500
								});
								
							}).catch(error => {
								// 重置用户密码失败
								uni.showToast({
									title: _this.i18n.error.reseterror,
									icon: 'none'
								});
							})
						}
					}
				});
			},
			
			// 删除用户
			deletemember() {
				const _this = this
				
				uni.showModal({
					content: this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除用户
							let data = {
								uid: _this.memberuid
							}
							_this.$api.managepeopleapi.deletemember(data).then(response => {
								// 删除用户成功
								uni.showToast({
									title: _this.i18n.tip.deletesuccess,
									icon: 'none',
									duration: 1500
								});
								uni.$emit('updatemember')
								
								setTimeout(function() {
									uni.navigateBack();
								}, 1500);
								
							}).catch(error => {
								// 删除用户失败
								uni.showToast({
									title: _this.i18n.error.deleteusererror,
									icon: 'none'
								});
							})
						}
					}
				});
			},
			
			// 确定
			confirm() {
				const _this = this
				
				// 数据校验
				if(!this.membername || this.membername === '') {
					this.btnanimationname = 'shake'
					setTimeout(function() {
						_this.btnanimationname = null
					}, 1000);
					return
				}
				
				let data = {
					realName: this.membername,
					remark: this.memberremark,
					uid: this.memberuid, // 修改的时候有uid
				}
				
				// 添加成员
				if(this.type === 'add') {
					this.$api.managepeopleapi.addmember(data).then(response => {
						// 添加成功  提示之后返回
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none',
							duration:1500
						});
						// 发送激活事件
						uni.$emit('updatemember')
						
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					}).catch(error => {
						// 创建失败
						uni.showToast({
							title: _this.i18n.error.adderror,
							icon: 'none'
						});
						_this.btnanimationname = 'shake'
						setTimeout(function() {
							_this.btnanimationname = null
						}, 1000);
					})
				}
				
				// 编辑成员资料
				else if(this.type === 'edit') {
					
					this.$api.userapi.modifyuserdetail(data).then(response => {
						// 添加成功  提示之后返回
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none',
							duration:1500
						});
						// 发送激活事件
						uni.$emit('updatemember')
						
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					}).catch(error => {
						// 创建失败
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
						_this.btnanimationname = 'shake'
						setTimeout(function() {
							_this.btnanimationname = null
						}, 1000);
					})
				}
				
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	.handlemember{
		.freezeitem{
			border-bottom: #EEEEEE 0.5upx solid;
			padding-top: 10upx;
			padding-bottom: 10upx;
		}
	}
</style>
