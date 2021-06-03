<!-- 心愿单多规格选择器 -->
<template>
	
	<u-popup class="wishspecselectorview" mode="bottom" v-model="show" border-radius="10px">
		<view class="contentview">
			
			<!-- 头部区域 一级属性区域 -->
			<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
				<view class="cu-item" :class="firstindex==firstTabCur?'text-pink cur':''" v-for="(firstitem,firstindex) in 10" :key="firstindex" @tap="firstTabSelect" :data-id="firstindex">
					{{ `第一属性${firstitem.toString()}` }}
				</view>
			</scroll-view>
			
			<!-- 第二属性区域 -->
			<swiper :indicator-dots="false" :autoplay="false" :duration="300" style="width: 100%;height: 200rpx;" :current="firstTabCur">
				<swiper-item v-for="(firstitem, firstindex) in 10" :key="firstindex">
					<view class="swiper-item">
						<scroll-view scroll-y>
							
							<!-- 二级属性列表 -->
							<view class="cu-list menu">
								
								<view class="cu-item" v-for="(seconditem, secondindex) in 5" :key="secondindex">
									<view class="content">
										<input type="text" :value="1" />
									</view>
									<view class="action">
										<input type="number" :value="100" />
									</view>
								</view>
								
							</view>
							
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
			
			<!-- 确定按钮 -->
			<button class="cu-btn bg-gradual-pink block width100 lg" @tap.stop="confirm">确定</button>
			
		</view>
	</u-popup>
	
</template>

<script>
	
	export default {
		
			name:'wishspecselector',
			
			components:{
				
			},
			
			props: {
				
				// 心愿id
				wishId: {
					type: String,
					default: null,
					required: true
				},
				
				// 是否显示弹框
				ifshow: {
					type: Boolean,
					default: false,
				}

			},
			
			data() {
				return {
					
					show: this.$props.ifshow, // 是否显示弹框
					
					firstTabCur: 0, // 一级属性的选中索引
					scrollLeft: 0
					
				}
			},
			
			watch: {
				ifshow(newValue, oldValue) {
					if(newValue !== oldValue) {
						console.log(`检测到ifshow参数发生变化`);
						this.show = newValue
					}
				},
				
				show(newValue, oldValue) {
					if(newValue !== oldValue) {
						console.log(`检测到show状态发生变化`);
						// 更新props参数保持一致
						this.$emit('update:ifshow', newValue)
					}
				}
			},
			
			computed: {
				
			
			},
			
			created() {
				
				
			},
			
			methods: {
			
				// 切换一级属性
				firstTabSelect(e) {
					this.firstTabCur = e.currentTarget.dataset.id;
					this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				},
				
				// 确定事件
				confirm() {
					
					// 统计数据
					
					this.show = !this.show
				},
				
				//
				
				
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
	/deep/.wishspecselectorview{
		.contentview{
			
			.firstscrollview{
				
				.eachfirstitem{
					
				}
				
			}
			
		}
	}
	
</style>
