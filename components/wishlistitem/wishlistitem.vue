<!-- 心愿单列表单个组件 -->
<template>
	
	<!-- 每一个心愿单卡片的内容 -->
	<view v-if="ownwishitem" class="contentview cu-card case">
		
		<view class="cu-item shadow-warp" @tap.stop="clickwishitem">
			
			<!-- 卡片上方-图片区域 -->
			<view class="image">
				
				<!-- grid-square  等宽等高时使用 -->
				<!-- class="imgsview grid" :class="[ `col-${ownwishitem.productList.length}` ]" -->
				<view class="imgsview flex align-center flex-wrap justify-around">
					<block v-for="(product, index) in ownwishitem.productList" :key="index">
						
						<!-- 正常图片 -->
						<template>
							<!-- 一张图片 -->
							<template v-if="ownwishitem.productList.length == 1">
								<!-- <u-image 
									width="100%" height="160px" 
									mode="aspectFill" shape="square"
									lazy-load fade
									:src="getProMainImg(product)"
								></u-image> -->
								<image :src="getProMainImg(product)" mode="aspectFit" :style="{width: '100%', height: '160px'}"></image>
							</template>
							
							<!-- 超过一张图片 -->
							<template v-if="ownwishitem.productList.length > 1">
								<!-- <u-image 
									width="" height="100px" 
									mode="aspectFit" shape="square"
									lazy-load fade
									:src="getProMainImg(product)"
								></u-image> -->
								<image :src="getProMainImg(product)" mode="aspectFit" :style="{width: '100px', height: '100px'}"></image>
							</template>
							
						</template>
						
						<!-- 等宽等高图片 -->
						<!-- <template>
							<view class="bg-img" :style="[{ backgroundImage:'url(' + product.imgs.split(',')[0] + ')'}]"></view>
						</template>
						 -->
					</block>
				</view>
				
				<view class="cu-tag text-white radius" :class="wishbgcolor">{{ wishtagtext }}</view>
				
				<view class="cu-bar bg-shadeBottom">
					
					<!-- 心愿标题 -->
					<view class="text-bold u-line-2 width100" :class="[ ownwishitem.productList.length == 1 ? 'text-xl' : 'text-df' ]">
						<text v-for="(eachproduct, index) in ownwishitem.productList" :key="index"
								class="margin-right-sm"
						>
							{{ eachproduct.aliasName || eachproduct.title }}
							<text v-if="index != ownwishitem.productList.length - 1" class="cuIcon cuIcon-titles margin-left-sm margin-right-sm"></text>
						</text>
					</view>
					
				</view>
			
			</view>
			
			<!-- 信息区域 -->
			<view class="contentview flex flex-direction padding-sm">
				
				<!-- 商店和商品信息 -->
				<view class="flex align-center justify-between">
					<view v-if="ownwishitem.sellerInfo" class="flex1 flex align-center">
						<text class="cuIcon cuIcon-shopfill text-blue margin-right-sm"></text>
						<text class="text-df"> {{ `${ownwishitem.sellerInfo.shopName}` }} </text>
					</view>
					
					<view class="margin-left flex0 flex align-center">
						<text class="cuIcon cuIcon-goodsfill text-orange margin-right-sm"></text>
						<text class="text-grey">{{ `共${ownwishitem.productList.length}种商品` }}</text>
					</view>
				</view>
				
				<!-- 发布人信息 -->
				<view class="flex align-center justify-between margin-top-sm">
					
					<!-- 发布人信息 -->
					<view class="flex align-center flex0">
						<u-avatar :src="ownwishitem.creatUser.avatar" size="mini"></u-avatar>
						<view class="flex flex-direction margin-left-sm">
							<text class="text-df text-black">{{ ownwishitem.creatUser.nickname }}</text>
							<text class="text-sm text-grey"><uni-dateformat :date="ownwishitem.creatTime" /></text>
						</view>
					</view>
					
					<!-- 代理人信息 -->
					<view class="flex justify-end flex1">
						
						<!-- 有代理人时 -->
						<template v-if="ownwishitem.agentUser">
							<u-avatar :src="ownwishitem.agentUser.avatar" size="mini" show-level level-icon="kefu-ermai" level-bg-color="#0081ff"></u-avatar>
						</template>
						
						<!-- 没有代理人时显示代理按钮 -->
						<template v-else>
							<!-- 代理心愿按钮  代理人角色且心愿未被代理 -->
							<button v-if=" ownwishitem.status == 0 && user && user.role == $basejs.roleEnum.productAgent" 
									class="cu-btn round bg-blue animation-reverse"
									:class="[bindAnimation ? 'animation-scale-down' : '']"
									@tap.stop="agentBindWish">
								<text class="cuIcon cuIcon-servicefill"></text>
							</button>
						</template>
						
					</view>
					
				</view>
				
			</view>
			
			<!-- 操作区域 当心愿状态为3已完成时或者为管理员角色时显示 -->
			<view v-if="(ownwishitem.status == 3) || (user && user.role == $basejs.roleEnum.admin)" class="actionview shadow-warp padding-sm flex align-center">
				
				<!-- 跳转订单按钮  当心愿变成已支付已完成且为自己或代理员代理的心愿时有此按钮 -->
				<button v-if="user && (user._id == ownwishitem.creatUser._id || user._id == ownwishitem.agentUser._id) && ownwishitem.status == 3" class="cu-btn margin-left-sm round bg-purple cuIcon cuIcon-formfill" @tap.stop="jumpToOrderDetail"></button>
				
				<!-- 切换心愿状态 超级管理员有此功能 -->
				<button v-if="user && user.role == $basejs.roleEnum.admin " class="cu-btn margin-left-sm round bg-grey cuIcon cuIcon-order" @tap.stop="changewishliststatus"></button>
				
			</view>
			
		</view>
		
	</view>
	
