<!-- 某个商品的选中规格表格展示 -->
<template>
	
	<view v-if="eachproduct" class="wishproducttable comcontent">
		
		<!-- 表格组件 -->
		<u-table class="u-table" fontSize="20" padding="10rpx 0rpx">
			
			<!-- 商品名称 -->
			<template v-if="ifShowTitle">
				
				<u-tr class="u-tr">
					<!-- 编辑规格按钮  type=quotation时存在 -->
					<u-th v-if="type == 'quotation'" class="u-th" width="200rpx">
						<text class="cuIcon cuIcon-order" @tap.stop="startToChangeSpec"></text>
					</u-th>
					
					<u-th class="u-th">
						{{ `${eachproduct.title}${eachproduct.aliasName ? `——(${eachproduct.aliasName})` : '' }` }}
					</u-th>
				</u-tr>
			
			</template>
			
			<!-- 规格 -->
			<template v-if="ifShowSpec">
				
				<!-- 表格数据 按照选中的一级属性列表 -->
				<u-tr class="u-tr" v-for="(firstSpec,firstSpecIndex) in getFirstSpecRowData(eachproduct)" :key="firstSpecIndex">
					
					<!-- 一级属性相关 -->
					<u-td class="u-td" width="200rpx">
						<view class="attribute1view flex flex-direction align-center">
							
							<u-image width="60" height="60" mode="aspectFill" :src="getFirstSpecImgSrc(eachproduct, firstSpec)"></u-image>
							<text class="text-bold text-black">{{ firstSpec.propVal }}</text>
							<text class="text-red margin-top-sm">{{ `共${getFirstSpecSelectAmount(firstSpec)}个` }}</text>
							
						</view>
					</u-td>
					
					<!-- 二级属性相关 -->
					<u-td class="u-td">
						<u-tr class="u-tr" v-if="secondSpec.amount > 0" v-for="(secondSpec,secondSpecIndex) in firstSpec.specStockList" :key="secondSpecIndex">
							
							<!-- 二级属性名称 -->
							<u-td class="u-td">
								<text class="text-sm">{{ secondSpec.propVal }}</text>
							</u-td>
							
							<!-- 二级属性价格 -->
							<u-td class="u-td">
								<text class="text-sm">{{ secondSpec.price }}</text>
							</u-td>
							
							<!-- 二级属性数量 -->
							<u-td class="u-td">
								<text class="text-sm">{{ secondSpec.amount }}</text>
							</u-td>
							
						</u-tr>
					</u-td>
					
				</u-tr>
				
			</template>
			
			<!-- 备注 -->
			<template v-if="ifShowRemark">
				<u-tr v-if="eachproduct.remark" class="u-tr">
					<u-td class="u-td" width="200rpx">
						<text class="text-bold">{{ i18n.wishlist.common.remark }}</text>
					</u-td>
					<u-td class="u-td">{{ eachproduct.remark }}</u-td>
				</u-tr>
			</template>
			
		</u-table>
		
		<!-- 多规格弹框 编辑状态存在 -->
		<proSpecSelector v-if="eachproduct"
							:productInfo="eachproduct" 
							specInfoName="selectSpecPropInfo"
							:ifshow.sync="showSelector"
							@finishSelect="specFinishSelect">
		</proSpecSelector>
		
	</view>
	
</template>

<script>
	import proSpecSelector from '@/components/base/prospecselector.vue'; // 多规格选择器
	
	
	export default {
		
			name:'wishproducttable',
			
			components:{
				proSpecSelector,
			},
			
			props: {
				
				// 商品表格类型  normal为正常展示样式  quotation为报价单样式
				type: {
					type: String,
					default: "normal",
				},
				
				// 商品数据
				productInfo: {
					type: Object,
					default: null
				},
				
				// 是否显示标题
				ifShowTitle: {
					type: Boolean,
					default: true
				},
				
				// 是否显示规格
				ifShowSpec: {
					type: Boolean,
					default: true
				},
				
				// 是否显示备注
				ifShowRemark: {
					type: Boolean,
					default: true
				},

			},
			
			data() {
				return {
					
					eachproduct: null, // 自身的商品数据
					showSelector: false, // 是否显示规格选择器
					specPropInfo: null, // 规格选择器数据
				}
			},
			
			computed: {
				
			
			},
			
			created() {
				// this.eachproduct = {...this.productInfo}
				this.eachproduct = this.productInfo
			},
			
			methods: {
	
				// 获取一级分类的展示图片链接
				getFirstSpecImgSrc(eachproduct, firstSpec) {
					let proMainImg = eachproduct.imgs.split(',')[0]
					let firstImg = firstSpec.img || proMainImg // 默认一级分类图片
					if(Array.isArray(firstSpec.img)) {
						firstImg = firstSpec.img.length > 0 && firstSpec.img[0] ? firstSpec.img[0] : proMainImg
					}
					
					return firstImg
					
				},
				
				// 获取商品选中规格的表格展示行数据
				getFirstSpecRowData(eachproduct) {
					
					let newPropValList = []
					let propValList = eachproduct.selectSpecPropInfo.propValList
					
					propValList.forEach(firstspec => {
						// 过滤一级属性下的所有未选择数量的二级属性
						let selectSpecStockList = firstspec.specStockList.filter(secondspec => (secondspec.amount > 0))
						// 如果二级属性选中的为0则说明该一级属性未选中
						if(selectSpecStockList.length > 0) {
							let selectFirstSpec = {...firstspec, specStockList: selectSpecStockList}
							newPropValList.push(selectFirstSpec)
						}
					})
					
					console.log(`当前选中规格的一级属性数据为`);
					console.log(newPropValList);
					
					return newPropValList
					
				},
				
				// 获取一级分类的选中数量
				getFirstSpecSelectAmount(firstSpec) {
					let totalAmount = firstSpec.specStockList.reduce((amount, secondSpec) => {
						return secondSpec.amount > 0 ? amount + secondSpec.amount : amount
					}, 0)
					return totalAmount
				},
				
				// 开始修改规格
				startToChangeSpec(eachproduct) {
					// 设置规格选择器数据
					let specPropInfo = eachproduct.selectSpecPropInfo
					this.specPropInfo = specPropInfo
					this.showSelector = true
				},
				
				// 选择完规格
				specFinishSelect(selectSpecPropInfo) {
					console.log(`当前选择完规格的数据为`);
					console.log(selectSpecPropInfo);
					this.$set(this.eachproduct, 'selectSpecPropInfo', selectSpecPropInfo)
				},
				
				
			},
		
	}
	
</script>

<style lang="scss" scope>
	
</style>
