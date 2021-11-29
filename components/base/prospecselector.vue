<!-- 商品规格选择器  接收商品对象数据 返回选择好的规格数据 -->
<template>
	
	<u-popup class="wishspecselectorview" mode="bottom" v-model="show" border-radius="20" closeable z-index="888">
		<view class="contentview">
			
			<!-- 商品区域 -->
			<view class="prospecview padding flex align-center borderbottom">
				
				<!-- 图片 -->
				<image class="specImg margin-right-sm" style="width: 150rpx;height: 150rpx;" :src="specImg" mode="aspectFill" @click="previewImg"></image>
				
				<!-- 商品信息 -->
				<view v-if="productInfo" class="proInfoView" style="max-width: calc(100% - 250rpx)">
					
					<!-- 商品名称 -->
					<view v-if="productInfo" class="text-df t_twoline">{{ productInfo.title }}</view>
					
					<view class="bottomview margin-top-sm flex align-center justify-between">
						
						<!-- 价格 -->
						<text class="text-price text-red">{{ productInfo.price }}</text>
						
						<!-- 翻译按钮 -->
						<button class="cu-btn round bg-blue" @click="translate">
							<text class="margin-right-sm cuIcon cuIcon-global text-white"></text>
							{{ i18n.base.translate }}
						</button>
						
					</view>
					
				</view>
				
			</view>
			
			<!-- 规格选择视图 -->
			<view class="realcontentview">
				
				<!-- 一级属性区域 -->
				<scroll-view scroll-x class="bg-white nav padding" scroll-with-animation :scroll-into-view=" `firstScrollView-${firstTabCur}` ">
					
					<view class="cu-item pos-relative" :class="firstindex==firstTabCur?'text-pink cur':''" v-for="(firstitem,firstindex) in specDataArr" :key="firstindex" :id=" `firstScrollView-${firstindex}` " @tap="firstTabCur = firstindex" :data-id="firstindex">
						
						<text >{{ firstitem.translateName || firstitem.name }}</text>
						<u-badge type='warning' absolute :offset="[5,0]" :count="calculateFirstSpecAmount(firstitem)" :overflow-count="999"></u-badge>
						
					</view>
					
				</scroll-view>
				
				<!-- 第二属性区域 -->
				<swiper :style="{height: '250px'}" :indicator-dots="false" :autoplay="false" :duration="300" :current="firstTabCur" @animationfinish="(e) => { firstTabCur = e.detail.current }">
					<swiper-item v-for="(firstitem, firstindex) in specDataArr" :key="firstindex">
						<view class="swiper-item height100">
							<scroll-view class="height100" scroll-y>
								
								<!-- 二级属性列表 -->
								<u-cell-group :border="false">
									
									<u-cell-item v-for="(seconditem, secondindex) in firstitem.dataArr" :key="secondindex" :arrow="false" @click="secondTabCur = secondindex" hover-class="none">
										
										<!-- 标题区域 -->
										<view slot="title" class="flex align-center">
											
											<template>
												<text v-if="seconditem.amount" class="cuIcon cuIcon-roundcheckfill text-pink margin-right-sm"></text>
												<view class="text-wrap text-df">{{ seconditem.translateName || seconditem.name }}</view>
											</template>
	
										</view>
										
										<!-- 底部描述区域 -->
										<view slot="label" class="priceview flex align-center">
											<text class="text-price text-red">{{ seconditem.price }}</text>
										</view>
										
										<!-- 右侧区域 -->
										<view slot="right-icon">
											<!-- 数量选择 -->
											<u-number-box class="margin-bottom-sm" v-model="seconditem.amount" @blur="secondTabCur = secondindex" @change="secondTabCur = secondindex"></u-number-box>
											
											<!-- 库存区域 -->
											<view class="stockview flex align-center">
												<text>{{ i18n.wishlist.prodetail.stock }}:</text>
												<text class="text-sm text-gray">{{ seconditem.stock }}</text>
											</view>
										</view>
										
									</u-cell-item>
									
								</u-cell-group>
								
							</scroll-view>
						</view>
					</swiper-item>
				</swiper>
				
			</view>
			
			<!-- 总结区域 -->
			<view class="summaryview margin-top flex align-center justify-end padding-right">
				
				<view class="text-bold text-black">{{ `共${totalAmount}件` }}</view>
				
			</view>
			
			<!-- 确定按钮 -->
			<button class="cu-btn bg-gradual-pink block width100 lg margin-top" @tap.stop="confirm">{{ i18n.base.confirm }}</button>
			
		</view>
	</u-popup>
	
