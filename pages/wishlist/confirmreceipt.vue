<template>
	<view class="pagecontent confirmreceiptpage">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-cyan" isBack>
			<block slot="content">{{ i18n.nav.confirmreceipt }}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<view v-if="wishinfo" class="contentview">
			
			<!-- 心愿详情信息 -->
			<view v-if="false" class="wishdetailview bg-white padding-sm solid-bottom">
				
				<!-- 心愿商品基本信息 -->
				<view class="prodetailview padding-sm flex align-center">
					
					<!-- 商品轮播图 -->
					<swiper class="screen-swiper square-dot" indicator-dots circular
					 autoplay interval="3000" duration="500" style="width: 40%;height: 200rpx;min-height: auto;flex-shrink: 0;">
						<swiper-item class="radius" v-for="(img,index) in wishinfo.imgs.split(',')" :key="index">
							<image :src="img" mode="aspectFill" @tap.stop="previewImgs(wishinfo.imgs,index)"></image>
						</swiper-item>
					</swiper>
					
					<!-- 商品标题和备注 链接 -->
					<view class="procontentview flex-sub margin-left-sm" style="flex-shrink: 1;">
						<view class="text-bold margin-bottom-sm t_twoline">{{ wishinfo.productTitle }}</view>
						<view v-if="wishinfo.remark" class="tipsview radius bg-gray padding-sm text-sm text-light" style="word-break: break-all;" @longpress="$basejs.copytoclipboard(wishinfo.remark)">{{wishinfo.remark}}</view>
						<view class="bottomview margin-top-sm flex justify-between align-center">
							<view class="priceview flex align-center">
								<text class="text-red text-xl margin-right">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text>
								<view class="cu-tag radius bg-cyan">{{ wishinfo.targetAmount }}</view>
							</view>
							
						</view>
					</view>
					
				</view>
				
			</view>
			
			<!-- 订购信息字样 -->
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-cyan"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.receiveproduct.purchaseinfo }}</text>
				</view>
			</view>
			
			<!-- 订购数量详情表格 -->
			<view class="purchasetableview padding-sm">
				<wishTableSpec ref="wishtablespec" :wishinfo="wishinfo" sourcefrom="productreceive" ></wishTableSpec>
			</view>
			
			<!-- 操作区域字样 -->
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-blue"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.receiveproduct.confirminfo }}</text>
				</view>
			</view>
			
			<!-- 操作区域 -->
			<view class="optionview padding-left padding-right">
				
				<!-- 收货状态 -->
				<radio-group class="block" @change="(e) => {receiveAllFlag = Number(e.detail.value)}">
					
					<view class="flex justify-around">
						<label class="radio">
							<radio class='cyan margin-right-sm' :class="receiveAllFlag==1?'checked':''" :checked="receiveAllFlag==1?true:false" value="1"></radio>
							{{ i18n.wishlist.receiveproduct.receiveall }}
						</label>
						<label class="radio">
							<radio class='red radio margin-right-sm' :class="receiveAllFlag==0?'checked':''" :checked="receiveAllFlag==0?true:false" value="0"></radio>
							{{ i18n.wishlist.receiveproduct.receiveparts }}
						</label>
					</view>
					
				</radio-group>
				
				<!-- 如果是部分收货的话则记录收货信息 -->
				<view v-if="receiveAllFlag == 0" class="padding">
					
					<view class="partreceiveview">
						
						<view class="title text-bold">{{ `部分收货信息` }}</view>
						<view class="cu-form-group solid margin-top-sm">
							<textarea maxlength="-1" v-model="receiveproductcontent" placeholder="输入收货信息"></textarea>
						</view>
						
					</view>
					
					<view class="remarkview margin-top-sm">
						
						<view class="title text-bold">{{ `备注` }}</view>
						<view class="cu-form-group solid margin-top-sm">
							<textarea maxlength="-1" v-model="remark" placeholder="请输入备注"></textarea>
						</view>
						
					</view>
					
				</view>
				
				<!-- <view class="cu-form-group">
					<view class="title">{{ `第三方订单号` }}</view>
					<input class="text-right" type="text" v-model="thirdOrderNum" />
					<button class='cu-btn bg-green shadow' @tap.stop="pasteData('thirdOrderNum')">{{ i18n.base.paste }}</button>
				</view>
				
				
				<view class="cu-form-group">
					<view class="title">{{ `国内物流名称` }}</view>
					<input class="text-right" type="text" v-model="domesticShippingName" />
				</view>
				
				<view class="cu-form-group">
					<view class="title">{{ `国内物流单号` }}</view>
					<input class="text-right" type="text" v-model="domesticShippingNum" />
					<button class='cu-btn bg-green shadow' @tap.stop="pasteData('domesticShippingNum')">{{ i18n.base.paste }}</button>
				</view> -->

			</view>
			
			
			<!-- 确定按钮 -->
			<view class="btnview padding-left padding-right flex align-center justify-center margin-top">
				<button class="cu-btn width50 round lg" :class="[ receiveAllFlag == '1' ? 'bg-cyan' : 'bg-red' ]" @tap.stop="confirm">{{ i18n.base.confirm }}</button>
			</view>
			
		</view>
		
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
	
	export default {
		
		components: {
			wishTableSpec,
		},
		
		data() {
			return {
				ifloading: false, // 是否正在加载
				
				
				wishId: null, // 心愿id
				wishinfo: null, // 心愿详情数据
				
				receiveAllFlag: '1', // 收货状态 0 未全部收到货  1全部收到货  默认为1 字符串类型
				
				receiveproductcontent: "", // 部分收货信息内容
				remark: '', // 备注内容
				
				thirdOrderNum: '', // 第三方订单号
				domesticShippingName: '', // 国内物流名称
				domesticShippingNum: '', // 国内物流编号
			}
		},
		
		onShareAppMessage(res) {
			
			console.log(`分享到聊天`);
			let shareObj = this.shareObj
			return shareObj
			
		},
		
		onShareTimeline(res) {
			
			console.log(`分享到朋友圈`);
			let shareObj = this.shareObj
			return shareObj
			
		},
		
		// 页面加载后
		onLoad(option) {
			_this = this
			
			let wishId = option.wishId
			if(wishId) {
				_this.wishId = wishId
				// 获取心愿详情信息
				_this.loadwishdetail()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				});
			}
			
		},
		
		methods: {
			
			// 获取心愿详情
			loadwishdetail() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wishlist,uni-id-users')
					.doc(_this.wishId)
					.field('creatUser{nickname,avatar},agentUser{avatar,nickname},agentFlag,productTitle,aliasName,imgs,targetPrice,targetAmount,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,achieveFlag,hurryLevel,remark,creatTime,productExt,specPropInfo,thirdPidType,thirdPid')
					.get({
						getOne:true
					})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							_this.wishinfo = detaildata
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
			// 确认收货
			confirm() {
				
				// 如果是全部收货
				if(this.receiveAllFlag == 1) {
					uni.showModal({
						title: _this.i18n.base.tip,
						content: _this.i18n.wishlist.receiveproduct.receiveallconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								const db = uniCloud.database();
								db.collection('wishlist')
								.doc(_this.wishId)
								.update({achieveFlag: 4})
								.then(response => {
									if(response.result.code == 0) {
										
										// 更改状态成功
										// 增加时间轴信息
										// 增加一条代理已经进货的时间轴
										db.collection('wishlisttimeline')
										.add({type: 6, wishId: _this.wishId})
										.then(response => {
											// 增加时间轴成功
											
											// 更新列表 详情和时间轴
											// 更新数据
											uni.$emit('updatetimeline')
											// 更新心愿单列表和详情
											uni.$emit('updatewishlist')
											uni.$emit('updatewishdetail')
											
											uni.showToast({
												title: _this.i18n.tip.optionsuccess,
												icon: 'none'
											});
											
											setTimeout(function() {
												uni.navigateBack();
											}, 1000);
											
										}).catch(error => {
											console.log(error.message);
											uni.showToast({
												title: _this.i18n.error.optionerror,
												icon: 'none'
											});
										})
										
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
				}
				
				// 部分收货
				else if(this.receiveAllFlag == 0) {
					console.log(`部分收货`);
				}
				
			},
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.content {
		
	}
	
</style>
