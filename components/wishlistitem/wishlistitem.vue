<!-- 心愿单列表单个组件 -->
<template>
	
	<!-- 每一个心愿单卡片的内容 -->
	<view v-if="ownwishitem" class="contentview cu-card case">
		
		<view class="cu-item shadow" @tap.stop="clickwishitem" @longpress.stop="changewishliststatus">
			
			<!-- 卡片上方-图片区域 -->
			<view class="image">
				
				<!-- grid-square  等宽等高时使用 -->
				<view class="imgsview grid" :class="[ `col-${ownwishitem.productList.length}` ]">
					<block v-for="(product, index) in ownwishitem.productList" :key="index">
						
						<!-- 正常图片 -->
						<template>
							<!-- 一张图片 -->
							<template v-if="ownwishitem.productList.length == 1">
								<u-image 
									width="" height="160px" 
									mode="aspectFill" shape="square"
									lazy-load fade
									:src="product.imgs.split(',')[0]"
								></u-image>
							</template>
							
							<!-- 超过一张图片 -->
							<template v-if="ownwishitem.productList.length > 1">
								<u-image 
									width="" height="100px" 
									mode="aspectFit" shape="square"
									lazy-load fade
									:src="product.imgs.split(',')[0]"
								></u-image>
							</template>
							
						</template>
						
						<!-- 等宽等高图片 -->
						<!-- <template>
							<view class="bg-img" :style="[{ backgroundImage:'url(' + product.imgs.split(',')[0] + ')'}]"></view>
						</template>
						 -->
					</block>
				</view>
				
				<!-- 卖家信息 代理显示店铺名称 user.role == 'PRODUCT_AGENT' &&  -->
				<view v-if=" ownwishitem.productList[0].sellerInfo" class="sellerInfoView pos-absolute flex align-center padding-sm radius bg-gradual-blue" :style="{left: 0, top: 0, maxWidth: '400rpx', maxHeight: '100rpx'}">
					<text class="cuIcon cuIcon-shopfill text-white"></text>
					<text class="text-sm u-line-1 margin-left-sm">{{ ownwishitem.productList[0].sellerInfo.shopName }}</text>
				</view>
				
				<view class="cu-tag text-white radius" :class="wishbgcolor">{{ wishtagtext }}</view>
				
				<view class="cu-bar bg-shadeBottom flex-direction align-start">
					
					<!-- 心愿标题 -->
					<view class="text-bold margin-top-sm u-line-2 width100" :class="[ ownwishitem.productList.length == 1 ? 'text-xl' : 'text-df' ]">
						<text v-for="(eachproduct, index) in ownwishitem.productList" :key="index"
								class="margin-right-sm"
						>
							{{ eachproduct.aliasName || eachproduct.title }}
							
							<text v-if="index != ownwishitem.productList.length - 1" class="cuIcon cuIcon-titles margin-left-sm margin-right-sm"></text>
						</text>
					</view>
					
				</view>
			
			</view>
			
			<!-- 卡片下方-内容区域 -->
			<view v-if="ownwishitem.creatUser" class="cu-list menu-avatar">
				<view class="cu-item">
					
					<!-- 头像 -->
					<u-avatar class="cu-avatar" :src="ownwishitem.creatUser.avatar" size="default"></u-avatar>
					
					<!-- 内容 -->
					<view class="content">
						
						<!-- 上方发布人昵称 -->
						<view class="text-black">{{ ownwishitem.creatUser.nickname || 'Default User'}}</view>
						
						<!-- 发布时间 -->
						<view class="text-gray text-sm">
							<uni-dateformat :date="ownwishitem.creatTime" />
						</view>
						
					</view>
					
					<!-- 操作 -->
					<view class="action">
						<template>
							
							<!-- 付款按钮  商家角色且为待付款 -->
							<view v-if="ownwishitem.achieveFlag == 2 && ownwishitem.wishOrderInfo.status == 0" class="payview flex align-center">
								
								<!-- 商家自身 -->
								<template v-if="user && user._id == ownwishitem.creatUser._id">
									<button class="cu-btn round bg-gradual-red u-font-20" @tap.stop="paynow">
										<view class="flex flex-direction align-center">
											<text class="u-font-20">{{ i18n.base.paynow }}</text>
											<u-count-down v-if="paymenttimediff" class="u-margin-top-5" :timestamp="paymenttimediff" autoplay font-size="10" :show-days="false"></u-count-down>
										</view>
									</button>
								</template>
								
								<!-- 代理员自身 -->
								<template v-if="user && user._id == ownwishitem.agentUser._id">
									<!-- <text class="cuIcon cuIcon-pay text-red u-font-40"></text> -->
									<text class="u-font-20 bg-gradual-red cu-btn round">{{ i18n.base.paynow }}</text>
								</template>
								
							</view>
							
							<!-- 代理心愿按钮  代理人角色且心愿未被代理 -->
							<button v-if=" ownwishitem.status == 0 && user && user.role == 'PRODUCT_AGENT'" 
									class="cu-btn round bg-blue animation-reverse"
									:class="[bindAnimation ? 'animation-scale-down' : '']"
									@tap.stop="agentBindWish">
								<text class="cuIcon cuIcon-servicefill"></text>
							</button>
							
							<!-- 跳转订单按钮 -->
							<button v-if="user && ownwishitem.wishOrderInfo" class="cu-btn margin-left-sm round bg-purple cuIcon cuIcon-formfill" @tap.stop="jumpToOrderDetail"></button>
							
						</template>
					</view>
					
					
				</view>
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
				
				// 心愿单类型 normaltype  为正常类型  samestoretype为同商店类型
				type: {
					type: String,
					default: 'normal'
				},

			},
			
			data() {
				return {
					
					bindAnimation: false, // 是否显示绑定动画  默认为否
					ownwishitem: this.wishitem,
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
				let productList = this.ownwishitem.productList
				// productList = productList.concat(productList)
				// productList = [productList[0], productList[0], productList[0]]
				this.ownwishitem.productList = productList
			},
			
			mounted() {
				// 挂载之后如果为待付款状态则开始计算倒计时
				if(this.ownwishitem.achieveFlag == 2 && this.ownwishitem.wishOrderInfo && this.ownwishitem.wishOrderInfo.status == 0) {
					this.gettimecountstamp()
				}
			},
			
			methods: {
	
				// 点击心愿列表
				clickwishitem() {
					uni.navigateTo({
						url: `/pages/wishlist/wishdetail?id=${this.ownwishitem._id}`
					});
				},
				
				// 计算付款倒计时时长
				gettimecountstamp() {
					
					let nowtimestamp = new Date().getTime()
					let ordercreattimestamp = this.ownwishitem.wishOrderInfo.creatTime
					let wishorderpaymenttimestamp = this.$store.getters.configData.wishorderPaymentTime || 1000 * 60 * 60 * 24
					let timediff = (ordercreattimestamp + wishorderpaymenttimestamp - nowtimestamp)  / 1000
					this.paymenttimediff = timediff
					
					if(this.paymenttimediff <= 0) {
						this.paymenttimediff = 0
					}
					
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
				
				// 再次购买
				buyagain() {
					
					let copyId = this.ownwishitem._id
					uni.navigateTo({
						url: `/pages/wishlist/handlewish?type=copy&id=${copyId}`
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
								_this.agentOptionBindWish()
							}
						}
					});

				},
				
				// 代理进行关联接口调用
				agentOptionBindWish() {
					const _this = this
					// 开始代理商品
					_this.bindAnimation = true
					const db = uniCloud.database();
					let wishinfo = _this.ownwishitem
					
					uni.showLoading()
					db.collection('wish').doc(wishinfo._id)
					.update({agentUid:db.env.uid, status: 1, optionTime: db.env.now})
					.then(response => {
						console.log(response);
						uni.hideLoading()
						// 代理成功
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none'
						});
						_this.bindAnimation = true // 显示动画
						
						// 更新当前数据
						uni.$emit('updatewishlist')
						
						// 添加一个代理人关联心愿时间轴记录
						db.collection('wishlisttimeline')
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
				
				// 长按更改心愿单状态
				changewishliststatus() {
					const _this = this

					// 只有超级管理员有变更心愿状态的功能
					// if(_this.user.role !== 'ADMIN') {
					// 	return
					// }
					
				   // 心愿单完成标识 0心愿进行中 1心愿待确认 2心愿已确认代理待下单 3代理已下单客户待收货 4客户已收货心愿已完成 99心愿已关闭
				   let optionList = [
						{
							name: this.i18n.wishlist.common.achieveflagdata.ing,
							type: 'changetag',
							achieveFlag: 0
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.waittoconfirm,
							type: 'changetag',
							achieveFlag: 1
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.makeorder,
							type: 'changetag',
							achieveFlag: 2
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.waitreceive,
							type: 'changetag',
							achieveFlag: 3
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.finish,
							type: 'changetag',
							achieveFlag: 4
						},
						{
							name: this.i18n.wishlist.common.achieveflagdata.closed,
							type: 'changetag',
							achieveFlag: 99
						}
					]
					
					let itemList = []
					let finalOptionList= []
					
					optionList.forEach((eachitem,index) => {
						if(eachitem.achieveFlag !== _this.ownwishitem.achieveFlag) {
							itemList.push(eachitem.name)
							finalOptionList.push(eachitem)
						}
					})
					
					uni.showActionSheet({
						itemList: itemList,
						itemColor: '#000000',
						success(res) {
							let tapindex = res.tapIndex
							let tapItem = finalOptionList[tapindex]
							let achieveFlag = tapItem.achieveFlag
							
							// 设置该心愿单的状态为切换状态
							
							const db = uniCloud.database();
							db.collection('wishlist')
							.doc(_this.ownwishitem._id)
							.update({achieveFlag})
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
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
	
	
</style>
