<template>
	<view class="handlememberview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-purple" isBack>
			<block slot="content">{{navtitle}}</block>
		</cu-custom>
		
		<!-- 添加的列表内容 -->
		<form>
			
			<!-- 个人头像 -->
			<view class="cu-form-group padding" @tap.stop="chooseimg">
				<view class="title">{{i18n.me.customer.customerimg}}</view>
				<template>
					<view v-if="avatarfile || customeravatarimg" class="cu-avatar round lg" :style="{backgroundImage: 'url('+(avatarfile ? avatarfile.path : (imgUrl + customeravatarimg))+')'}"></view>
					<view v-else class="cu-avatar round lg">
						<text class="cuIcon-people"></text>
					</view>
				</template>
			</view>
			
			<!-- 客户名称 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.customer.customername}}</view>
				<input type="text" v-model="customer" />
			</view>
			
			<!-- 客户ID 编辑状态下有 -->
			<view v-if="type === 'edit'" class="cu-form-group">
				<view class="title text-gray">{{i18n.me.customer.customerId}}</view>
				<input disabled :value="customerId" />
			</view>
			
			<!-- 客户公司名称 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.customer.companyname}}</view>
				<input type="text" v-model="company" />
			</view>
			
			<!-- 联系方式 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.me.customer.customerphone}}</view>
				<input type="number" maxlength="20" v-model="phone" />
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
				type: 'add', // 页面类型 默认为新增  type=add为新增  type=edit为编辑
				navtitle: '', // 页面标题
				
				customerId: null,//	客户id
				avatarfile: null, // 客户头像文件
				customeravatarimg: null, // 客户头像地址
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
			this.navtitle = this.type === 'add' ? this.i18n.nav.addcustomer : this.i18n.nav.editcustomer
			
			uni.setNavigationBarTitle({
				title: this.navtitle
			})
			
			if(this.type === 'edit') {
				// 获取编辑用户的信息
				this.customerId = option.customerId
				// 获取详情
				this.getcustomerdetail()
			}
			
		},
		
		methods: {
			
			// 获取客户详情
			getcustomerdetail() {
				const _this = this
				
				this.$api.customerapi.customerdetail({customerId: this.customerId}).then(response => {
					// 加载成功
					let customerinfo = response.data.customerInfo
					
					_this.customerId = customerinfo.customerId	//客户id
					_this.customeravatarimg = customerinfo.img	//客户id
					_this.company = customerinfo.company	//公司名称
					_this.customer = customerinfo.customer	//客户名称
					_this.remark = customerinfo.remark	//备注
					_this.phone = customerinfo.phone	//客户联系电话
					
				}).catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
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
			
			// 显示错误时按钮的摇动动画
			showbtnerranimation() {
				
				const _this = this
				_this.btnanimationname = 'shake'
				setTimeout(function() {
					_this.btnanimationname = null
				}, 1000);
				
			},
			
			// 确定
			confirm() {
				
				// 数据校验
				// 客户名称
				if(!this.customer || this.customer === '') {
					this.showbtnerranimation()
					return
				}
				
				// 如果有客户头像本地文件的话则上传头像
				if(this.avatarfile) {
					this.$basejs.uploadmultipleimgs([this.avatarfile]).then(imgUrls => {
						// 上传图片成功
						let customeravatarimg = imgUrls[0]
						this.customeravatarimg = customeravatarimg
						// 开始上送数据
						this.finalsubmit()
					})
				}
				// 没有本地头像文件则直接进行上送
				else {
					this.finalsubmit()
				}

			},
			
			// 开始上送数据
			finalsubmit() {
				
				const _this = this
				let data = {
					company: this.company,
					customer: this.customer,
					remark: this.remark,
					phone: this.phone,
					img: this.customeravatarimg,
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
				
				
			},
			
		},
		
	}
</script>

<style lang="scss" scoped>
	.handlememberview{
		/deep/.cu-form-group .uni-input-wrapper{
			text-align: right;
		}
	}
</style>
