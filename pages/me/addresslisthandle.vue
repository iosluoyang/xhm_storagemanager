<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">{{i18n.nav.addressmanage}}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<u-form class="padding margin" :model="form" ref="uForm" label-width="auto" :label-style="{fontWeight: 'bold'}">
			
			<u-form-item :label="i18n.me.address.name" prop="name">
				<u-input v-model="form.name" placeholder="" />
			</u-form-item>
			
			<u-form-item :label="i18n.me.address.mobile" prop="mobile">
				<u-input v-model="form.mobile" placeholder="" type="number" />
			</u-form-item>
			
			<u-form-item :label="i18n.me.address.address" prop="address">
				<u-input v-model="form.address" placeholder="" type="textarea" />
			</u-form-item>
			
			<u-form-item :label="i18n.me.address.shippingcode" prop="shippingCode">
				<u-input v-model="form.shippingCode" placeholder="" />
			</u-form-item>
			
			<u-form-item :label="i18n.me.address.alias" prop="alias">
				<u-input v-model="form.alias" placeholder="" />
			</u-form-item>
			
			<u-form-item :label="i18n.me.address.setdefault">
				<u-switch slot="right" v-model="form.ifDefault"></u-switch>
			</u-form-item>
			
			<u-form-item v-if="type == 'edit'">
				<view class="deleteview textdf text-red" @tap.stop="deleteAddress">
					<text class="cuIcon-deletefill textred">{{ i18n.base.delete }}</text>
				</view>
			</u-form-item>
			
		</u-form>
		
		<button class="confirmbtn cu-btn bg-blue" @tap.stop="submitData">{{ i18n.base.confirm }}</button>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				
				type: 'add', // add 新增  edit编辑
				id: null, // 地址id  编辑时使用
				
				form: {
					name: '',
					mobile: '',
					address: '',
					shippingCode: '',
					alias: '',
					ifDefault: false
				},
			}
		},
		
		// 页面加载后
		onLoad(option) {
			_this = this
			
			let type = option.type
			if(type) {
				this.type = type
				if(this.type == 'edit') {
					let addressId = option.id
					this.id = addressId
					this.loadAddressData()
				}
			}
			//
		},
		
		methods: {
			
			// 加载地址数据
			loadAddressData() {
				const db = uniCloud.database();
				db.collection('address')
				.doc(this.id)
				.field('name, mobile, address, shippingCode, alias, ifDefault')
				.get({getOne: true})
				.then(response => {
					if(response.result.code == 0) {
						
						let formData = response.result.data
						delete formData._id
						this.form = formData
					}
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
			},
			
			// 删除地址
			deleteAddress() {
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							const db = uniCloud.database();
							db.collection('address')
							.doc(_this.id)
							.remove()
							.then(response => {
								if(response.result.code == 0) {
									uni.showToast({
										title: _this.i18n.tip.optionsuccess,
										icon: 'none'
									});
									setTimeout(function() {
										// 更新地址列表  返回
										uni.$emit('updateaddresslist')
										uni.navigateBack();
									}, 1000);
								}
								else {
									uni.showToast({
										title: _this.i18n.error.optionerror,
										icon: 'none'
									});
								}
							})
							.catch(error => {
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
							})
							
						}
					}
				});
				
			},
			
			// 提交数据
			submitData() {
				const db = uniCloud.database();
				let newdata = this.form

				// 新增
				if(this.type == 'add') {
					uni.showLoading()
					
					db.collection('address')
					.add(newdata)
					.then(response => {
						
						uni.hideLoading()
						
						if(response.result.code == 0) {
							
							// 判断当前地址是否设置为默认地址 如果是则将该用户其他地址设置为非默认地址
							if(newdata.ifDefault) {
								uni.showLoading()
								db.collection('address')
								.where(` creatUid == $cloudEnv_uid && _id != '${response.result.id}' `)
								.update({ifDefault: false})
								.then(response => {
									console.log(`更改其他地址默认状态成功`);
								})
								.catch(error => {
									console.log(`更改其他地址默认状态失败`);
								})
								.finally(() => {
									uni.hideLoading()
									setTimeout(function() {
										// 更新地址列表  返回
										uni.$emit('updateaddresslist')
										uni.navigateBack();
										
										uni.showToast({
											title: _this.i18n.tip.addsuccess,
											icon: 'none'
										});
										
									}, 1000);
								})
							}
							else {
								// 更新地址列表  返回
								uni.$emit('updateaddresslist')
								uni.navigateBack();
								
								uni.showToast({
									title: _this.i18n.tip.addsuccess,
									icon: 'none'
								});
							}
							
						}
						else {
							uni.showToast({
								title: _this.i18n.error.optionerror,
								icon: 'none'
							});
						}
					})
					.catch(error => {
						uni.hideLoading()
						uni.showToast({
							title: _this.i18n.error.optionerror,
							icon: 'none'
						});
					})
				}
				
				// 编辑
				else if(this.type == 'edit') {
					
					// 更新时间
					newdata['updateTime'] = db.env.now
					
					uni.showLoading()
					db.collection('address')
					.doc(_this.id)
					.update(newdata)
					.then(response => {
						uni.hideLoading()
						if(response.result.code == 0) {
							
							// 判断当前地址是否设置为默认地址 如果是则将该用户其他地址设置为非默认地址
							if(newdata.ifDefault) {
								
								uni.showLoading()
								db.collection('address')
								.where(` creatUid == $cloudEnv_uid && _id != '${_this.id}' `)
								.update({ifDefault: false})
								.then(response => {
									console.log(`更改其他地址默认状态成功`);
								})
								.catch(error => {
									console.log(`更改其他地址默认状态失败`);
								})
								.finally(() => {
									uni.hideLoading()
									// 更新地址列表  返回
									uni.$emit('updateaddresslist')
									uni.navigateBack();
									
									uni.showToast({
										title: _this.i18n.tip.optionsuccess,
										icon: 'none'
									});
								})
							}
							else {
								// 更新地址列表  返回
								uni.$emit('updateaddresslist')
								uni.navigateBack();
								
								uni.showToast({
									title: _this.i18n.tip.optionsuccess,
									icon: 'none'
								});
							}
							
						}
						else {
							uni.showToast({
								title: _this.i18n.error.optionerror,
								icon: 'none'
							});
						}
					})
					.catch(error => {
						uni.hideLoading()
						uni.showToast({
							title: _this.i18n.error.optionerror,
							icon: 'none'
						});
					})
				}
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	$confirmbtnheight: 50px;
	
	.pagecontent {
		padding-bottom: $confirmbtnheight;
		.confirmbtn{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: $confirmbtnheight !important;
			line-height: $confirmbtnheight !important;
		}
	}
	
</style>
