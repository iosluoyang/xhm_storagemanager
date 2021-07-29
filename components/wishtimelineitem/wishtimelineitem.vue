<template>
	<view v-if="timelineitem" class="wishtimelineitem" :class=" [ ifDisappear ? ' animation-fade animation-reverse' : ''] ">
		
		<!-- 心愿开始类型  type=0 -->
		<view v-if="timelineitem.type == 0" class="content bg-pink shadow-blur">
			<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
			<text class="margin-left">{{ i18n.wishlist.timeline.startsign }}</text>
		</view>
		
		<!-- 心愿单普通时间轴类型  type=1 -->
		<!-- 参见下方v-else内容 -->
		
		<!-- 心愿单编辑类型  type=2 -->
		<view v-else-if="timelineitem.type == 2" class="content bg-gradual-red shadow-blur">
			<text class="cuIcon cuIcon-edit text-white margin-right"></text>
			<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
			<text class="block margin-top-sm">{{ `"  ${timelineitem.creatUser ? timelineitem.creatUser.nickname : ''}  " ${i18n.base.edit}${i18n.wishlist.timeline.wishtitle}` }}</text>
		</view>
		
		<!-- 心愿单关联代理人类型  type=90 -->
		<view v-else-if="timelineitem.type == 90" class="content bg-gradual-blue shadow-blur">
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{`您好,我是您的商品代理人,从现在开始为您提供服务`}}
			</view>
		</view>
		
		<!-- 心愿单待确认类型 type=3 -->
		<view v-else-if="timelineitem.type == 3 " class="content bg-orange shadow-blur shadow-blur">
			
			<!-- 发布人 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df text-black">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap text-white">
				{{ `已经为您提供最新报价,请滑动到上方查看详细报价单,点击确认后代理员将开始为您订货` }}
			</view>
			
			
			<!-- 价格 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-white text-bold text-xl margin-left-sm"> RMB {{ timelineitem.price }}</text>
			</view>
			
			<!-- 按钮操作区域   -->
			<view v-if="wishInfo.creatUser._id == user._id " class="btnview margin-top-sm flex align-center justify-between solid-top padding-top-sm">
				
				<view class="leftview flex align-center">
					<button class="cu-btn round text-white margin-right" :style="{background: '#8799a3'}" @tap.stop="refusetimeline(timelineitem)">{{ i18n.base.refuse }}</button>
					<button class="cu-btn round text-white" :style="{background: '#8dc63f'}" @tap.stop="agreetimeline(timelineitem)">{{ i18n.base.agree }}</button>
				</view>
				
				<view class="rightview flex align-center">
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 心愿单同意类型 type=4 -->
		<view v-else-if="timelineitem.type == 4 " class="content bg-gradual-blue shadow-blur">
			
			<!-- 发布人 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df text-black">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ user.role == 'PRODUCT_AGENT' ? '客户已经确认报价单,请尽快下单进货' : '您已确认报价单, 代理员将尽快为您下单进货,请耐心等待' }}
			</view>
			
			<!-- 总价 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-red text-xl margin-left-sm"> RMB {{ timelineitem.price }}</text>
				
			</view>
			
			<!-- 同意区域 -->
			<view class="agreeview margin-left-sm margin-top-sm padding-sm solid">
				
				<!-- 同意人 -->
				<view class="agreeUserview flex align-center">
					<view class="leftview flex align-center">
						<image class="cu-avatar round sm" :src="timelineitem.optionUser.avatar" mode="aspectFill"></image>
						<view class="flex margin-left-sm flex-direction text-sm">
							<text class="usernameview text-black text-sm">{{ timelineitem.optionUser.nickname }}</text>
							<uni-dateformat class="optiontime text-sm text-gray" :date="timelineitem.optionTime" />
						</view>
					</view>
				</view>
				
				<view class="text-black text-bold margin-top-sm">{{ `已同意该报价单` }}</view>
			
			</view>
			
			<!-- 操作按钮区域  仅代理有 -->
			<view v-if=" wishInfo.agentUser._id == user._id " class="btnview margin-top-sm flex align-center">
				<button class="cu-btn round" :style="{background: '#ffffff'}" @tap.stop="agentpurchasepro">{{ `下单进货` }}</button>
			</view>
			
		</view>
		
		<!-- 心愿单拒绝类型 type=5 -->
		<view v-else-if="timelineitem.type == 5 " class="content bg-gray shadow-blur">
			
			<!-- 发布人 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{ user.role == 'PRODUCT_AGENT' ? '客户拒绝了该报价,请重新发起报价单' : '您已拒绝报价单, 代理员将尽快重新为您报价,请耐心等待' }}
			</view>
			
			<!-- 总价 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-gray text-xl margin-left-sm" style="text-decoration: line-through;"> RMB {{ timelineitem.price }}</text>
				
			</view>
			
			<!-- 拒绝区域 -->
			<view class="refuseview margin-left-sm margin-top-sm padding-sm solid">
				
				<!-- 拒绝人 -->
				<view class="refuseUserview flex align-center">
					<view class="leftview flex align-center">
						<image class="cu-avatar round sm" :src="timelineitem.optionUser.avatar" mode="aspectFill"></image>
						<view class="flex margin-left-sm flex-direction text-sm">
							<text class="usernameview text-black text-sm text-cut">{{ timelineitem.optionUser.nickname }}</text>
							<uni-dateformat class="optiontime text-sm text-black" :date="timelineitem.optionTime" />
						</view>
					</view>
				</view>
				
				<view class="text-black text-bold margin-top-sm">{{ `拒绝了该报价单` }}</view>
			
			</view>
			
		</view>
		
		<!-- 心愿单代理人进货类型 type=91 -->
		<view v-else-if="timelineitem.type == 91" class="content bg-cyan shadow-blur">
			
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view class="margin-top-sm t_wrap">
				{{`代理员已下单,请留意货物到达状态`}}
			</view>
			
		</view>
		
		<!-- 心愿单完成类型 type=6 -->
		<view v-else-if="timelineitem.type == 6" class="content bg-green shadow-blur">
			<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
			<text class="margin-left">{{ i18n.wishlist.timeline.finishsign }}</text>
		</view>
		
		<!-- 普通时间轴内容 -->
		<view v-else class="content">
			
			<!-- 时间轴发布人信息 -->
			<view v-if="timelineitem.creatUser" class="flex align-center justify-between">
				<view class="leftview flex align-center">
					<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
					<view class="flex flex-direction">
						<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
						<uni-dateformat class="commenttime text-sm text-gray" :date="timelineitem.creatTime" />
					</view>
				</view>
			</view>
			
			<!-- 文本内容 -->
			<view v-if="timelineitem.content" class="margin-top-sm t_wrap">
				{{timelineitem.content}}
			</view>
			
			<!-- 图片 -->
			<view v-if="timelineitem.imgs" class="imgsview bg-white margin-top-sm padding">
				
				<view class="grid col-3 grid-square">
					<view class="bg-img" v-for="(img,index) in timelineitem.imgs.split(',')" :key="index" :style="[{ backgroundImage:'url(' + img + ')' }]" @tap.stop="previewImgs(timelineitem.imgs, index)"></view>
				</view>
				
			</view>
			
			<!-- 价格 -->
			<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
				
				<text class="cuIcon cuIcon-moneybagfill text-red"></text>
				<text class="text-red text-xl margin-left-sm">{{ `${timelineitem.moneyType === 'RMB' ? '¥' : timelineitem.moneyType === 'THB' ? '฿' : ''}${timelineitem.price}` }}</text>
				
			</view>
			
			<!-- 链接 -->
			<view v-if="timelineitem.link" class="linkview flex align-center margin-top-sm">
				
				<text class="cuIcon cuIcon-link text-green"></text>
				<text class="text-sm text-gray margin-left-sm">{{ timelineitem.link }}</text>
				<!-- 复制按钮 -->
				<!-- #ifndef H5 -->
				<button class="cu-btn bg-cyan shadow sm margin-left" style="flex-shrink: 0;" @tap.stop="$basejs.copytoclipboard(timelineitem.link)">{{i18n.base.copy}}</button>
				<!-- #endif -->
				
			</view>
			
			<!-- 编辑记录区域 -->
			<view v-if="timelineitem.editTime" class="editoptionview padding-top-sm solid-top text-wrap text-sm text-gray padding-left-sm padding-right-sm">
				<uni-dateformat :date="timelineitem.editTime" format="MM/dd hh:mm:ss" />
				<text class="margin-left">{{ `"${timelineitem.editUser ? timelineitem.editUser.nickname : ''}"${i18n.base.edit}` }}</text>
			</view>
			
			<!-- 按钮操作区域 -->
			<view v-if="user._id == timelineitem.creatUser._id" class="btnsview margin-top-sm solid-top padding-top-sm flex align-center">
				
				<button class="cu-btn cuIcon-delete text-red round bg-white" @tap.stop="deletetimeline"></button>
				<button class="cu-btn cuIcon-edit round bg-white margin-left-sm" @tap.stop="edittimeline"></button>
				<!-- #ifdef MP -->
				<button class="cu-btn cuIcon-share round bg-white margin-left-sm" @tap.stop="sharetimeline"></button>
				<!-- #endif -->
				
			</view>
			
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		options: {
			styleIsolation: 'apply-shared',
			addGlobalClass: true,
		},
		
		name:"wishtimelineitem",
		
		props: {
			timelineInfo: {
				type: Object,
				default: null
			},
			
			wishInfo: {
				type: Object,
				default: null
			},
		},
		
		data() {
			return {
				timelineitem: this.timelineInfo, // 当前的时间轴数据
				ifDisappear: false, // 是否消失
			};
		},
		
		watch: {
			
			// 深度监听时间轴数据变更
			timelineInfo: {
				handler(newValue, oldValue) {
					this.timelineitem = newValue
				},
				deep: true
			}
		},
		
		created() {
			_this = this
		},
		
		methods: {
			
			// 查看原图
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
			// 删除时间轴
			deletetimeline() {
				
				const _this = this
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							const db = uniCloud.database();
							db.collection('wishlisttimeline')
							.doc(_this.timelineitem._id)
							.remove()
							.then(response => {
								// 删除成功
								_this.ifDisappear = true
								setTimeout(function() {
									_this.timelineitem = null
									
									// 删除成功
									uni.showToast({
										title: _this.i18n.tip.deletesuccess,
										icon: 'none'
									});
									
								}, 500);
								
							})
							.catch(error => {
								// 删除失败
								console.log(error.message);
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
								
							})

						}
					},
				})
				
			},
			
			// 编辑时间轴
			edittimeline() {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${this.timelineitem.wishId}&timelineId=${this.timelineitem._id}&type=edit`
				});
			},
			
			// 分享时间轴
			sharetimeline() {
				this.$emit('sharetimeline', this.timelineitem)
			},
			
			// 拒绝时间轴报价单
			refusetimeline(timelineitem) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							const db = uniCloud.database();
							db.collection('wishlist').doc(timelineitem.wishId).update({achieveFlag: 0})
							.then(response => {
								// 拒绝成功  回退当前心愿为进行中
								
								// 发送推送消息
								this.pushnoticemsg('refusequotation')
								
								//将当前时间轴数据变更状态
								db.collection('wishlisttimeline')
								.doc(timelineitem._id)
								.update({type: 5,  optionTime: db.env.now, optionUser: db.env.uid})
								.then(response => {
									// 操作成功
								})
								.catch(error => {
									uni.showToast({
										title: error.message,
										icon: 'none'
									});
								})
								
								// 更新数据
								uni.$emit('updatetimeline')
								// 更新心愿单列表和详情
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')

							})
							.catch(error => {
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
							})
							
						}
					},
				})
				
			},
			
			// 同意时间轴报价单
			agreetimeline(timelineitem) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							const db = uniCloud.database();
							db.collection('wishlist')
							.doc(timelineitem.wishId)
							.update({achieveFlag: 2})
							.then(response => {
								// 同意成功 
								// 发送推送消息
								this.pushnoticemsg('agreequotation')
								
								//将当前时间轴数据变更状态
								db.collection('wishlisttimeline')
								.doc(timelineitem._id)
								.update({type: 4, optionTime: db.env.now, optionUser: db.env.uid})
								.then(response => {
									// 操作成功
								})
								.catch(error => {
									uni.showToast({
										title: error.message,
										icon: 'none'
									});
								})
								
								// 更新数据
								uni.$emit('updatetimeline')
								// 更新心愿单列表和详情
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')
								
							})
							.catch(error => {
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
							})
							
						}
					},
				})
				
			},
			
			// 代理员进货
			agentpurchasepro() {
				let wishId = _this.wishInfo._id
				uni.showModal({
					title: _this.i18n.tip.optionconfirm,
					content: _this.i18n.tip.purchasetip,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 确认进货
							
							const db = uniCloud.database();
							db.collection('wishlist')
							.doc(wishId)
							.update({
								achieveFlag: 3 , // 代理已进货客户待收货
							})
							.then(response => {
								// 操作成功
								if(response.result.code == 0) {
									
									// 发送推送消息  给用户发送下单通知
									_this.pushnoticemsg('deliveryorder')
									
									// 增加一条代理已经进货的时间轴
									db.collection('wishlisttimeline')
									.add({type: 91, wishId: wishId})
									.then(response => {
										// 增加时间轴成功
										
										// 更新列表 详情和时间轴
										// 更新数据
										uni.$emit('updatetimeline')
										// 更新心愿单列表和详情
										uni.$emit('updatewishlist')
										uni.$emit('updatewishdetail')
										
									}).catch(error => {
										console.log(error.message);
									})
									
								}
								// 操作失败
								else {
									uni.showToast({
										title: _this.i18n.error.optionerror,
										icon: 'none'
									});
								}
							})
							.catch(error => {
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
							})
						}
					}
				});
			},
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: {
							msgtype: msgtype,
							wishId: _this.wishInfo._id
						}
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
			
		},
	}
</script>

<style lang="scss" scoped>



</style>
