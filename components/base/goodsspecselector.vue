<template>
	
	<!--底部选择层-->
	<view class="prodetailmodal cu-modal bottom-modal" :key="mykey" :class=" ifshowpopup ? 'show' : '' " @tap.stop="hidepopup">
		
		<view class="cu-dialog" v-if="product" @tap.stop="">
			
			<!-- 头部区域 -->
			<view class="cu-bar padding-bottom borderbottom">
				
				<!-- 左侧视图区域 -->
				<view class="action proview margin-top flex">
					
					<!-- 商品主图 -->
					<view v-if="proimg" class="cu-avatar radius xl margin-right-sm" :style="{backgroundImage: 'url('+ proimg +')'} "></view>
					
					<!-- 商品基本信息 -->
					<view class="proinfoview text-left">
						
						<!-- 商品名称 -->
						<view class="proinfotitle text-black text-xl t_twoline margin-bottom-sm">{{product.title}}</view>
						
						<!-- 当前已选规格 -->
						<view class="proinfospec margin-bottom-sm">
							<text class="text-grey text-df">{{`${i18n.goods.goodsdetail.selected}: `}}</text>
							<text class="text-black text-bold text-df" v-if="selectstockinfo">{{ showspecstr }}</text>
						</view>
						
						<!-- 价格信息 -->
						<view class="proinfoprice flex align-center">
							
							<!-- 平台售价 -->
							<view class="sellprice text-df flex align-center margin-right">
								<text class="text-grey">{{ `${i18n.goods.price}: ` }}</text>
								<text class="text-red" v-if="selectstockinfo">{{ selectstockinfo.price }}</text>
							</view>
							
							<!-- 成本价 -->
							<view class="originalprice text-df flex align-center">
								<text class="text-grey">{{ `${i18n.goods.costprice}: ` }}</text>
								<text class="text-grey" v-if="selectstockinfo">{{ selectstockinfo.costPrice }}</text>
							</view>
							
						</view>
						
						
					</view>
					
				</view>
				
				<!-- 右侧关闭按钮 -->
				<view class="action self-start margin-left-sm">
					<text class="cuIcon cuIcon-close" @tap.stop="hidepopup"></text>
				</view>
				
			</view>
			
			<!-- 内容区域 -->
			<scroll-view scroll-y class="content padding text-left">
				
				<!-- 属性列表区域 -->
				<view class="attributesview" v-if="specs">
					
					<view class="eachattributeview" v-for="(nameinfo, nameindex) in specs" :key="nameindex">
						
						<!-- 属性名 -->
						<view class="attributenameview text-black text-lg">{{nameinfo.attributeName}}</view>
						
						<!-- 属性值 -->
						<view class="attributevaluesview flex flex-wrap align-center padding">
							
							<view class="eachvalue cu-btn radius margin-left-sm" v-for="(valueinfo, valueindex) in nameinfo.attributeValues" :key="valueindex"
							:class=" valueinfo.selected ? 'bg-blue' : 'bg-gray' "
							@tap.stop="selectattribute(nameindex,valueindex)">
							
								{{valueinfo.attributeValue}}
								
							</view>
						
						</view>
						
					</view>
					
				</view>
				
			</scroll-view>
			
			<!-- 按钮区域 -->
			<view class="padding bordertop">
				<button class="cu-btn block shadow-blur lg bg-gradual-blue round" :disabled="!selectstockinfo" @tap.stop="confirmselectstockinfo">{{i18n.base.confirm}}</button>
			</view>
			
		</view>
		
	</view>
	
</template>

