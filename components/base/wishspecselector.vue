<!-- 心愿单多规格选择器 -->
<template>
	
	<u-popup class="wishspecselectorview" mode="bottom" v-model="show" border-radius="10px">
		<view class="contentview">
			
			<!-- 商品区域 -->
			<view class="prospecview padding flex align-center borderbottom">
				
				<!-- 图片 -->
				<image class="specImg margin-right-sm" style="width: 150rpx;height: 150rpx;" :src="specImg" mode="aspectFill"></image>
				
				<!-- 商品信息 -->
				<view class="proInfoView" style="max-width: calc(100% - 200rpx)">
					
					<!-- 商品名称 -->
					<view class="text-df text-cut">{{ proName }}</view>
					<!-- 价格区域 -->
					<view class="text-price text-red margin-top-sm">
						{{ proPriceRange }}
					</view>
					
				</view>
				
			</view>
			
			<!-- 规格选择视图 -->
			<view class="realcontentview">
				
				<scroll-view scroll-x class="bg-white nav padding" scroll-with-animation :scroll-left="scrollLeft">
					<view class="cu-item" :class="firstindex==firstTabCur?'text-pink cur':''" v-for="(firstitem,firstindex) in specDataArr" :key="firstindex" @tap="firstTabSelect" :data-id="firstindex">
						{{ firstitem.name }}
						<!-- 可添加角标 -->
					</view>
				</scroll-view>
				
				<!-- 第二属性区域 -->
				<swiper :indicator-dots="false" :autoplay="false" :duration="300" style="width: 100%;height: 400rpx;" :current="firstTabCur" @animationfinish="swiperAnimationFinish">
					<swiper-item v-for="(firstitem, firstindex) in specDataArr" :key="firstindex">
						<view class="swiper-item height100">
							<scroll-view class="height100" scroll-y>
								
								<!-- 二级属性列表 -->
								<view class="cu-list menu">
									
									<view class="cu-item" v-for="(seconditem, secondindex) in firstitem.dataArr" :key="secondindex">
										<view class="content">
											<input type="text" v-model="seconditem.name" />
											<view class="text-sm">
												<text class="text-price text-red">{{ seconditem.price }}</text>
											</view>
										</view>
										<view class="action">
											<!-- 步进器 -->
											<uni-number-box v-model="seconditem.amount"></uni-number-box>
											<text class="text-sm text-grey margin-top-sm">{{ `库存:${seconditem.stock}` }}</text>
										</view>
									</view>
									
								</view>
								
							</scroll-view>
						</view>
					</swiper-item>
				</swiper>
				
			</view>
			
			<!-- 确定按钮 -->
			<button class="cu-btn bg-gradual-pink block width100 lg" @tap.stop="confirm">确定</button>
			
		</view>
	</u-popup>
	
</template>

<script>
	
	var _this
	
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
					
					wishInfo: null, // 心愿详情数据
					
					firstTabCur: 0, // 一级属性的选中索引
					scrollLeft: 0,
					
					specDataArr: [], // 规格数据数组
					
					proName: '我是商品名称我是商品名称我是商品名称我是商品名称我是商品名称我是商品名称我是商品名称我是商品名称我是商品名称',
					proPriceRange: '15.68~21.38',
					specImg: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/f6e7496b-4c67-4b50-aee2-e8beafd1e45e.jpg',
					
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
				
				_this = this
				// 获取详情信息
				this.getdetailinfo()
				
			},
			
			methods: {
				
				// 根据心愿详情获取相关数据
				getdetailinfo() {
					
					// 根据id获取心愿详情
					const db = uniCloud.database();
					db.collection('wishlist').doc(this.wishId).get({getOne:true}).then(response => {
						if(response.result.code == 0) {
							let wishInfo = response.result.data
							this.wishInfo = wishInfo
							
							// 开始加载规格信息
							uniCloud.callFunction({
								name: 'wishlist',
								data: {
									type: 'getlinkdetail',
									info: {
										text: this.wishInfo.productExt.pureUrl
									}
								},
								success(res) {
									let productInfo = res.result.data.product
									console.log(productInfo);
									
									// 开始设置规格数组数据
									_this.setSpecListData(productInfo)
									
								},
								fail(error) {
									uni.showToast({
										title: error.message,
										icon: 'none'
									});
								}
							})
						}
					}).catch(error => {
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					})
					
				},
				
				// 设置规格数组数据
				setSpecListData(productInfo) {
					
					let specPropInfo = productInfo.specPropInfo
					
					// 模拟多规格数据
					specPropInfo = {
						propName: '颜色',
						secondPropName: '尺寸',
						propValList: [
							{
								propVal: '红色',
								img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/0dca9251-b12d-4f10-9197-86e5d322c581.jpg',
								specStockList: [
									{
										propVal: '大号',
										specId: 1,
										stockCount: 100,
										price: 25.66
									},
									{
										propVal: '小号',
										specId: 2,
										stockCount: 90,
										price: 15.66
									}
								]
							},
							{
								propVal: '绿色',
								img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/d5a94550-1add-4f20-b9ce-f59a578ef17c.jpg',
								specStockList: [
									{
										propVal: '小号',
										specId: 3,
										stockCount: 800,
										price: 45
									},
									{
										propVal: '中号',
										specId: 4,
										stockCount: 900,
										price: 35.66
									},
									{
										propVal: '特大号',
										specId: 5,
										stockCount:78,
										price: 65
									}
								]
							}
						]
						
					}
					
					// 一级属性值
					let dataArr = []
					specPropInfo.propValList.forEach(firstitem => {
						
						// 对应的二级属性数组
						let secondList = firstitem.specStockList
						let tempSecondList = []
						secondList.forEach(seconditem => {
							let secondItemInfo = {
								name: seconditem.propVal,
								specId: seconditem.specId,
								amount: 0,
								stock: seconditem.stockCount,
								price: seconditem.price
							}
							tempSecondList.push(secondItemInfo)
						})
						
						let firstItemInfo = {
							name: firstitem.propVal,
							dataArr: tempSecondList
						}
						
						dataArr.push(firstItemInfo)
						
					})
					
					this.specDataArr = dataArr
					
				},
			
				// 切换一级属性
				firstTabSelect(e) {
					this.firstTabCur = e.currentTarget.dataset.id;
					this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				},
				
				// 切换swiper动画结束
				swiperAnimationFinish(e) {
					let current = e.detail.current
					this.firstTabCur = current
					this.scrollLeft = this.firstTabCur * 60
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
			
			.prospecview{
				.specImg{
					
				}
			}
			
			.firstscrollview{
				
				.eachfirstitem{
					
				}
				
			}
			
		}
	}
	
</style>
