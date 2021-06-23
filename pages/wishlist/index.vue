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
			<view class="cu-bar btn-group margin-top">
				<button class="cu-btn bg-gradual-pink shadow-blur round lg width100" @click="startSearch">{{ i18n.base.search }}</button>
			</view>
			
			<!-- 搜索历史区域 -->
			<view v-if="searchrecord1688" class="searchrecord bg-white">
				
				<text class="cu-bar text-sm">搜索历史</text>
				<view v-for="(item, index) in searchrecord1688" :key="index"
						:style="[{animationDelay: (index + 1)*0.1 + 's'}]"
						class="text-sm bg-gray round text-cut margin-bottom-sm padding-sm" 
						:class="[toggleDelay?'animation-slide-bottom':'']"
						@tap.stop=" searchText=item; startSearch() ">{{ item }}</view>
				
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
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-blue" @tap.stop="gotoproductcategory">
					<view class="text-lg cuIcon-emojifill text-white"></view>
					<view class="margin-top-sm text-Abc">Product Category</view>
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
				searchrecord1688: null, // 搜索历史
				searchrecordmaxnum: 5, // 搜索历史最大数量
				toggleDelay: false, // 搜索历史动画是否开启
				ifloading: false, // 是否正在加载中
			};
		},
		
		onLoad() {
			_this = this
			
		},
		
		onShow() {
			// 加载搜索历史
			let searchrecord1688 = uni.getStorageSync('searchrecord1688')
			this.searchrecord1688 = searchrecord1688
			setTimeout(function() {
				_this.toggleDelay = true
			}, 300);
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
					console.log(`当前搜索文本为:${this.searchText}`);
					
					// 存储搜索历史
					this.addSearchRecord(this.searchText)
					
					// 将搜索文本存储在本地
					uni.setStorageSync('linkprosearchtext',this.searchText)
					
					// 清空搜索文本
					this.searchText = ''
					
					uni.navigateTo({
						url: `/pages/wishlist/linkprodetail?type=searchText`
					});
					
				}
				
			},
			
			// 添加到搜索记录
			addSearchRecord(searchText) {
				
				// 将搜索文本存储在本地
				let searchrecord1688Arr = uni.getStorageSync('searchrecord1688') || []
				if(searchrecord1688Arr.length >= this.searchrecordmaxnum) {
					searchrecord1688Arr = searchrecord1688Arr.slice(0, this.searchrecordmaxnum - 1)
				}
				// 添加头部
				searchrecord1688Arr.unshift(searchText)
				// 存储搜索历史
				uni.setStorageSync('searchrecord1688', searchrecord1688Arr)
				
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
			
			// 跳转商品分类页面
			gotoproductcategory() {
				uni.navigateTo({
					url: '/pages/wishlist/linkprocategory'
				});
			},
			
			//
			
		},
	}
</script>

<style lang="scss" scoped>
	
	

</style>
