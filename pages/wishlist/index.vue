<template>
	<view class="wishlistview content">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 搜索区域 -->
		<view class="searchview margin">
			
			<!-- 搜索框 -->
			<u-field class="round"
					style="background-color: #F5F5F5;"
					v-model="searchText" placeholder="请复制1688网址"
					:border-bottom="false" label-width="0"
					clear-size="45"
			>
				<!-- #ifndef H5 -->
				<button slot="right" class="cu-btn round bg-cyan shadow" @tap.stop="pasteData('searchText')">{{i18n.base.paste}}</button>
				<!-- #endif -->
			</u-field>
			
			<!-- 搜索按钮 -->
			<view class="cu-bar btn-group margin">
				<button class="cu-btn bg-gradual-pink shadow-blur round lg" @click="startSearch">{{ i18n.base.search }}</button>
			</view>
			
		</view>
		
		<!-- 功能区域 -->
		<view class="grid col-2 padding-sm margin-top-sm">
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-pink" @tap.stop="addwish">
					<view class="text-lg cuIcon-magic text-white"></view>
					<view class="margin-top-sm text-Abc">I want</view>
				</view>
			</view>
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-green" @tap.stop="checkwishlist">
					<view class="text-lg cuIcon-emojifill text-white"></view>
					<view class="margin-top-sm text-Abc">Check Wishlist</view>
				</view>
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
				searchText: '', // 搜索文本
				ifloading: false, // 是否正在加载中
			};
		},
		
		onLoad() {
			_this = this
		},
				
		methods: {
			
			// 粘贴内容
			pasteData(datatype) {
				uni.getClipboardData({
					success(res) {
						let content = res.data
						if(content) {
							_this[datatype] = content
						}
					}
				})
			},
			
			// 开始搜索
			startSearch() {
				
				if(!this.searchText) {
					uni.showToast({
						title: this.i18n.tip.needtoinputcontent,
						icon: 'none'
					});
					return
				}
				else {
					let searchParam = encodeURI(this.searchText)
					uni.navigateTo({
						url: `/pages/wishlist/linkprodetail?searchText=${searchParam}`
					});
				}
				
			},
			
			// 新增心愿单
			addwish() {
				uni.navigateTo({
					url: '/pages/wishlist/handlewish?type=add'
				});
			},
			
			// 查看心愿列表
			checkwishlist() {
				uni.navigateTo({
					url: '/pages/wishlist/list'
				});
			},
			
			//
			
		},
	}
</script>

<style lang="scss" scoped>
	
	

</style>
