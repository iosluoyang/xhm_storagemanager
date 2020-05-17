<template>
	
	<!--底部选择层-->
	<view class="prodetailmodal cu-modal bottom-modal" :key="mykey" :class=" ifshowpopup ? 'show' : '' " @tap.stop="hidepopup">
		
		<view class="cu-dialog" v-if="product">
			
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
							<text class="text-black text-bold text-df" v-if="selectspecinfo">{{ showspecstr }}</text>
						</view>
						
						<!-- 价格信息 -->
						<view class="proinfoprice flex align-center">
							
							<!-- 平台售价 -->
							<view class="sellprice text-df flex align-center margin-right">
								<text class="text-grey">{{ `${i18n.goods.price}:` }}</text>
								<text class="text-red margin-left-sm" v-if="selectspecinfo">{{ selectspecinfo.salePrice }}</text>
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
				<view class="attributesview" v-if="attributeList">
					
					<view class="eachattributeview" v-for="(attributeinfo, attributeindex) in attributeList" :key="attributeindex">
						
						<!-- 属性名 -->
						<view class="attributenameview text-black text-lg">{{attributeinfo.attributeName}}</view>
						
						<!-- 属性值 -->
						<view class="attributevaluesview flex flex-wrap align-center padding">
							
							<view class="eachvalue cu-btn radius margin-left-sm" v-for="(attributevalueinfo, attributevalueindex) in attributeinfo.attributeValues" :key="attributevalueindex"
							:class=" attributevalueinfo.selected ? 'bg-blue' : 'bg-gray' "
							@tap.stop="selectattribute(attributeindex,attributevalueindex)">
							
								{{attributevalueinfo.attributeValue}}
								
							</view>
						
						</view>
						
					</view>
					
				</view>
				
			</scroll-view>
			
			<!-- 按钮区域 -->
			<view class="padding bordertop">
				<button class="cu-btn block shadow-blur lg bg-gradual-blue round" :disabled="!selectspecinfo" @tap.stop="confirmselectspec">{{i18n.base.confirm}}</button>
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
				attributeList: [], // 当前商品的属性数组
			}
		},
		
		watch: {
			
			// 默认选中的属性数组发生变化时
			defaultselectattributeIds(newValue, oldValue) {
				console.log(`检测到默认选中规格变更 开始重新计算数据源选中状态`);
				this.getproductspecdata()
			},
			
			//
			
		},
		
		computed: {
			
			// 当前选中的规格信息
			selectspecinfo() {
				
				// 是否有属性列表
				if(this.attributeList.length === 0) {
					return undefined
				}
				else{
					let selectattributeIdArr = []
					// 首先计算当前已经选择的规格id数组
					this.attributeList.forEach(attributeinfo => {
						if(attributeinfo.attributeValues) {
							attributeinfo.attributeValues.forEach(attributevalueinfo => {
								if(attributevalueinfo.selected) {
									selectattributeIdArr.push(attributevalueinfo.attributeId)
								}
							})
						}
					})
					
					// 根据当前选中的规格id数组计算出当前所选规格的信息
					
					// 遍历当前的库存价格组合
					let selectspecinfo = this.specs.find((specinfo) => {
						
						// 如果选中的规格数量为0或者数量与当前规格对象对应的属性值数量不一致代表没有匹配 直接返回
						if(selectattributeIdArr.length === 0 || !specinfo.attributeList || specinfo.attributeList.length === 0 || selectattributeIdArr.length !== specinfo.attributeList.length) {
							return false
						}
						else {
							// 数量相等且不为0的时候进行匹配
							// 遍历下属的每一个属性值 只要有一个条件不符合就直接结束查找 返回
							
							// 只要找到其中一个属性不包含在已选择的数组中的则结束查找
							let ifallmatchindex = specinfo.attributeList.findIndex((attributevalueinfo,valueindex) => {
								return !selectattributeIdArr.contains(attributevalueinfo.attributeId)
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
					
					console.log(`当前库存价格对象为:${JSON.stringify(selectspecinfo)}`);
					
					return selectspecinfo
				}
				
			},
			
			// 当前属性值集合展示文本
			showspecstr() {
				
				// 当前属性值集合展示文本
				let showspecArr = []
				
				let selectspecinfo = this.selectspecinfo
				
				if(selectspecinfo) {
					selectspecinfo.attributeList.forEach(attributevalueinfo => {
						showspecArr.push(attributevalueinfo.attributeValue)
					})
				}
				
				let showspecstr = showspecArr.join('、')
				return showspecstr
				
			},
			
			// 当前属性id数组
			selectattributeIds() {
				
				let selectattributeIds = []
				
				let selectspecinfo = this.selectspecinfo
				
				if(selectspecinfo) {
					selectspecinfo.attributeList.forEach(attributevalueinfo => {
						selectattributeIds.push(attributevalueinfo.attributeId)
					})
				}
				return selectattributeIds
				
			},
			
			//
			
		},
		
		created() {
			_this = this
			
			// 请求当前商品的信息
			_this.getproductspecdata()
			
		},
		
		methods: {
			
			// 获取商品的规格相关信息
			getproductspecdata() {
				_this.$api.goodsapi.getgoodsdetail({pid:_this.pid}).then(response => {
					// 获取数据成功
					let product = response.data.product
					_this.product = product
					
					let proimg = product.imgs.split(',').length > 0 ? _this.imgUrl + product.imgs.split(',')[0] : null
					_this.proimg = proimg
					
					let attributeList = product.attributeList
					
					_this.setmapattributeArr(attributeList) // 处理属性数组 
					
					let specs = product.specs
					_this.specs = specs
					
					// 获取完之后调用一次选中方法
					_this.confirmselectspec()
					
				}).catch(error => {
					// 获取数据失败
				})
				
			},
			
			// 设置当前处理过的属性数组
			setmapattributeArr(attributeList) {
				
				let newattributeList = []
				
				if(attributeList && attributeList.length > 0) {
					
					attributeList.forEach((attributeinfo,index) => {
						
						let values = []
						// 遍历二级分类数组
						if(attributeinfo.attributeValues && attributeinfo.attributeValues.length > 0) {
							attributeinfo.attributeValues.forEach((attributevalueinfo, index) => {
								
								let selected = _this.defaultselectattributeIds.findIndex((attributeId) => { return parseInt(attributevalueinfo.attributeId) === parseInt(attributeId)}) !== -1
								
								let value = {
									attributeId: attributevalueinfo.attributeId,
									attributeValue: attributevalueinfo.attributeValue,
									selected: selected
								}
								values.push(value)
								
							})
						}
						
						let eachattributeinfo = {
							attributeName: attributeinfo.attributeName,
							attributeValues: values
						}
						
						newattributeList.push(eachattributeinfo)
						
					})
					
				}
				_this.attributeList = attributeList
				
			},
			
			// 选中/取消选中某一个规格
			selectattribute(nameindex,valueindex) {
				
				// 找到对应的属性值
				let myselfattributeinfo = _this.attributeList[nameindex]
				let myselfattributevalues = myselfattributeinfo.attributeValues
				let myselfattributevalueinfo = myselfattributevalues[valueindex]
				let myselfselected = myselfattributevalueinfo.selected
				
				// 如果是未选中则将同级的全部设置为未选中
				myselfattributevalues.forEach((specvalueinfo, index) => {
					if(!myselfselected) {
						specvalueinfo.selected = false
					}
				})
				// 将自己选中状态取反
				myselfattributevalueinfo.selected = !myselfattributevalueinfo.selected
				
				myselfattributeinfo.attributeValues = myselfattributevalues
				_this.$set(_this.attributeList, nameindex, myselfattributeinfo)
				
			},
			
			// 确定选中某一个规格
			confirmselectspec() {
				// 当前选中的规格和规格文本
				
				let info = {
					specinfo: _this.selectspecinfo,
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