<script>
	
	var _this
	
	// 拓展数组的contains方法
	Array.prototype.contains = function(obj) {
	  var i = this.length;
	  while (i--) {
	    if (this[i] === obj) {
	      return true;
	    }
	  }
	  return false;
	}
	
	export default {
		name: 'goodsspecselector',
		
		props: {
			
			// 该属性选择器的key值
			mykey: {
				type: [String,Number],
				default: '',
			},
			
			// 当前商品Id 必须
			pid: {
				type: [String, Number],
				default: null,
				required: true
			},
			
			// 默认选中的属性id数组 对象或数组默认值必须从一个工厂函数获取
			defaultselectattributeIds: {
				type: Array,
				default: function() {
					return []
				}
			},
			
			// 是否显示底部弹出框
			ifshowpopup: {
				type: Boolean,
				default: false
			},
			
		},
		
		data() {
			return {
				product: null, // 当前商品的信息
				proimg: null, // 当前的商品图片
				specs: [], // 当前商品的规格数组
				
				}
		},
		
		watch: {
			
			// 默认选中的属性数组发生变化时
			defaultselectattributeIds(newValue, oldValue) {
				console.log(`检测到默认选中规格变更 开始重新计算数据源选中状态`);
				this.getproductdata()
			},
			
			//
			
		},
		
		computed: {
			
			// 当前选中的规格库存信息
			selectstockinfo() {
				
				let selectattributeIdArr = []
				// 首先计算当前已经选择的规格id数组
				this.specs.forEach(nameinfo => {
					if(nameinfo.attributeValues) {
						nameinfo.attributeValues.forEach(valueinfo => {
							if(valueinfo.selected) {
								selectattributeIdArr.push(valueinfo.attributeId)
							}
						})
					}
				})
				
				// 根据当前选中的规格id数组计算出当前所选规格的库存和价格信息
				
				// 遍历当前的库存价格组合
				let selectstockinfo = this.stockinfos.find((stockinfo) => {
					
					// 如果选中的规格数量为0或者数量与当前库存对象对应的属性值数量不一致代表没有匹配 直接返回
					if(selectattributeIdArr.length === 0 || !stockinfo.computeAttributeValues || stockinfo.computeAttributeValues.length === 0 || selectattributeIdArr.length !== stockinfo.computeAttributeValues.length) {
						return false
					}
					else {
						// 数量相等且不为0的时候进行匹配
						// 遍历下属的每一个属性值 只要有一个条件不符合就直接结束查找 返回
						
						// 只要找到其中一个属性不包含在已选择的数组中的则结束查找
						let ifallmatchindex = stockinfo.computeAttributeValues.findIndex((valueinfo,valueindex) => {
							return !selectattributeIdArr.contains(valueinfo.attributeId)
						})
						if(ifallmatchindex !== -1) {
							return false
						}
						// 全部匹配上 返回true
						else{
							return true
						}
						
					}
					
				})
				
				console.log(`当前库存价格对象为:${JSON.stringify(selectstockinfo)}`);
				
				return selectstockinfo
			},
			
			// 当前属性值集合展示文本
			showspecstr() {
				
				// 当前属性值集合展示文本
				let showspecArr = []
				
				let selectstockinfo = this.selectstockinfo
				
				if(selectstockinfo) {
					selectstockinfo.computeAttributeValues.forEach(valueinfo => {
						showspecArr.push(valueinfo.attributeValue)
					})
				}
				let showspecstr = showspecArr.join('、')
				return showspecstr
				
			},
			
			// 当前属性id数组
			selectattributeIds() {
				
				let selectattributeIds = []
				
				let selectstockinfo = this.selectstockinfo
				
				if(selectstockinfo) {
					selectstockinfo.computeAttributeValues.forEach(valueinfo => {
						selectattributeIds.push(valueinfo.attributeId)
					})
				}
				return selectattributeIds
				
			},
			
			//
			
		},
		
		created() {
			_this = this
			
			// 请求当前商品的信息
			_this.getproductdata()
			
		},
		
		methods: {
			
			// 获取商品的信息
			getproductdata() {
				_this.$api.goodsapi.getgoodsdetail({pid:_this.pid}).then(response => {
					// 获取数据成功
					let product = response.data.product
					_this.product = product
					
					let proimg = product.imgs.split(',').length > 0 ? _this.imgUrl + product.imgs.split(',')[0] : null
					_this.proimg = proimg
					
					let specs = product.specs
					
					_this.setmapspecArr(specs) // 处理规格数组 
					
					let stockinfos = product.stockInfos
					_this.stockinfos = stockinfos
					
					// 获取完之后调用一次选中方法
					_this.confirmselectstockinfo()
					
				}).catch(error => {
					// 获取数据失败
				})
				
			},
			
			// 设置当前处理过的规格数组
			setmapspecArr(specsArr) {
				
				let specs = []
				
				if(specsArr && specsArr.length > 0) {
					
					specsArr.forEach((specnameinfo,index) => {
						
						let values = []
						// 遍历二级分类数组
						if(specnameinfo.attributeValues && specnameinfo.attributeValues.length > 0) {
							specnameinfo.attributeValues.forEach((specvalueinfo, index) => {
								
								let selected = _this.defaultselectattributeIds.findIndex((attributeId) => { return parseInt(specvalueinfo.attributeId) === parseInt(attributeId)}) !== -1
								
								let value = {
									attributeId: specvalueinfo.attributeId,
									attributeValue: specvalueinfo.attributeValue,
									selected: selected
								}
								values.push(value)
								
							})
						}
						
						let eachspec = {
							attributeName: specnameinfo.attributeName,
							attributeValues: values
						}
						
						specs.push(eachspec)
						
					})
					
				}
				_this.specs = specs
				
			},
			
			// 选中/取消选中某一个规格
			selectattribute(nameindex,valueindex) {
				
				// 找到对应的属性值
				let myselfspecnameinfo = _this.specs[nameindex]
				let myselfspecnamevalues = myselfspecnameinfo.attributeValues
				let myselfspecvalueinfo = myselfspecnamevalues[valueindex]
				let myselfselected = myselfspecvalueinfo.selected
				
				// 如果是未选中则将同级的全部设置为未选中
				myselfspecnamevalues.forEach((specvalueinfo, index) => {
					if(!myselfselected) {
						specvalueinfo.selected = false
					}
				})
				// 将自己选中状态取反
				myselfspecvalueinfo.selected = !myselfspecvalueinfo.selected
				
				myselfspecnameinfo.attributeValues = myselfspecnamevalues
				_this.$set(_this.specs, nameindex, myselfspecnameinfo)
				
			},
			
			// 确定选中某一个规格
			confirmselectstockinfo() {
				// 当前选中的规格和规格文本
				
				let info = {
					stockinfo: _this.selectstockinfo,
					showspecstr: _this.showspecstr,
					selectattributeIds: _this.selectattributeIds
				}
				this.$emit('confirmselectspecinfo', info)
				this.hidepopup() // 隐藏弹出框
			},
			
			// 隐藏弹出框
			hidepopup() {
				this.$emit('hidepopup')
			},
			
		},
	}
</script>

<style scoped lang="scss">
	
	.prodetailmodal{
		z-index: 888; // 要比uni的toast和modao要小
		
		.cu-dialog{
			border-top-left-radius: 20upx;
			border-top-right-radius: 20upx;
			
			.content{
				min-height: 300upx;
				max-height: 600upx;
			}
		}
	}
	
</style>
