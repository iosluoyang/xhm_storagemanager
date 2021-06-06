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
					<view class="text-df t_twoline">{{ proName }}</view>
					<!-- 价格区域 -->
					<view class="text-price text-red margin-top-sm">
						{{ proPriceRange }}
					</view>
					<!-- 编辑按钮 -->
					<view class="editview margin-top-sm">
						<button class="cu-btn radius bg-blue light" @click=" type = type == 'edit' ? 'normal' : 'edit' "> {{ type == 'edit' ? i18n.base.confirm : i18n.base.edit }} </button>
					</view>
					
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
											<u-number-box v-if=" type == 'normal' " class="margin-bottom-sm" v-model="seconditem.amount" @blur="secondTabCur = secondindex" @change="secondTabCur = secondindex"></u-number-box>
											
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
					type: 'normal', // 当前选择器类型  normal代表正常模式  edit代表编辑模式  默认normal
					
					wishInfo: null, // 心愿详情数据
					
					needTip: true, // 是否需要提示 默认为true
					
					firstTabCur: 0, // 一级属性的选中索引
					secondTabCur: 0, // 二级属性的选中索引
					
					specDataArr: [], // 规格数据数组
					
					proName: '',
					proPriceRange: '',
					
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
					
					if( this.specDataArr &&  this.specDataArr.length > 0) {
						console.log(this.specDataArr);
						console.log(this.firstTabCur);
						let selectimg = this.specDataArr[this.firstTabCur].img
						console.log(selectimg);
						// 如果选择图片为数组则代表是一个属性 此时返回
						if(Array.isArray(selectimg)) {
							return selectimg[this.secondTabCur]
						}
						else {
							return selectimg
						}
					}
					return ''
					
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
				},
				
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
										text: 2,
										// text: this.wishInfo.productExt.pureUrl
									}
								},
								success(res) {
									let productInfo = res.result.data.product
									console.log(`当前的数据信息为`);
									console.log(productInfo);
									
									_this.proName = productInfo.title || wishInfo.productTitle
									_this.proPriceRange = productInfo.priceRange || wishInfo.targetPrice
									
									if(_this.type == 'normal') {
										// 开始设置规格数组数据
										_this.setSpecListData(productInfo)
									}
									
								},
								fail(error) {
									console.log(`当前的数据信息为`);
									console.log(error.message);
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
					
					// 如果选择图片为数组则代表是一个属性
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
