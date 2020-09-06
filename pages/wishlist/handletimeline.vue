<template>
	<view class="handletimelineview content">
		
		<cu-custom isBack bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.wishlist.timeline.title}}</block>
		</cu-custom>
		
		<!-- 该心愿详情信息 -->
		<view class="wishdetailview bg-white padding-sm">
			
			<view class="cu-bar">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-bold text-black">{{i18n.wishlist.wishdetail}}</text>
				</view>
			</view>
			
			<!-- 心愿商品基本信息 -->
			<view class="prodetailview padding-sm flex align-center">
				
				<!-- 商品轮播图 -->
				<swiper class="screen-swiper square-dot" indicator-dots circular
				 autoplay interval="3000" duration="500" style="width: 40%;height: 200rpx;min-height: auto;">
					<swiper-item class="radius" v-for="(img,index) in swiperimgArr" :key="index">
						<image :src="imgUrl + img" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				
				<!-- 商品标题和备注 -->
				<view class="procontentview flex-sub margin-left-sm">
					<view class="text-bold">{{ wishinfo.productTitle }}</view>
					<view class="tipsview bg-gray padding-sm text-sm text-light">{{wishinfo.remark}}</view>
					<view class="priceview">
						<text class="text-red text-xl margin-right">{{ `${wishinfo.expectmoneytype === 'RMB' ? '¥' : wishinfo.expectmoneytype === 'THB' ? '฿' : ''}${wishinfo.expectPrice}` }}</text>
						<text class="text-gray text-df">{{ `${wishinfo.platformmoneytype === 'RMB' ? '¥' : wishinfo.platformmoneytype === 'THB' ? '฿' : ''}${wishinfo.platformPrice}` }}</text>
					</view>
				</view>
				
			</view>
			
		</view>
		
		<!-- 时间轴更新内容 -->
		<view class="timelinecontentview bg-white padding-sm">
			
			<view class="cu-bar">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-pink"></text>
					<text>{{ `更新时间轴` }}</text>
				</view>
			</view>
			
			<!-- 表单区域  填写相关数据 -->
			<form>
				
				<view class="cu-form-group margin-top">
					<view class="title">{{`选择类型`}}</view>
					<view class="">
						
					</view>
				</view>
				
			</form>
			
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				wishid: null, // 当前时间轴的心愿id
				wishinfo: null, // 当前心愿详情
				
				swiperimgArr: [], // 轮播图片数组
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			let wishid = option.wishid
			_this.wishid = wishid || '5f549a632805da0001929aaf'
			
			// 获取当前心愿的详情
			_this.getwishdetail()
			
		},
		
		methods: {
		
			// 获取心愿详情
			getwishdetail() {
				
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getdetail',
						info: {
							_id: this.wishid
						}
					}
				}).then(response => {
					// 获取数据成功
					let info = response.result.data[0]
					
					this.wishinfo = info
					
					// 轮播数据
					let swiperimgArr = info.imgs.split(',') // 图片数组
					this.swiperimgArr = swiperimgArr
					
					// this.productTitle = info.productTitle // 商品标题
					// this.sourceLink = info.sourceLink // 源网站链接
					// this.platformPrice = info.platformPrice // 源网站价格
					// this.platformmoneytype = info.platformmoneytype // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
					// this.expectPrice = info.expectPrice // 期望价格
					// this.expectmoneytype = info.expectmoneytype // 期望价格币种 默认为RMB  RMB人民币 THB泰铢
					// this.expectAmount = info.expectAmount // 期望数量
					// this.hurryLevel = info.hurryLevel // 紧急程度 默认为2级 int 类型
					// this.imgArr = info.imgs.split(',') // 图片数组
					// this.remark = info.remark // 备注信息
					
				}).catch(error => {
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			
		
		},
	}
</script>

<style lang="scss" scoped>

</style>
