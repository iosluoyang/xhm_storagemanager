<template>
	<view class="handlememberview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{navtitle}}</block>
		</cu-custom>
		
		<!-- 添加的列表内容 -->
		<form>
			<!-- 客户名称 -->
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.me.customer.customername}}</view>
				<input type="text" v-model="customer" />
			</view>
			
			<!-- 客户ID 编辑状态下有 -->
			<view v-if="type === 'edit'" class="cu-form-group">
				<view class="title text-gray">{{i18n.me.customer.customerId}}</view>
				<input disabled :value="customerId" />
			</view>
			
			<!-- 客户公司名称 -->
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.me.customer.companyname}}</view>
				<input type="text" v-model="company" />
			</view>
			
			<!-- 联系方式 -->
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.me.customer.customerphone}}</view>
				<input type="number" v-model="phone" />
			</view>
			
			<!-- 客户备注 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					{{i18n.me.customer.customerremark}}
				</view>
			</view>
			
			<view class="cu-form-group">
				<textarea maxlength="-1" v-model="remark" :placeholder="i18n.me.customer.customerremarkplaceholder"></textarea>
			</view>
			
			<!-- 删除用户 -->
			<view v-if="type==='edit'" class="cu-form-group margin-top" @tap.stop="deletemember">
				<view class="title text-red">{{i18n.me.customer.deletecustomer}}</view>
			</view>
		</form>
		
		<!-- 确定按钮 -->
		<view class="btnview padding flex flex-direction">
			<button class="cu-btn bg-gradual-orange round shadow lg"
					:class="[btnanimationname ? 'animation-' + btnanimationname :'']"
					:data-class="btnanimationname ? btnanimationname : '' " @tap.stop="confirm">{{i18n.base.save}}</button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'add', // 页面类型 默认为新增  type=add为新增  type=edit为编辑
				navtitle: '', // 页面标题
				
				customerId: null,//	客户id
				company: '',//	公司名称
				customer: '',// 客户名称
				remark: '', //	备注
				phone:'', //	客户联系电话
				
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
				this.customerId = editmember.customerId
				this.company = editmember.company
				this.customer = editmember.customer
				this.remark = editmember.remark
				this.phone = editmember.phone
			}
			
		},
		
		destroyed() {
			uni.removeStorageSync('editmember')
		},
		
		methods: {
			
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
								customerId: _this.customerId
							}
							_this.$api.customerapi.deletecustomer(data).then(response => {
								// 删除用户成功
								uni.showToast({
									title: _this.i18n.tip.deletesuccess,
									icon: 'none',
									duration: 1500
								});
								uni.$emit('updatecustomer')
								
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
				
				if(!this.customer || this.customer === '') {
					this.btnanimationname = 'shake'
					setTimeout(function() {
						_this.btnanimationname = null
					}, 1000);
					return
				}
				
				let data = {
					company: this.company,
					customer: this.customer,
					remark: this.remark,
					phone: this.phone,
					img: '',
					customerId: this.customerId, // 修改的时候有customerId
				}
				
				// 添加成员
				if(this.type === 'add') {
					this.$api.customerapi.addcustomer(data).then(response => {
						// 添加成功  提示之后返回
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none',
							duration:1500
						});
						// 发送激活事件
						uni.$emit('updatecustomer')
						
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
					
					this.$api.customerapi.editcustomer(data).then(response => {
						// 添加成功  提示之后返回
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none',
							duration:1500
						});
						// 发送激活事件
						uni.$emit('updatecustomer')
						
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

</style>
