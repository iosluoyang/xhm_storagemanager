<!-- 心愿单列表单个组件 -->
<template>
	
	<!-- 每一个心愿单卡片的内容 -->
	<view v-if="wishitem" class="contentview cu-card case">
		
		<view class="cu-item shadow " @tap.stop="gotowishdetail">
			
			<!-- 卡片上方-图片区域 -->
			<view class="image">
				<image style="height: 300rpx;" :src="wishitem.imgs ? imgUrl + wishitem.imgs.split(',')[0] : '/static/publicicon/logo.png' " mode="aspectFit"></image>
				<view class="cu-tag text-white" :class="[wishitem.achieveFlag == 2 ? 'bg-green' : wishitem.achieveFlag == 1 ? 'bg-orange' : 'bg-pink']">{{wishitem.achieveFlag == 2 ? i18n.wishlist.achieveFlag.makeorder : wishitem.achieveFlag == 1 ? i18n.wishlist.achieveFlag.waittoconfirm : i18n.wishlist.achieveFlag.ing}}</view>
				<view class="cu-bar bg-shadeBottom flex-direction align-start">
					
					<!-- 商品标题 -->
					<view class="text-bold text-xl margin-top-sm">{{wishitem.productTitle}}</view>
					<!-- 商品价格 -->
					<view class="priceview margin-top-sm">
						<text class="text-red text-xl margin-right">{{ `${wishitem.targetMoneyType === 'RMB' ? '¥' : wishitem.targetMoneyType === 'THB' ? '฿' : ''}${wishitem.targetPrice}` }}</text>
						<text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishitem.sourceMoneyType === 'RMB' ? '¥' : wishitem.sourceMoneyType === 'THB' ? '฿' : ''}${wishitem.sourcePrice}` }}</text>
					</view>
					
				</view>
			</view>
			
			<!-- 卡片下方-内容区域 -->
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					
					<!-- 头像 -->
					<template>
						<image v-if="wishitem.user && wishitem.user.avatar" class="cu-avatar round lg" :src="imgUrl + wishitem.user.avatar"></image>
						<view v-else class="cu-avatar round lg">
							<text class="cuIcon-people"></text>
						</view>
					</template>
					
					<!-- 内容 -->
					<view class="content flex-sub">
						
						<!-- 上方发布人昵称 -->
						<view class="text-grey">{{wishitem.user && wishitem.user.userName ? wishitem.user.userName : 'XXX'}}</view>
						
						<!-- 内容区域 -->
						<view class="flex justify-between">
							<!-- 发布时间 -->
							<view class="text-gray text-sm">
								{{showtimestr(wishitem.creatTime)}}
							</view>
							<!-- 点赞浏览区域 -->
							<view class="text-gray text-sm">
								<!-- 紧急程度 -->
								<text class="hurryleveltext margin-right-sm">
									<text v-for="item in wishitem.hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
								</text>
								<text class="cuIcon-attentionfill margin-lr-xs"></text>{{wishitem.previewCount || 0}}
								<text class="cuIcon-messagefill margin-lr-xs"></text> {{wishitem.commentCount || 0}}
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
					
					
					
				}
			},
			
			computed: {
				
			
			},
			
			created() {
				
				
			},
			
			methods: {
	
				// 显示时间字符串
				showtimestr(creatTime) {
					let moment = this.$moment
					let nowmoment = new moment()
					let creatmoment = new moment(creatTime)
					let duration = moment.duration(nowmoment.diff(creatTime))
					let difftimestr = duration.humanize()
					return difftimestr
				},
	
				// 跳转心愿详情
				gotowishdetail() {
					uni.navigateTo({
						url: `/pages/wishlist/wishdetail?id=${this.wishitem._id}`
					});
				},
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
	
	
</style>