</template>

<script>
	export default {
		
			name:'wishlistitem',
			
			components:{
				
			},
			
			props: {
				
				// 心愿单列表数据
				wishitem: {
					default: null,
				},
				
			},
			
			data() {
				return {
					
					bindAnimation: false, // 是否显示绑定动画  默认为否
					ownwishitem: null, // 自身心愿数据
					paymenttimediff: 0, // 待付款订单倒计时
					
				}
			},
			
			watch: {
				
				// 监听外部wishitem的变更 深度变更
				wishitem: {
					handler(newValue, oldValue) {
						this.ownwishitem = newValue
					},
					deep: true
				}
			},
			
			computed: {
				
				// 心愿单的背景颜色  根据不同的状态返回不同的颜色
				wishbgcolor() {
					if(this.ownwishitem) {
						
						let status = this.ownwishitem.status
						let bgColor = this.$basejs.getwishtagbgcolorclassname(status)
						return bgColor
					}
					else {
						return ''
					}
				},
				
				// 心愿单的tag名称
				wishtagtext() {
					
					if(this.ownwishitem) {
						let status = this.ownwishitem.status
						let tagName = this.$basejs.getwishtagname(status)
						return tagName
					}
					else {
						return ''
					}
					
				},
				
			},
			
			created() {
				this.ownwishitem = this.wishitem
			},
			
			methods: {
	
				// 点击跳转心愿详情
				clickwishitem() {
					uni.navigateTo({
						url: `/pages/wishlist/wishdetail?id=${this.ownwishitem._id}`
					});
				},
				
				// 付款操作
				paynow() {
					let orderId = this.ownwishitem.wishOrderInfo._id
					uni.navigateTo({
						url: `/pages/wishlist/payment?orderType=wishorder&orderId=${orderId}`
					});
				},
				
				// 跳转订单详情
				jumpToOrderDetail() {
					
					let wishOrderId = this.ownwishitem.wishOrderInfo._id
					uni.navigateTo({
						url: `/pages/wishlist/wishorder?wishOrderId=${wishOrderId}`
					});
					
				},
				
				// 代理员关联心愿
				agentBindWish() {
					const _this = this
					uni.showModal({
						content: _this.i18n.tip.optionconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								_this.agentOperateBindWish()
							}
						}
					});

				},
				
				// 代理进行关联接口调用
				agentOperateBindWish() {
					const _this = this
					// 开始代理商品
					_this.bindAnimation = true
					const db = uniCloud.database();
					let wishinfo = _this.ownwishitem
					
					uni.showLoading()
					db.collection('wish')
					.doc(wishinfo._id)
					.update({agentUid:db.env.uid, status: 1, updateTime: db.env.now})
					.then(response => {
						console.log(response);
						uni.hideLoading()
						// 代理成功
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none'
						});
						_this.bindAnimation = true // 显示动画
						
						// 手动更新心愿信息
						_this.$set(_this.ownwishitem, 'status', 1)
						let agentUser = _this.user
						_this.$set(_this.ownwishitem, 'agentUser', agentUser)
						
						// 更新当前数据
						// uni.$emit('updatewishlist')
						
						// 添加一个代理人关联心愿时间轴记录
						db.collection('wish-timeline')
						.add({type: 90,wishId: wishinfo._id})
						.then(response => {
							// 创建时间轴成功
							// 手动更改数据
							_this.ownwishitem.status = 1
							
						})
						.catch(error => {
							uni.showToast({
								title: error.message,
								icon: 'none'
							});
							setTimeout(function() {
								_this.bindAnimation = false
							}, 1000);
						})
						
						// 发送代理员关联消息通知
						_this.pushnoticemsg('agentbindwish')
						
					})
					.catch(error => {
						uni.hideLoading()
						// 关联失败
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
						setTimeout(function() {
							_this.bindAnimation = false
						}, 1000);
					})
				},
				
				// 推送消息
				pushnoticemsg(msgtype) {
					const _this = this
					let info
					// 根据不同的消息类型准备不同的数据内容
					if(msgtype == 'agentbindwish') {
						info = {
							msgtype: msgtype,
							wishId: _this.ownwishitem._id
						}
					}
					
					uniCloud.callFunction({
						name: 'base',
						data: {
							type: 'sendwxmsg',
							info: info
						}
					}).then(response => {
						// 发送微信消息成功
						if(response.result.errCode == 0) {
							console.log(`发送微信订阅消息成功`);
						}
						else {
							console.log(`发送微信订阅消息失败,原因是:${response.result.message}`);
						}
						
					}).catch(error => {
						console.log(error.message);
					})
					
				},
				
				// 管理员更改心愿单状态
				changewishliststatus() {
					
					const _this = this
					
					// 心愿单完成标识 0 未代理  1已代理待报价  2 已报价待确认  3 已确认已完成  90 已关闭
					let optionList = [
						{
							name: this.i18n.wishlist.common.achieveflagdata.ing,
							status: 1
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.waittoconfirm,
							status: 2
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.finish,
							status: 3
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.closed,
							status: 90
						}
					]
					
					let finalOptionList= optionList.filter(item => (item.status != _this.ownwishitem.status))
					let finalNameList = finalOptionList.map(item => (item.name))
					
					uni.showActionSheet({
						itemList: finalNameList,
						itemColor: '#000000',
						success(res) {
							let tapindex = res.tapIndex
							let tapItem = finalOptionList[tapindex]
							let status = tapItem.status
							
							// 设置该心愿单的状态为切换状态
							
							const db = uniCloud.database();
							db.collection('wish')
							.doc(_this.ownwishitem._id)
							.update({status})
							.then(res => {
								console.log(`更新状态成功`);
								// 将心愿单列表数据置空(消失) 然后发送响应事件
								_this.ownwishitem = null
								uni.$emit('updatebadgenum')
							})
							.catch(err => {
								console.log(`更新状态失败`);
								// 切换失败
								uni.showToast({
									title: _this.i18n.error.loaderror,
									icon: 'none'
								});
							})
							
						}
					})
				   
				},
				
				// 获取商品主图
				getProMainImg(product) {
					let mainImg = product.imgs && product.imgs.length > 0 ? product.imgs.split(',')[0] : _this.defaultImgUrl
					return mainImg
				},
				
				//
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
	
	
</style>
