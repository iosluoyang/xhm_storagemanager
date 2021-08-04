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
			<view class="cu-bar bg-white margin-top">
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
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-blue"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.receiveproduct.confirminfo }}</text>
				</view>
			</view>
			
			<!-- 操作区域 -->
			<view class="optionview padding-left padding-right">
				
				<view class="cu-form-group">
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
				</view>

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
			
			//
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.content {
		
	}
	
</style>
