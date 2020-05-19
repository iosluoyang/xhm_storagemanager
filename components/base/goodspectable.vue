<template>
	
	<view class="goodspectableview" v-if="tableData && tableData.length > 0">
		
		<!-- 属性值table区域 -->
		<p-table class="tableview" v-model="tableData" :tableData="tableData" :title="tableTitleData" @clonetablerowdata="clonetablerowdata" align="center" titleBg="#cdcdcd"></p-table>
		
	</view>
	
</template>

<script>
	import pTable from '@/components/portrait-table/portrait-table.vue'
	
	var _this
	export default {
		
			name:'goodspectable',
			
			components:{
				pTable,
				
			},
			
			props: {
				
				// table的类型  default 默认模式 有价格和库存  price 价格模式  stock 库存模式 
				type: {
					type: String,
					default: 'default',
				},
				
				// 商品属性列表
				attributeList: {
					type: Array,
					default: function() {
						return []
					}
				},
				
				// 商品规格列表
				specs: {
					type: Array,
					default: function() {
						return []
					}
				}

			},
			
			data() {
				return {
					
					tableTitleData: [], // tabletitle数组数据
					tableData: [], // tabledata数据
					
				}
			},
			
			watch: {
				
				attributeList: {
					
					handler: function(newValue, oldValue) {
						console.log(`商品属性有变动，重新计算tabledata数据------${JSON.stringify(newValue)}`);
						// 重新计算tabledata数据
						_this.gettabledata()
					},
					deep: true // 深度检测
				},
				
				specs: {
					
					handler: function(newValue, oldValue) {
						console.log(`规格有变动，重新计算tabledata数据------${JSON.stringify(newValue)}`);
						// 重新计算tabledata数据
						_this.gettabledata()
					},
					deep: true // 深度检测
				},
				
				tableData: {
					
					handler(newValue, oldValue) {
						// 调用获取最新的specs方法
						console.log(`检测到tabledata发生变化,此时获取最新的specs数据进行传值同步数据`);
						_this.getnewspecs()
					},
					deep: true
				}
				
			},
			
			created() {
				
				_this = this
				
				// 根据属性列表和规格列表组装table数据
				_this.gettabledata()
				
			},
			
			methods: {
	
				// 获取tabledata数据
				gettabledata() {
					
					// 如果属性或者规格数组为任一项为空则直接返回空数组
					
					let attributeList = this.attributeList
					let specs = this.specs
					
					// 设置table的表头要展示的数据
					let tabletitle = []
					
					// 首先增加索引项
					let indextitle = {
						label: _this.i18n.goods.specindex,
						value: 'index',
						ifclone: false, // 是否可以克隆
					}
					tabletitle.push(indextitle)
					
					// 再增加商品属性的每一项
					attributeList.forEach((attributeItem, attributeIndex) => {
						let title = {
							label: attributeItem.attributeName,
							value: attributeItem.attributeName,
							ifclone: false, // 是否可以克隆
						}
						tabletitle.push(title)
					})
					
					// 最后增加成本价,平台售价,代理价,授信价以及库存信息
					let costpricetitle = {
						label: _this.i18n.goods.costprice,
						value: "costPrice",
						ifclone: true, // 是否可以克隆
					}
					let salepricetitle = {
						label: _this.i18n.goods.price,
						value: "salePrice",
						ifclone: true, // 是否可以克隆
					}
					let agentpricetitle = {
						label: _this.i18n.goods.agentprice,
						value: "agentPrice",
						ifclone: true, // 是否可以克隆
					}
					let creditpricetitle = {
						label: _this.i18n.goods.creditprice,
						value: "creditPrice",
						ifclone: true, // 是否可以克隆
					}
					let stocktitle = {
						label: _this.i18n.goods.stock,
						value: "stockCount",
						ifclone: true, // 是否可以克隆
					}
					
					// 价格模式
					if(this.type === 'price') {
						tabletitle.push(costpricetitle, salepricetitle, agentpricetitle, creditpricetitle)
					}
					// 库存模式
					else if(this.type === 'stock') {
						tabletitle.push(stocktitle)
					}
					// 通用模式
					else if(this.type === 'default') {
						tabletitle.push(costpricetitle, salepricetitle, agentpricetitle, creditpricetitle, stocktitle)
					}

					// 组装tabledata数据 需要展示的具体数据源
					let tabledata = []
					specs.forEach((specItem, specIndex) => {
						
						let eachtabledata = {}
						
						// 首先增加规格索引的值
						eachtabledata['index'] = {
							type: 'string',
							value: (specIndex + 1).toString()
						}
						
						// 然后增加每一个属性对应的值
						attributeList.forEach((attributeItem, attributeIndex) => {
							
							eachtabledata[attributeItem.attributeName] = {
								type: 'string',
								value: specItem.attributeList.length > attributeIndex ? specItem.attributeList[attributeIndex].attributeValue : ''
							}
							
						})
						
						// 最后增加成本价,平台售价,代理价,授信价以及库存信息
						eachtabledata['costPrice'] = {
							type: 'input',
							inputtype: 'digit',
							value: _this.type === 'add' ? '' :  specItem.costPrice,
							placeholder: _this.i18n.goods.costprice
						}
						
						eachtabledata['salePrice'] = {
							type: 'input',
							inputtype: 'digit',
							value: _this.type === 'add' ? '' :  specItem.salePrice,
							placeholder: _this.i18n.goods.price
						}
						
						eachtabledata['agentPrice'] = {
							type: 'input',
							inputtype: 'digit',
							value: _this.type === 'add' ? '' :  specItem.agentPrice,
							placeholder: _this.i18n.goods.agentprice
						}
						
						eachtabledata['creditPrice'] = {
							type: 'input',
							inputtype: 'digit',
							value: _this.type === 'add' ? '' :  specItem.creditPrice,
							placeholder: _this.i18n.goods.creditprice
						}
						
						eachtabledata['stockCount'] = {
							type: 'input',
							inputtype: 'number',
							value: _this.type === 'add' ? '' :  specItem.stockCount,
							placeholder: _this.i18n.goods.stock
						}
						
						tabledata.push(eachtabledata)
										
					})
										
					_this.tableTitleData = tabletitle
					_this.tableData = tabledata
					
				},
				
				// 克隆table的某一行数据
				clonetablerowdata(rowindex) {
					
					// 找到第0个数据条
					let tablecolumndata = _this.tableData[0]
					// 找到该数据的要复制的内容
					// 找到对应的tabletitle的value值(即为tabledata的key值)
					let tablekey = _this.tableTitleData[rowindex].value
					let copydata = tablecolumndata[tablekey]
					// 代表拿到的是输入框  复制其值到该行的所有数据中
					if(copydata.type === 'input') {
						let copyvalue = copydata.value
						
						let newtabledata = [..._this.tableData]
						newtabledata.forEach((eachtabledata,index) => {
							let eachcolumntabledata = eachtabledata[tablekey]
							if(eachcolumntabledata.type === 'input') {
								eachcolumntabledata.value = copyvalue
							}
						})
						_this.tableData = newtabledata
						
					}
				
				},
				
				// 根据当前tabledata组装新的specs数据
				getnewspecs() {
					
					let specs = [..._this.specs]
					let tabledata = [..._this.tableData]
					let newspecs = []
					
					tabledata.forEach((tabledatainfo, tableindex) => {
						let newspecitem = specs[tableindex] // tabledata的数量与specs的数量相等且对应
						
						// 成本价
						let costPrice = tabledatainfo['costPrice'].value || ''
						newspecitem.costPrice = costPrice
						// 平台售价
						let salePrice = tabledatainfo['salePrice'].value || ''
						newspecitem.salePrice = salePrice
						// 代理价
						let agentPrice = tabledatainfo['agentPrice'].value || ''
						newspecitem.agentPrice = agentPrice
						// 授信价
						let creditPrice = tabledatainfo['creditPrice'].value || ''
						newspecitem.creditPrice = creditPrice
						// 库存
						let stockCount = parseInt(tabledatainfo['stockCount'].value) || 0
						newspecitem.stockCount = stockCount
						
						newspecs.push(newspecitem)
						
					})
					
					if(newspecs && newspecs.length > 0) {
						this.$emit('getnewspecs', newspecs)
					}
					
				},
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
	
	.goodspectableview{
		
		background-color: #FFFFFF;
		
		/deep/.tableview{
			.firstCol{
				background-color: #cdcdcd;
			}
			.inputitem{
				width: 120upx;
				height: 40upx;
			}
		}
		
	}
	
	
</style>
