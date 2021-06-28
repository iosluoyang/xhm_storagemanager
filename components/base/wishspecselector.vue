<!-- 心愿单多规格选择器 -->
<template>
	
	<u-popup class="wishspecselectorview" mode="bottom" v-model="show" border-radius="20" closeable z-index="888">
		<view class="contentview">
			
			<!-- 商品区域 -->
			<view class="prospecview padding flex align-center borderbottom">
				
				<!-- 图片 -->
				<image class="specImg margin-right-sm" style="width: 150rpx;height: 150rpx;" :src="specImg" mode="aspectFill" @click="previewImg"></image>
				
				<!-- 商品信息 -->
				<view class="proInfoView" style="max-width: calc(100% - 250rpx)">
					
					<!-- 商品名称 -->
					<view v-if="defaultProTitle" class="text-df t_twoline">{{ defaultProTitle }}</view>
					<!-- 价格区域 -->
					<view v-if="defaultProPrice" class="text-price text-red margin-top-sm">{{ defaultProPrice }}</view>
					
				</view>
				
			</view>
			
			<!-- 规格选择视图 -->
			<view class="realcontentview">
				
				<!-- 一级属性区域 -->
				<scroll-view scroll-x class="bg-white nav padding" scroll-with-animation :scroll-into-view=" `firstScrollView-${firstTabCur}` ">
					<view class="cu-item pos-relative" :class="firstindex==firstTabCur?'text-pink cur':''" v-for="(firstitem,firstindex) in specDataArr" :key="firstindex" :id=" `firstScrollView-${firstindex}` " @tap="firstTabSelect" :data-id="firstindex">
						
						<!-- 区分编辑状态和显示状态 -->
						
						<!-- 显示状态 -->
						<template v-if="type == 'normal'">
							<text >{{ firstitem.name }}</text>
							<u-badge type='warning' absolute :offset="[5,0]" :count="calculatefirstamount(firstitem)" :overflow-count="999"></u-badge>
						</template>
						
						<!-- 编辑状态 注意此处阻止默认时间防止点击 -->
						<view v-if="type == 'edit'" class="flex align-center justify-between">
							<text class="cuIcon cuIcon-copy text-blue" @tap.stop="copyfirst(firstindex)"></text>
							<input class="margin-left-sm margin-right-sm borderCDCDCD radius text-black" :style="{width: '300rpx'}" focus v-model="firstitem.name" placeholder="eg: 颜色/color" type="text" />
							<text class="cuIcon cuIcon-deletefill text-red" @tap.stop="deletefirst(firstindex)"></text>
						</view>
						
					</view>
					
					<!-- 编辑状态下的添加按钮 -->
					<view v-if="type == 'edit'" class="cu-item text-blue">
						<button class="cu-btn round bg-blue light" @click="addfirst">
							<text class="cuIcon cuIcon-add"></text>
							{{ i18n.base.add }}
						</button>
					</view>
					
				</scroll-view>
				
				<!-- 第二属性区域 -->
				<swiper :style="{height: '250px'}" :indicator-dots="false" :autoplay="false" :duration="300" :current="firstTabCur" @animationfinish="swiperAnimationFinish">
					<swiper-item v-for="(firstitem, firstindex) in specDataArr" :key="firstindex">
						<view class="swiper-item height100">
							<scroll-view class="height100" scroll-y>
								
								<!-- 二级属性列表 -->
								<u-cell-group :border="false">
									
									<u-cell-item v-for="(seconditem, secondindex) in firstitem.dataArr" :key="secondindex" :arrow="false" @click="secondTabCur = secondindex" hover-class="none">
										
										<!-- 标题区域 -->
										<view slot="title" class="flex align-center">
											
											<template>
												<!-- 选择标签 -->
												<text v-if="type == 'normal' && seconditem.amount > 0" class="cuIcon cuIcon-roundcheckfill text-pink margin-right-sm"></text>
												
												<template v-if="type == 'edit' ">
													<view class="flex align-center">
														<!-- 拷贝按钮 -->
														<text class="cuIcon cuIcon-copy text-blue margin-right-sm " @tap.stop="copysecond(firstindex,secondindex)"></text>
														<!-- 文件上传组件 -->
														<uni-file-picker v-if="type == 'edit'" v-model="seconditem.img" limit="1"></uni-file-picker>
													</view>
												</template>
												
											</template>
											
											<input :class="[ type == 'edit' ? 'borderCDCDCD radius width50' : 'width100' ]" :disabled="type == 'normal' " type="text" v-model="seconditem.name" placeholder="eg: 大号/Big" />
										
										</view>
										
										<!-- 底部描述区域 -->
										<view slot="label" class="priceview flex align-center">
											
											<text class="text-price text-red margin-right-sm"></text>
											<input class="text-red" :class="[ type == 'edit' ? 'borderCDCDCD radius width50' : 'width100' ]" type="digit" :disabled="type == 'normal'" v-model="seconditem.price"></input>
											
										</view>
										
										<!-- 右侧区域 -->
										<view slot="right-icon">
											<!-- 步进器 -->
											<u-number-box v-if=" type == 'normal' " class="margin-bottom-sm" v-model="seconditem.amount" :max="seconditem.stock" @blur="secondTabCur = secondindex" @change="secondTabCur = secondindex"></u-number-box>
											
											<!-- 库存区域 -->
											<view class="stockview flex align-center">
												<text>库存:</text>
												<input style="width: 100rpx;" :class="[ type == 'edit' ? 'borderCDCDCD radius' : '' ]" type="number" v-model="seconditem.stock" :disabled="type == 'normal'" />
												
												<!-- 编辑状态下的删除按钮 -->
												<text v-if="type == 'edit'" class="cuIcon cuIcon-delete text-red margin-left" @click="deletesecond(firstindex, secondindex)"></text>
												
											</view>
										</view>
										
									</u-cell-item>
									
									<!-- 编辑状态下的添加按钮 -->
									<u-cell-item v-if="type == 'edit'" :arrow="false">
										<button slot="title" class="cu-btn round bg-blue light" @click="addseconde(firstindex)" hover-class="none">
											<text class="cuIcon cuIcon-add"></text>
											{{ i18n.base.add }}
										</button>
									</u-cell-item>
									
								</u-cell-group>
								
							</scroll-view>
						</view>
					</swiper-item>
				</swiper>
				
			</view>
			
			<!-- 总结区域 -->
			<view v-if="type == 'normal'" class="summaryview margin-top flex align-center justify-end padding-right">
				
				<view class="text-bold text-black">{{ `共${totalAmount}件` }}</view>
				
			</view>
			
			<!-- 确定按钮 -->
			<button class="cu-btn bg-gradual-pink block width100 lg margin-top" @tap.stop="confirm">确定</button>
			
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
				
				// 默认商品主图(外部无需传入)
				defaultProImg: {
					type: String,
					default: '/static/publicicon/logo.png'
				},
				
				// 默认商品名称
				defaultProTitle: {
					type: String,
					default: null
				},
				
				// 默认商品价格
				defaultProPrice: {
					type: String,
					default: null
				},
				
				// 规格对象
				specPropInfo: {
					type: Object,
					default: null,
				},
				
				// 心愿id  编辑时有值
				wishId: {
					type: [String, Number],
					default: null
				},
				
				type: {
					type: String,
					default: 'normal', // normal正常选中 edit编辑
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
					
					needTip: true, // 是否需要提示 默认为true
					
					firstTabCur: 0, // 一级属性的选中索引
					secondTabCur: 0, // 二级属性的选中索引
					
					specDataArr: [], // 规格数据数组

				}
			},
			
			computed: {
				
				// 展示的总数量
				totalAmount() {
					
					let totalAmount = this.specDataArr.reduce((total, currentitem) => {
						return Number(total) + Number(currentitem.amount)
					},0)
					
					return totalAmount
					
				},
				
				specImg() {
					
					let defaultProImg = this.defaultProImg
					
					if( this.specDataArr &&  this.specDataArr.length > 0) {

						let selectimg = this.specDataArr[this.firstTabCur].img
						
						// 如果选择图片为数组则代表是仅有一个属性 此时返回当前二级索引下的图片
						if(Array.isArray(selectimg)) {
							return selectimg[this.secondTabCur] || defaultProImg
						}
						else {
							return selectimg || defaultProImg
						}
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
				
				specPropInfo: {
					handler(newValue, oldValue) {
						if(newValue) {
							console.log(`检测到规格数据发生变化`);
							// 组装规格数据
							this.setSpecListData(newValue)
						}
					},
					deep: true,
					immediate: true
				}
				
			},
			
			created() {
				
				_this = this
				
				// 组装规格数据
				
			},
			
			methods: {
				
				// 设置规格数组数据
				setSpecListData(specPropInfo) {
					
					// 一级属性值
					let dataArr = []
					
					// 有二级属性
					if(specPropInfo.secondPropName) {
						
						let firstList = specPropInfo.propValList
						
						firstList.forEach(firstitem => {
							
							// 对应的二级属性数组
							let secondList = firstitem.specStockList
							let tempSecondList = []
							let totalAmount = 0
							secondList.forEach(seconditem => {
								
								let amount = seconditem.amount || 0
								totalAmount += amount
								
								let secondItemInfo = {
									name: seconditem.propVal,
									specId: seconditem.specId,
									amount: amount,
									stock: seconditem.stockCount,
									price: seconditem.price
								}
								tempSecondList.push(secondItemInfo)
							})
							
							
							let firstItemInfo = {
								name: firstitem.propVal,
								img: firstitem.img,
								amount: totalAmount, // 二级分类的所有数量总和
								dataArr: tempSecondList
							}
							
							dataArr.push(firstItemInfo)
							
						})
						
					}
					// 没有二级属性
					else {
						
						// 构造单个属性时的img
						let imgArr = []
						let tempSecondList = []
						let totalAmount = 0
						specPropInfo.propValList.forEach(item => {
							imgArr.push(item.img)
							// 遍历获取二级属性
							// 此处只会有一个元素 因此只会遍历一次
							item.specStockList.forEach(seconditem => {
								
								let amount = seconditem.amount || 0
								totalAmount += amount
								
								let secondItemInfo = {
									name: seconditem.propVal,
									specId: seconditem.specId,
									amount: amount,
									stock: seconditem.stockCount,
									price: seconditem.price
								}
								tempSecondList.push(secondItemInfo)
								
							})
						})
						
						let firstItemInfo = {
							name: specPropInfo.propName,
							img: imgArr,
							amount: totalAmount, // 二级分类的所有数量总和
							dataArr: tempSecondList
						}
						
						dataArr.push(firstItemInfo)
						
					}
					this.specDataArr = dataArr
					
				},
				
				// 显示增加提示
				showaddtip() {
					uni.showModal({
						content: `如果该商品有两个属性则在一级属性处输入属性值内容(如红色或者黄色);\n\n如果仅有一个商品属性则在一级属性处输入属性名称(如颜色),然后在下方二级属性处输入属性值内容(如红色,黄色等)`,
						showCancel: false,
						success: res => {
							this.needTip = false // 提示过之后就不再提示了
							this.addfirst()
						}
					});
				},
				
				// 增加一级属性
				addfirst() {
					
					if(this.needTip) {
						this.showaddtip()
						return
					}
					
					let secondItemInfo = {
						name: '',
						specId: '',
						amount: 0,
						stock: '',
						price: ''
					}
					
					let firstItemInfo = {
						name: '',
						img: this.configData.appLogo,
						amount: 0, // 二级分类的所有数量总和
						dataArr: [secondItemInfo]
					}
					
					this.specDataArr.push(firstItemInfo)
					
					this.firstTabCur = this.specDataArr.length - 1
					this.secondTabCur = 0
					
				},

				// 拷贝一级属性
				copyfirst(firstindex) {
					let selectFirstItem = JSON.parse(JSON.stringify(this.specDataArr[firstindex]))
					// 重置一级属性中的所有二级属性的数量为0
					selectFirstItem.dataArr.forEach(item => { item.amount = 0 })
					
					this.specDataArr.push(selectFirstItem)
					this.firstTabCur = this.specDataArr.length - 1
					this.secondTabCur = 0
					
				},
							
				// 删除一级属性
				deletefirst(firstindex) {
					this.specDataArr.splice(firstindex,1)
					this.firstTabCur = firstindex == 0 ? 0 : firstindex - 1
					this.secondTabCur = 0
				},
				
				// 添加二级属性
				addseconde(firstindex) {
					
					// 找到一级属性对应的二级数组
					let selectFirstItem = this.specDataArr[firstindex]
					let dataArr = selectFirstItem.dataArr
					// 添加二级属性
					let secondItemInfo = {
						name: '',
						specId: '',
						amount: 0,
						stock: '',
						price: ''
					}
					dataArr.push(secondItemInfo)
					
				},
				
				// 拷贝二级属性
				copysecond(firstindex,secondindex) {
					let selectFirstItem = this.specDataArr[firstindex]
					let firstItemDataArr = selectFirstItem.dataArr
					let addSecondItem = {...firstItemDataArr[secondindex], ...{amount: 0}}
					firstItemDataArr.push(addSecondItem)
					selectFirstItem.dataArr = firstItemDataArr
					this.$set(this.specDataArr, firstindex, selectFirstItem)
					
					this.secondTabCur = firstItemDataArr.length - 1
					
				},
				
				// 删除二级属性
				deletesecond(firstindex, secondindex) {
					// 找到一级属性对应的二级数组
					let selectFirstItem = this.specDataArr[firstindex]
					let dataArr = selectFirstItem.dataArr
					dataArr.splice(secondindex, 1)
				},
				
				// 查看图片
				previewImg() {
					
					let imgArr = []
					let selectCurrent = 0
					
					// 如果选择图片为数组则代表是仅有一个属性
					if(Array.isArray(this.specDataArr[this.firstTabCur].img)) {
						imgArr = this.specDataArr[this.firstTabCur].img
						selectCurrent = this.secondTabCur
					}
					else {
						this.specDataArr.forEach(item => {
							imgArr.push(item.img)
						})
						selectCurrent = this.firstTabCur
					}
					
					uni.previewImage({
						urls: imgArr,
						current: selectCurrent
					})
					
				},
				
				// 计算每一个一级属性的总数量
				calculatefirstamount(firstitem) {
					let totalAmount = firstitem.dataArr.reduce((total, currentitem) => {
						return total + Number(currentitem.amount)
					},0)
					firstitem.amount = totalAmount
					return totalAmount
				},
				
				// 切换一级属性
				firstTabSelect(e) {
					let tapIndex = e.currentTarget.dataset.id
					//防止溢出  在数组范围内再进行赋值
					if(tapIndex < this.specDataArr.length) {
						this.firstTabCur = tapIndex
					}
				},
				
				// 切换swiper动画结束
				swiperAnimationFinish(e) {
					let current = e.detail.current	
					//防止溢出  在数组范围内再进行赋值
					if(current < this.specDataArr.length) {
						this.firstTabCur = current
					}
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
							}
							// 正常选择下更新amount数量
							if(this.type == 'normal') {
								secondItemInfo['amount'] = seconditem.amount // 选择数量
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
					
					let globalSpecPropInfo = this.specPropInfo // 规格属性对象
					let specPropInfo = {
						propName: globalSpecPropInfo && globalSpecPropInfo.propName || '第一属性', // 规格属性名称 一级 （颜色）
						secondPropName: globalSpecPropInfo && globalSpecPropInfo.secondPropName || '第二属性',//	规格属性名称 二级(尺码)
						propValList: propValList, //	规格属性名称值列表(一级属性)
					}
					
					return specPropInfo
					
				},
				
				// 确定事件
				confirm() {
					
					// 整理数据
					let specPropInfo = this.getPropInfobyDataArr()
					
					// 如果是编辑状态则保存当前的数据
					if(this.type == 'edit') {
						
						uni.showModal({
							content: this.i18n.tip.optionconfirm,
							showCancel: true,
							cancelText: this.i18n.base.cancel,
							confirmText: this.i18n.base.confirm,
							success: res => {
								if(res.confirm) {
									
									// 更新当前的规格数据
									const db = uniCloud.database();
									db.collection('wishlist')
									.doc(this.wishId)
									.update({specInfo: specPropInfo})
									.then(response => {
										// 更新成功
										uni.showToast({
											title: this.i18n.tip.fixsuccess,
											icon: 'none'
										});
										
										this.$emit('finishUpdate', specPropInfo)
										this.show = !this.show
										
									})
									.catch(error => {
										// 更新失败
										console.log(`更新失败,${JSON.stringify(error.message)}`);
										uni.showToast({
											title: this.i18n.error.fixerror,
											icon: 'none'
										});
									})
									
								}
							}
						});
						
					}
					// 如果是正常状态则为选中
					else if(this.type == 'normal') {
						
						// 判断如果没有选择数量则进行提示
						
						if(this.totalAmount == 0) {
							uni.showToast({
								title: this.i18n.error.lackspec,
								icon: 'none'
							});
							return
						}
						
						this.$emit('finishSelect', specPropInfo)
						this.show = !this.show
						
					}
					
				},
				
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
</style>