</template>

<script>
	
	var _this
	
	export default {
		
			name:'productspecselector',
			
			props: {
				
				// 商品信息
				productInfo: {
					type: Object,
					default: null
				},
				
				// 规格数据字段值 获取规格数据时使用
				specInfoName: {
					type: String,
					default: 'selectSpecPropInfo' // specPropInfo  默认规格数据 selectSpecPropInfo 选中规格数据
				},
				
				// 是否显示弹框
				ifshow: {
					type: Boolean,
					default: false,
				}

			},
			
			data() {
				return {
					
					show: this.ifshow, // 是否显示弹框
					
					firstTabCur: 0, // 一级属性的选中索引
					secondTabCur: 0, // 二级属性的选中索引
					
					specDataArr: [], // 规格数据数组

				}
			},
			
			computed: {
				
				// 展示的总数量
				totalAmount() {
					
					let totalAmount = 0
					if(this.specDataArr) {
						this.specDataArr.forEach(firstSpec => {
							firstSpec.dataArr.forEach(secondSpec => {
								totalAmount += Number(secondSpec.amount)
							})
						})
					}
					return totalAmount
					
				},
				
				specImg() {
					
					let defaultProImg = this.productInfo ? this.productInfo.imgs.split(',')[0] : '/static/publicicon/logo.png'
					
					if( this.specDataArr &&  this.specDataArr.length > 0) {

						let selectimg = this.specDataArr[this.firstTabCur].img
						return selectimg
						
					}
					else {
						return defaultProImg
					}
					
				}
				
			},
			
			watch: {
				
				ifshow(newValue, oldValue) {
					if(newValue !== oldValue) {
						// console.log(`检测到ifshow参数发生变化`);
						this.show = newValue
					}
				},
				
				show(newValue, oldValue) {
					if(newValue !== oldValue) {
						// console.log(`检测到show状态发生变化`);
						// 更新props参数保持一致
						this.$emit('update:ifshow', newValue)
					}
				},
				
				productInfo: {
					handler(newValue, oldValue) {
						if(newValue) {
							console.log(`检测到商品数据发生变化`);
							// 重新设置数据
							this.initData()
						}
					},
					deep: true,
					immediate: true
				}
				
			},
			
			created() {
				_this = this
			},
			
			methods: {
				
				initData() {
					this.firstTabCur = 0
					this.secondTabCur = 0
					this.setSpecListData() // 重设初始状态规格数据
				},
				
				// 设置规格数组数据
				setSpecListData() {
					
					// 获取规格数据
					let specPropInfo = this.productInfo[this.specInfoName]
					
					// 一级属性值
					let dataArr = []
					specPropInfo.propValList.forEach(firstitem => {
						
						// 对应的二级属性数组
						let secondList = firstitem.specStockList
						let tempSecondList = []
						secondList.forEach(seconditem => {
							
							let secondItemInfo = {
								name: seconditem.propVal,
								translateName: '', // 翻译文本
								specId: seconditem.specId,
								amount: seconditem.amount || 0,
								stock: seconditem.stockCount,
								price: seconditem.price,
								img: firstitem.img, // 图片  选择对应的一级属性图片展示
							}
							tempSecondList.push(secondItemInfo)
						})
						
						let firstItemInfo = {
							name: specPropInfo.secondPropName ? firstitem.propVal : specPropInfo.propName, // 仅有一个属性时则一级属性取属性名 否则取属性值
							translateName: '', // 翻译文本
							img: firstitem.img, // 图片  选择对应的一级属性图片展示
							dataArr: tempSecondList,
						}
						
						dataArr.push(firstItemInfo)
						
					})
					
					this.specDataArr = dataArr
					
				},
				
				// 翻译规格文本
				translate() {
					
					// 传入翻译文本的数组
					let textArr = []
					// 遍历规格数组
					this.specDataArr.forEach(firstitem => {
						textArr.push(firstitem.name)
						firstitem.dataArr.forEach(seconditem => {
							textArr.push(seconditem.name)
						})
					})
					// console.log(`要翻译的文本内容为`);
					// console.log(textArr);
					
					uni.showLoading();
					
					uniCloud.callFunction({
						name: 'base',
						data: {
							type: 'translatecontent',
							info: {
								from: 'cn', // 默认为从中文开始翻译
								to: _this.currentLang,
								textArr: textArr
							}
						}
					}).then(response => {
						console.log(response);
						uni.hideLoading()
						// 翻译成功
						if(response.result.code == 0) {
							console.log(`翻译成功`);
							console.log(response.result.data.result);
							
							// 获取到的翻译内容数组  进行遍历赋值
							let resultArr = response.result.data.result
							// 遍历规格数组 设置翻译版本的内容
							let index = 0
							// 遍历注意严格按照顺序
							this.specDataArr.forEach(firstitem => {
								firstitem['translateName'] = resultArr[index++]
								firstitem.dataArr.forEach(seconditem => {
									seconditem['translateName'] = resultArr[index++]
								})
							})
							
						}
						else {
							console.log(`翻译失败,原因是:${response.result.message}`);
						}
							
					}).catch(error => {
						uni.hideLoading()
						console.log(error.message);
					})
					
				},
				
				// 查看图片
				previewImg() {
					
					let imgArr = []
					let selectCurrent = 0
					
					imgArr = this.specDataArr.map(firstitem => (firstitem.img))
					selectCurrent = this.firstTabCur
					
					uni.previewImage({
						urls: imgArr,
						current: selectCurrent
					})
					
				},
				
				// 计算每一个一级属性的总数量
				calculateFirstSpecAmount(firstitem) {
					let totalAmount = firstitem.dataArr.reduce((total, seconditem) => {
						return total + Number(seconditem.amount)
					},0)
					return totalAmount
				},
				
				// 整理当前dataArr数据获取最终specPropInfo
				getPropInfobyDataArr() {
					
					// 根据当前的dataArr值变更为数据库保存的值
					let propValList = []
					this.specDataArr.forEach(firstitem => {
						
						let specStockList = []
						// 遍历每个一级属性下的二级属性
						firstitem.dataArr.forEach(seconditem => {
							let secondItemInfo = {
								propVal: seconditem.name, //	规格属性名称值(一级属性值/二级属性值)
								specId: seconditem.specId || '', //	规格id
								stockCount: seconditem.stock, //	库存数量小于等于0代表已售罄
								price: seconditem.price,//	价格
								amount: seconditem.amount, // 数量
							}

							specStockList.push(secondItemInfo)
						})
						
						let firstItemInfo = {
							propVal: firstitem.name, //	规格属性名称值(红色，黄色)(一级)
							img: firstitem.img, //	规格属性图片(一级规格属性图片)
							specStockList: specStockList, //	规格库存价格列表
						}
						
						propValList.push(firstItemInfo)
						
					})
					
					let globalSpecPropInfo = this.productInfo[this.specInfoName] // 原规格属性对象
					let specPropInfo = {
						propName: globalSpecPropInfo.propName || '第一属性',
						secondPropName: globalSpecPropInfo.secondPropName || '第二属性',
						propValList: propValList,
					}
					
					return specPropInfo
					
				},
				
				// 确定事件
				confirm() {
					
					// 整理数据
					let specPropInfo = this.getPropInfobyDataArr()
					
					if(this.totalAmount == 0) {
						uni.showToast({
							title: this.i18n.wishlist.common.lackspectip,
							icon: 'none'
						});
						return
					}
					
					this.$emit('finishSelect', specPropInfo)
					// 重置数据
					this.initData()
					this.show = !this.show
					
				},
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
</style>
