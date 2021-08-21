<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap.stop="backPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			// 默认可以返回
			isBack: {
				type: [Boolean, String],
				default: true
			},
			// 是否需要返回的二次确认  默认为否 
			isBackConfirm: {
				type: Boolean,
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			backPage() {
				
				if(this.isBackConfirm) {
					
					uni.showModal({
						content: this.i18n.tip.exitconfirm,
						showCancel: true,
						cancelText: this.i18n.base.cancel,
						confirmText: this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								// 如果没有前面的页面则重定向至首页
								let pages = getCurrentPages()
								if(pages.length == 1) {
									// 仅有当前一个页面
									uni.reLaunch({
										url: '/pages/home/index'
									})
								}
								else {
									uni.navigateBack();
								}
								
							}
						}
					});
					
				}
				else{
					// 如果没有前面的页面则重定向至首页
					let pages = getCurrentPages()
					if(pages.length == 1) {
						// 仅有当前一个页面
						uni.reLaunch({
							url: '/pages/home/index'
						})
					}
					else {
						uni.navigateBack();
					}
				}
				
			}
		}
	}
</script>

<style>

</style>
