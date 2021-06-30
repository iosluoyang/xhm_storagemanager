<!-- 心愿单列表单个组件 -->
<template>
	
	<!-- 每一个心愿单卡片的内容 -->
	<view v-if="ownwishitem" class="contentview cu-card case">
		
		<view class="cu-item shadow" @tap.stop="gotowishdetail" @longpress.stop="changewishliststatus">
			
			<!-- 卡片上方-图片区域 -->
			<view class="image">
				
				<image :src="ownwishitem.imgs.split(',')[0]" mode="aspectFill" style="height: 300rpx;"></image>
				<view class="cu-tag text-white" :class="wishbgcolor">{{ wishtagtext }}</view>
				<view class="cu-bar bg-shadeBottom flex-direction align-start">
					
					<!-- 商品标题 -->
					<view class="text-bold text-xl margin-top-sm text-cut width100">{{ownwishitem.productTitle}}</view>
					
					<!-- 商品价格和数量 -->
					<view class="flex align-center justify-between width100">
						
						<view class="flex-sub priceview margin-top-sm">
							<text class="text-red text-xl margin-right">{{ `${ownwishitem.targetMoneyType === 'RMB' ? '¥' : ownwishitem.targetMoneyType === 'THB' ? '฿' : ''}${ownwishitem.sourcePrice}` }}</text>
							<!-- <text class="text-gray text-df" style="text-decoration: line-through;">{{ `${ownwishitem.sourceMoneyType === 'RMB' ? '¥' : ownwishitem.sourceMoneyType === 'THB' ? '฿' : ''}${ownwishitem.sourcePrice}` }}</text> -->
						</view>
						
						<view class="cu-tag radius bg-cyan pos-static">
							{{ ownwishitem.targetAmount }}
						</view>
						
					</view>
					
				</view>
			
			</view>
			
			<!-- 卡片下方-内容区域 -->
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					
					<!-- 头像 -->
					<template>
						<image v-if="ownwishitem.creatUser && ownwishitem.creatUser.avatar" class="cu-avatar round lg" :src="ownwishitem.creatUser.avatar"></image>
						<view v-else class="cu-avatar round lg">
							<text class="cuIcon-people"></text>
						</view>
					</template>
					
					<!-- 内容 -->
					<view class="content flex-sub">
						
						<!-- 上方发布人昵称 -->
						<view class="text-grey">{{ownwishitem.creatUser && ownwishitem.creatUser.nickname ? ownwishitem.creatUser.nickname : 'XXX'}}</view>
						
						<!-- 内容区域 -->
						<view class="flex justify-between align-center">
							
							<!-- 发布时间 -->
							<view class="text-gray text-sm">
								<uni-dateformat :date="ownwishitem.creatTime" />
							</view>
							
							<!-- 右侧区域 -->
							<view class="text-gray text-sm flex align-center">
								
								<!-- 紧急程度 -->
								<!-- <text class="hurryleveltext margin-right-sm">
									<text v-for="item in ownwishitem.hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
								</text> -->
								
								<!-- 点赞浏览 -->
								<!-- <text class="cuIcon-attentionfill margin-lr-xs"></text>{{ownwishitem.previewCount || 0}}
								<text class="cuIcon-messagefill margin-lr-xs"></text> {{ownwishitem.commentCount || 0}} -->
								<!-- <button class="cu-btn margin-lr-xs round bg-gradual-green" @tap.stop='buyagain'>{{ i18n.wishlist.buyagain }}</button> -->
								
								<!-- 再次购买或者代理心愿按钮 -->
								<template>
									
									<!-- 再次购买按钮 商家角色-->
									<button v-if="user && (user.role.includes('MERCHANT_ADMIN') || user.role.includes('MERCHANT_EMPLOYEE'))" class="cu-btn round bg-pink light" @tap.stop="buyagain">{{ i18n.wishlist.buyagain }}</button>
									
									<!-- 代理心愿按钮  代理人角色且心愿未被代理 -->
									<button v-if="user && user.role.includes('PRODUCT_AGENT') && ownwishitem.agentFlag == 0" 
											class="cu-btn round bg-gradual-blue animation-reverse"
											:class="[bindAnimation ? 'animation-scale-down' : '']"
											@tap.stop="agentBindWish">
										<text class="cuIcon cuIcon-flashbuyfill lg"></text>
										{{ i18n.wishlist.agentbindwish }}
									</button>
								
								</template>
								
							
							</view>
						
						</view>
						
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

			},
			
			data() {
				return {
					
					bindAnimation: false, // 是否显示绑定动画  默认为否
					ownwishitem: this.wishitem,
					
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
						
						let achieveFlag = this.ownwishitem.achieveFlag
						let bgColor = this.$basejs.getwishtagbgcolorclassname(achieveFlag)
						return bgColor
					}
					else {
						return ''
					}
				},
				
				// 心愿单的tag名称
				wishtagtext() {
					
					if(this.ownwishitem) {
						let achieveFlag = this.ownwishitem.achieveFlag
						let tagName = this.$basejs.getwishtagname(achieveFlag)
						return tagName
					}
					else {
						return ''
					}
					
				},
				
			},
			
			created() {
				
			},
			
			methods: {
	
				// 跳转心愿详情
				gotowishdetail() {
					uni.navigateTo({
						url: `/pages/wishlist/wishdetail?id=${this.ownwishitem._id}`
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
								
								// 开始关联商品
								_this.bindAnimation = true
								
								let wishinfo = _this.ownwishitem
								const db = uniCloud.database();
								db.collection('wishlist').doc(wishinfo._id)
								.update({agentUser:db.env.uid, agentFlag: 1})
								.then(response => {

									// 关联成功
									uni.showToast({
										title: _this.i18n.tip.addsuccess,
										icon: 'none'
									});
									
									// 添加一个代理人关联心愿时间轴记录
									db.collection('wishlisttimeline')
									.add({type: 90,wishId: wishinfo._id})
									.then(response => {
										// 创建时间轴成功
										// 更改数据
										_this.ownwishitem.agentFlag = 1
										
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
									
								})
								.catch(error => {
									// 关联失败
									uni.showToast({
										title: error.message,
										icon: 'none'
									});
									setTimeout(function() {
										_this.bindAnimation = false
									}, 1000);
								})
								
							}
						}
					});
					
				},
				
				// 长按更改心愿单状态
				changewishliststatus() {
					const _this = this
					
					console.log(`触发长按事件`);
					/*
					this.i18n.wishlist.achieveFlag.ing,
					this.i18n.wishlist.achieveFlag.waittoconfirm,
					this.i18n.wishlist.achieveFlag.makeorder,
					this.i18n.wishlist.achieveFlag.finish,
					this.i18n.wishlist.achieveFlag.closed
					*/
				   // 心愿单完成标识 0进行中 1待确认 2待下单 3已完成 4已关闭
				   let optionList = [
						{
							name: this.i18n.wishlist.achieveFlag.ing,
							type: 'changetag',
							achieveFlag: 0
						},
						{
							name: this.i18n.wishlist.achieveFlag.waittoconfirm,
							type: 'changetag',
							achieveFlag: 1
						},
						{
							name: this.i18n.wishlist.achieveFlag.makeorder,
							type: 'changetag',
							achieveFlag: 2
						},
						{
							name: this.i18n.wishlist.achieveFlag.finish,
							type: 'changetag',
							achieveFlag: 3
						},
						{
							name: this.i18n.wishlist.achieveFlag.closed,
							type: 'changetag',
							achieveFlag: 4
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
							db.collection('wishlist').doc(_this.ownwishitem._id)
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
