<template>
	<view class="linkprodetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.goodsdetail}}</block>
		</cu-custom>
		
		<!-- 商品详情信息 -->
		<view v-if="linkProduct" class="prodetailview">
			
			<!-- 轮播图 -->
			<swiper class="card-swiper square-dot" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" @change="swiperChange">
				<swiper-item v-for="(item,index) in linkProduct.imgs.split(',')" :key="index"
								:class=" swiperIndex==index?'cur': '' "
								indicator-color="#8799a3"
								indicator-active-color="#0081ff"
								@tap.stop="previewImgs(linkProduct.imgs, index)"
				>
								
					<view class="swiper-item">
						<image :src="item" mode="aspectFill"></image>
					</view>
					
				</swiper-item>
			</swiper>
			
			<!-- 标题售价等区域 -->
			<view class="titleview">
				
			</view>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				
				ifloading: false, // 是否正在加载
				searchText: '', // 搜索文本
				linkProduct: null, // 外链商品详情
				
				swiperIndex: 0, // 索引
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			let searchText = option.searchText
			if(!searchText) {
				uni.showToast({
					title: this.i18n.tip.needtoinputcontent,
					icon: 'none'
				});
				return
			}
			
			this.searchText = decodeURI(searchText)
			this.loadDetailData()
			
		},
		
		methods: {
			
			// 加载详情数据
			loadDetailData() {
				
				_this.ifloading = true
				
				// 开始加载规格信息
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getlinkdetail',
						info: {
							text: this.searchText
						}
					},
					success(res) {
						_this.ifloading = false
						console.log(`获取成功${JSON.stringify(res)}`);
						if(res.result.code == 0) {
							
							let linkProduct = res.result.data.product
							
							console.log(`当前的数据信息为`);
							console.log(linkProduct);
							_this.linkProduct = linkProduct
							
						}
						else {
							uni.showToast({
								title: res.result.message,
								icon: 'none'
							});
						}
						
					},
					fail(error) {
						_this.ifloading = false
						console.log(`获取失败${JSON.stringify(error)}`);
						console.log(error.message);
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					}
				})
				
			},
			
			swiperChange(e) {
				this.swiperIndex = e.detail.current;
			},
			
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
		},
	}
</script>

<style lang="scss" scoped>

</style>
