<template>
	<view class="handlegoodsview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue" :isBack="true" isBackConfirm @backPage="backPage">
			<block slot="content">{{ type === 'add' ?  i18n.nav.addgoods : i18n.nav.editgoods }}</block>
		</cu-custom>
		
		<!-- 主视图内容区域 -->
		<view class="contentview">
			
			<!-- 商品主图 -->
			<view class="mainpicview solid-bottom">
				
				<view class="cu-bar bg-white">
					<view class="action text-black">{{i18n.goods.handlegoods.goodspic}}</view>
					<view class="action">{{ `${mainimgArr.length} / ${mainpiclimitnum}` }}</view>
				</view>
				
				<view class="cu-form-group">
					
					<view class="grid col-4 grid-square flex-sub">
						<view class="bg-img" v-for="(item,index) in mainimgArr" :key="index" @tap.stop="previewImg(index)">
						 <image :src="item.path ? item.path : (imgUrl + item) " mode="aspectFill"></image>
							<view class="cu-tag bg-red" @tap.stop="deleteMainImg(index)">
								<text class='cuIcon-close'></text>
							</view>
						</view>
						<view class="solids" @tap.stop="addMainImg" v-if="mainimgArr.length<mainpiclimitnum">
							<text class='cuIcon-cameraadd'></text>
						</view>
					</view>
					
				</view>
			</view>
			
			<!-- 商品基本信息 -->
			
			<!-- 商品标题 -->
			<view class="cu-form-group solid-bottom">
				<view class="title">{{i18n.goods.handlegoods.goodstitle}}</view>
				<input type="text" maxlength="30" v-model="goodstitle" />
			</view>
			
			<!-- 商品标识码 不能输入 只能通过扫码获得 只有在新增状态下显示 -->
			<view v-if="type === 'add' " class="cu-form-group solid-bottom" @tap.stop="scangoods">
				
				<view class="title">{{i18n.goods.handlegoods.goodsbarcode}}</view>
				
				<view class="action">
					<text class="text-df text-grey">{{ goodsbarcode && goodsbarcode !== '' ? goodsbarcode : i18n.tip.pleasescangoodsbarcode }}</text>
					<text class='cuIcon-scan text-blue margin-left'></text>
				</view>
				
			</view>
			
			<!-- 分类选择 -->
			<view class="cu-form-group solid-bottom">
				<view class="title">{{i18n.goods.handlegoods.goodstype}}</view>
				<goodstypepicker :defaultfirstTypeId="firstTypeId" :defaultsecondTypeId="secondTypeId" @selectConfirm="selecttypeconfirm"></goodstypepicker>
			</view>
			
			<!-- 商品规格内容 只有新增商品才显示 -->
			<uni-collapse v-if="type==='add'" class="goodsspecview">
				<uni-collapse-item :open.sync="ifopencollapse" ref="goodsspecitem" :title="i18n.goods.handlegoods.goodsspec" showAnimation>
					
					<!-- 规格内容区域 -->
					<view class="padding-xl bg-gray">
						
						<!-- 规格提示文字 -->
						<view v-if="type==='add'" class="flex align-center margin-bottom-sm">
							<view class="text-black text-bold margin-right">{{i18n.goods.handlegoods.goodsspeclist}}</view>
						</view>
						
						<!-- 属性列表区域 -->
						<view v-if="type==='add'" class="addspecsview flex flex-direction align-center">
							
							<view class="eachspecview bg-white padding-sm radius margin-bottom-sm flex align-center justify-between" v-for="(attributeItem, attributeIndex) in attributeList" :key="attributeIndex">
								
								<!-- 左侧属性名称 -->
								<view class="attributenameview flex-sub padding-sm flex align-center">
									
									<input type="text" class="attributename text-df padding-left-sm padding-right-sm borderCDCDCD radius margin-right-sm" 
											v-model="attributeItem.attributeName" 
											:placeholder="i18n.goods.handlegoods.addspecnameholder"
											confirm-type="next"
											:cursor-spacing="30"
									/>
									<text class="cuIcon cuIcon-delete text-red" @tap.stop="deleteAttribute(attributeIndex)"></text>
								</view>
								
								<!-- 右侧属性值集合 -->
								<view class="attributevaluesview padding-sm flex-sub flex flex-direction">
									
									<view class="eachattributevalueview margin-bottom-sm flex align-center" v-for="(attributeValueItem,attributeValueIndex) in attributeItem.attributeValues" :key="attributeValueIndex">
										
										<!-- 属性值输入框 -->
										<input type="text" class="eachattributevalue text-df padding-left-sm padding-right-sm borderCDCDCD radius margin-right-sm" 
												v-model="attributeValueItem.attributeValue" 
												:placeholder="i18n.goods.handlegoods.addspecvalueholder" 
												confirm-type="next"
												:cursor-spacing="30"
										/>
										<!-- 属性值删除按钮 -->
										<text class="cuIcon cuIcon-delete text-red" @tap.stop="deleteAttributeValue([attributeIndex,attributeValueIndex])"></text>
									</view>
									
									
									<!-- 最后一行为添加属性值按钮 -->
									<button class="cu-btn sm round bg-blue" @tap.stop="addAttributeValue(attributeIndex)">
										<text class="cuIcon-roundaddfill margin-right-sm"></text>
										<text class="text-white">{{i18n.base.add}}</text>
									</button>
									
								</view>
							
							</view>
							
						</view>
						
						<!-- 按钮区域 -->
						<view v-if="type==='add'" class="optionbtnview flex align-center margin-bottom">
							
							<!-- 添加属性按钮 -->
							<button class="flex-sub cu-btn round bg-blue" @tap.stop="addAttribute">
								<text class="cuIcon-roundaddfill margin-right-sm"></text>
								<text class="text-white">{{i18n.goods.handlegoods.addspecname}}</text>
							</button>
							
							<!-- 预览按钮 -->
							<button v-if="attributeList && attributeList.length > 0" class="flex-sub margin-left cu-btn block round bg-cyan" :loading="ifloadingpreview" @tap.stop="previewspecdata">
								<text class="cuIcon-forwardfill margin-right-sm"></text>
								<text class="text-white">{{i18n.base.preview}}</text>
							</button>
							
						</view>
						
						<!-- table的提示文字 -->
						<view v-if="tableData && tableData.length > 0" class="text-center text-df margin-bottom">{{i18n.goods.handlegoods.tabletip}}</view>
						
						<!-- 属性值table区域 -->
						<p-table class="tableview" :tableData="tableData" :title="tableTitleData" @clonetablerowdata="clonetablerowdata" align="center" titleBg="#cdcdcd"></p-table>
						
					
					</view>
				
				</uni-collapse-item>
			</uni-collapse>
			
			<!-- 商品描述 -->
			<view class="goodsdesview solid-bottom">
				
				<view class="cu-bar bg-white">
					<view class="action text-black">{{i18n.goods.handlegoods.goodsdes}}</view>
				</view>
				
				<view class="cu-form-group solid-bottom">
					<textarea maxlength="140" v-model="goodsdes" :placeholder="i18n.goods.handlegoods.goodsdesplaceholder"></textarea>
				</view>
				
			</view>
			
			<!-- 删除商品 -->
			<view v-if="type==='edit'" class="cu-form-group margin-top margin-bottom" @tap.stop="deleteproduct">
				<view class="content text-red">{{ i18n.goods.handlegoods.deletegoods }}</view>
			</view>
			
		</view>
		
		<!-- 按钮区域 -->
		<view class="bottombtnsview padding flex align-center">
			
			<!-- 确定按钮 -->
			<button class="flex-sub cu-btn round bg-blue lg" @tap.stop="confirm" :loading="ifshowloading">
				<text class="text-white">{{i18n.base.confirm}}</text>
			</button>
			
			<!-- 取消按钮 编辑状态下有 -->
			<button v-if=" type === 'edit' " class="flex-sub margin-left cu-btn block round bg-grey lg" @tap.stop="backPage">
				<text class="text-white">{{i18n.base.cancel}}</text>
			</button>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifshowloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	import goodstypepicker from '@/components/base/goodstypepicker.vue'
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import pTable from '@/components/portrait-table/portrait-table.vue'
	
	export default {
		
		components: {
			goodstypepicker,
			uniCollapse,
			uniCollapseItem,
			pTable,
		},
		
		data() {
			return {
				type: 'add', // 页面类型  add新增  edit编辑 默认为新增
				pid: null, // 当前要编辑的商品pid  type为edit时有值
				
				
				mainimgArr: [], // 主图图片数组
				mainpiclimitnum: 5, // 主图上传的数量限制
				goodstitle: '', // 商品标题
				goodsdes: '', // 商品描述
				goodsbarcode: '', // 商品标识码
				firstTypeId: null, // 商品所属的一级分类id
				secondTypeId: null, // 商品所属的二级分类id
				
				
				ifopencollapse: false, // 是否展开商品属性  默认关闭 当提交数据时进行展开
				attributeList: [], // 商品属性列表
				specs: [], // 商品规格列表
				ifloadingpreview: false, // 是否正在加载预览  默认为否
				tableData: [], // 表格数据
				tableTitleData: [], // 表格头数据
				
				ifshowloading: false, // 是否显示正在加载  默认为否
				
			};
		},
		
		onLoad(option) {
			_this = this
			let type = option.type
			this.type = type
			
			//如果是编辑状态则请求商品详情信息
			if(this.type === 'edit') {
				this.pid = option.pid
				this.loaddetaildata()
			}
		},
		
		methods: {
			
			// 返回按钮的二次确认
			backPage() {
				uni.showModal({
					title: _this.i18n.tip.exitconfirm,
					content: _this.i18n.tip.datawillcleartip,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							uni.navigateBack();
						}
					}
				});
			},
			
			// 加载商详信息
			loaddetaildata() {
				
				_this.ifshowloading = true // 开始加载
				
				_this.$api.goodsapi.getgoodsdetail({pid: _this.pid}).then(response => {
					
					_this.ifshowloading = false // 结束加载
					
					// 获取详情成功
					let product = response.data.product
					
					// 组装数据
					
					// 商品主图
					let mainimgArr = product.imgs.split(',')
					_this.mainimgArr = mainimgArr
					
					// 商品标题
					_this.goodstitle = product.title
					
					// 商品描述
					_this.goodsdes = product.productIntro
					
					// 商品标识码
					_this.goodsbarcode = product.barCode
					
					// 商品分类id
					_this.firstTypeId = product.firstTypeId
					_this.secondTypeId = product.subTypeId
					
					// 规格数组
					_this.attributeList = product.specs
					
					// 获取库存数组
					_this.stockInfos = product.stockInfos
					
					// 手动调用一次预览功能 生成tabledata数据
					// 不需要进行预览 因为规定在编辑状态不能修改价格和库存信息
					// _this.previewspecdata()
					
					
				}).catch(error => {
					
					_this.ifshowloading = false // 结束加载
					
					// 获取详情失败
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 选择分类完成
			selecttypeconfirm(selecttypeinfo) {
				let selectfirsttypeid = selecttypeinfo.firstTypeId
				let selectsecondtypeid = selecttypeinfo.secondTypeId
				this.firstTypeId = selectfirsttypeid
				this.secondTypeId = selectsecondtypeid
			},
			
			// 添加商品主图
			addMainImg() {
				// 计算可添加图片的数量
				let canaddnum = _this.mainpiclimitnum - _this.mainimgArr.length
				this.$basejs.chooseImage({
					count: canaddnum,
					success(res) {
						if(res.tempFiles.length > canaddnum) {
							uni.showToast({
								title: _this.i18n.error.chooseimgovererror,
								icon: 'none'
							});
							return
						}
						_this.mainimgArr = _this.mainimgArr.concat(res.tempFiles)
					}
				})
			},
			
			// 查看主图大图
			previewImg(index) {
				// 组装预览图的数据
				let previewimgArr = []
				this.mainimgArr.forEach((imgitem, index) => {
					if(imgitem.path) {
						previewimgArr.push(imgitem.path)
					}
					// 带有标识的图片链接  即为后台返回的图片链接  此时要加上前缀
					else if(imgitem.indexOf(_this.imgTagStr) != -1) {
						previewimgArr.push(_this.imgUrl + imgitem)
					}
					// 未带有标识的图片链接 直接加入预览数组
					else {
						previewimgArr.push(imgitem)
					}
				})
				
				// 开始预览
				uni.previewImage({
					urls: previewimgArr,
					current: index
				})
				
			},
			
			// 删除商品主图
			deleteMainImg(index) {
				// 删除某个商品主图
				this.mainimgArr.splice(index, 1)
			},
			
			// 扫描商品
			scangoods() {
				
				// 开始扫一扫
				this.$basejs.scanQR().then(validcontent => {
					// 扫描成功
					// 反显
					_this.goodsbarcode = validcontent
					
				}).catch((othercontent) => {
					// 扫描的是其他内容 提示暂未发现有效内容
					uni.showModal({
						title: _this.i18n.base.tip,
						content: _this.i18n.error.scanerror,
						showCancel: false,
						confirmText: _this.i18n.base.confirm
					});
				})
			},
			
			// 添加商品属性
			addAttribute() {
				// 往属性数组中加入数据
				let attributeItem = {
					attributeName: '',
					attributeValues: [
						{
							attributeValue: ''
						}
					],
				}
				this.attributeList.push(attributeItem)
			},
			
			// 删除商品属性
			deleteAttribute(attributeIndex) {
				uni.showModal({
					content: this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							this.attributeList.splice(attributeIndex, 1)
						}
					}
				});
			},
			
			// 添加某个商品属性的值
			addAttributeValue(attributeIndex) {
				// 找到对应的数组  添加属性值
				let attributeItem = {...this.attributeList[attributeIndex]}
				let attributeValues = attributeItem.attributeValues  // 如: [红色,黄色,蓝色]
				// 即将添加的属性值
				let addattributevalueitem = {
					attributeValue: ''
				}
				attributeValues.push(addattributevalueitem)
				// 强制更新数组
				attributeItem.attributeValues = attributeValues
				this.$set(this.attributeList, attributeIndex, attributeItem)
			},
			
			// 删除某个商品属性的值
			deleteAttributeValue([attributeIndex,attributeValueIndex]) {
				
				uni.showModal({
					content: this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始删除
							
							// 找到对应的属性
							let attributeItem = {...this.attributeList[attributeIndex]}
							let attributeValues = attributeItem.attributeValues
							// 删除对应的属性值
							attributeValues.splice(attributeValueIndex, 1)
							// 强制更新
							this.$set(this.attributeList, attributeIndex, attributeItem)
						}
					}
				});
				
				
				
			},
			
			// 检查属性数据 返回true或者false 代表是否通过检查
			checkAttributeData() {
				
				// 获取当前规格列表数据
				let attributeList = [...this.attributeList]
				
				// 遍历数据 校验是否缺少字段
				let ifdataready = true // 数据是否完整  默认为完整
				
				// 如果规格数据为空则校验不通过 即商品至少有一个属性
				if(attributeList.length === 0) {
					ifdataready = false
				}
				
				// 终止for循环，使用break
				for (var i=0; i < attributeList.length; i++) {
					
					let attributeItem = attributeList[i]
					
					// 如果没有属性名的值或者没有属性值数组
					if(attributeItem.attributeName === '' || attributeItem.attributeValues.length === 0) {
						ifdataready = false
						break //终止for循环，使用break
					}
					else{
						// 开始遍历该属性下的属性值数组 如果有空的属性值则校验不通过
						let emptyattributeValueItem = attributeItem.attributeValues.find((attributeValueItem, attributeValueIndex) => {
							return attributeValueItem.attributeValue === ''
						})
						// 如果有存在空的属性值的话也结束循环
						if(emptyattributeValueItem) {
							ifdataready = false
							break //终止for循环，使用break
						}
					}
				}
				
				return ifdataready
				
			},
			
			// 获取属性组合之后的规格数据
			getSpecListPromise() {
				
				let promise = new Promise((resolve, reject) => {
					
					// 获取当前规格数据
					let attributeList = [..._this.attributeList]
					
					_this.$api.goodsapi.getprospecs({attributeList}).then(response => {
						
						// 带有属性id的最新属性值列表
						let newattributeList = response.data.attributeList
						_this.attributeList = newattributeList
						// 获取属性组合之后的规格列表
						let specs = response.data.specs // 后台经过笛卡尔积计算出来的规格数组
						_this.specs = specs
						
						resolve(specs)
						
					}).catch(error => {
						// 获取规格列表失败
						uni.showToast({
							title: `${_this.i18n.error.getspecserror}`,
							icon: 'none'
						});
						reject(`${_this.i18n.error.getspecserror}`)
					})
					
				})
				
				return promise
				
			},
			
			// 获取table预览数据
			gettabledata() {
				
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
				
				attributeList.forEach((attributeItem, attributeIndex) => {
					let title = {
						label: attributeItem.attributeName,
						value: attributeItem.attributeName,
						ifclone: false, // 是否可以克隆
					}
					tabletitle.push(title)
				})
				
				// 再增加成本价,平台售价,代理价,授信价以及库存信息
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
				tabletitle.push(costpricetitle, salepricetitle, agentpricetitle, creditpricetitle, stocktitle)
				
				
				// 组装tabledata数据 需要展示的具体数据源
				let tabledata = []
				specs.forEach((specItem, specIndex) => {
					
					let eachtabledata = {}
					
					//首先增加规格索引的值
					eachtabledata['index'] = {
						type: 'string',
						value: (specIndex + 1).toString()
					}
					
					attributeList.forEach((attributeItem, attributeIndex) => {
						
						eachtabledata[attributeItem.attributeName] = {
							type: 'string',
							value: specItem.attributeList[attributeIndex].attributeValue
						}
						
						// eachtabledata[specnameitem.attributeName] = stockinfoitem.computeAttributeValues[specnameindex].attributeValue
					})
					
					// 再增加成本价,平台售价,代理价,授信价以及库存信息
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
						value: _this.type === 'add' ? '' :  stockinfoitem.creditPrice,
						placeholder: _this.i18n.goods.creditprice
					}
					
					eachtabledata['stockCount'] = {
						type: 'input',
						inputtype: 'number',
						value: _this.type === 'add' ? '' :  stockinfoitem.stockCount,
						placeholder: _this.i18n.goods.stock
					}
					
					tabledata.push(eachtabledata)
									
				})
									
				_this.tableTitleData = tabletitle
				_this.tableData = tabledata
				// console.log(`当前获取的tabletitle数据为:${JSON.stringify(_this.tableTitleData)}\n\n获取到的table数据为:${JSON.stringify(_this.tableData)}`);
			},
			
			// 预览库存价格规格table
			previewspecdata() {
				
				function starttopreview() {
					// 开始预览
					_this.ifloadingpreview = true // 开始预览等待动画
					// 开始获取预览的规格table数据
					_this.getSpecListPromise().then((specList) => {
						// 开始获取tabledata数据
						_this.gettabledata()
						// 获取tabledata成功
						_this.ifloadingpreview = false // 结束预览等待动画
					}).catch(() => {
						_this.ifloadingpreview = false // 结束预览等待动画
					})
				}
				
				// 检查属性数据
				let ifdataready = this.checkAttributeData()
				
				// 数据通过校验
				if(ifdataready) {
					
					// 如果已经有了tabledata数据代表已经预览过了  则此时进行提示用户
					if(_this.tableData && _this.tableData.length > 0) {
						uni.showModal({
							content: _this.i18n.tip.resetconfirm,
							showCancel: true,
							cancelText: _this.i18n.base.cancel,
							confirmText: _this.i18n.base.confirm,
							success: res => {
								if(res.confirm) {
									starttopreview()
								}
							}
						});
					}
					else {
						starttopreview()
					}
					
				}
				// 数据未通过校验 报错
				else{
					uni.showToast({
						title: _this.i18n.error.lackspec,
						icon: 'none'
					});
				}
				
			},
			
			// 克隆表格的某项数据
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
			
			// 点击确定
			confirm() {
				
				// 检查通用元素
				
				// 检查商品图片
				if(_this.mainimgArr.length === 0){
					uni.showToast({
						title: _this.i18n.error.lackgoodsmainpic,
						icon: 'none'
					});
					return
				}
				
				// 检查商品标题
				if(_this.goodstitle === '' ){
					uni.showToast({
						title: _this.i18n.error.lackgoodstitle,
						icon: 'none'
					});
					return
				}
				
				// 检查商品标识码
				if(_this.goodsbarcode === '') {
					uni.showToast({
						title: _this.i18n.tip.pleasescangoodsbarcode,
						icon: 'none'
					});
					return
				}
				
				// 检查商品分类
				if(_this.firstTypeId == null || _this.firstTypeId == undefined){
					uni.showToast({
						title: _this.i18n.error.lackgoodstype,
						icon: 'none'
					});
					return
				}
				
				
				// 区分新增还是编辑
				
				// 新增商品
				if(_this.type === 'add') {
					// 检查商品属性数据
					let ifhasattribute = _this.checkAttributeData()
					if(!ifhasattribute) {
						uni.showToast({
							title: _this.i18n.error.lackspec,
							icon: 'none'
						});
						_this.ifopencollapse = true
						return
					}
					
					// 有商品属性数据  继续检查规格数据 即是否有tabledata数据
					if(_this.tableData.length === 0) {
						
						// 还未进行预览获取tabledata数据 此时提示用户进行预览并填写价格等相关信息
						
						uni.showModal({
							content: _this.i18n.tip.lackstocktip,
							showCancel: false,
							confirmText: _this.i18n.base.confirm,
						});
						_this.ifopencollapse = true
						return
						
					}
					else{
						// 进行了预览  有tabledata数据 此时遍历tabledata数据组装数据
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
						_this.specs = newspecs
						
						// 进行后续操作 上传图片
						_this.uploadgoodspic()
					}
					
				}
				// 编辑商品的基本信息
				else if(_this.type === 'edit') {
					// 进行后续操作 上传图片
					_this.uploadgoodspic()
				}
				
			},
			
			// 上传图片
			uploadgoodspic() {
				
				_this.ifshowloading = true // 开始加载
				
				// 区分新增和编辑状态
				if(_this.type === 'add') {
					
					// 开始上送图片
					let mainimgArr = [..._this.mainimgArr]
					
					this.$basejs.uploadmultipleimgs(mainimgArr).then(imgUrls => {
						_this.ifshowloading = false // 停止加载
						
						// 上传图片成功
						let imgs = imgUrls.join(',')
						
						// 最终值提交
						_this.finalconfirm(imgs)

					}).catch(error => {
						_this.ifshowloading = false // 取消加载
						
						// 上传图片失败
						uni.showToast({
							title: this.i18n.error.picuploaderror,
							icon: 'none'
						});
						
					})
					
				}
				else if(_this.type === 'edit') {
					// 编辑状态下
					let needtoindexArr = []
					let needtouploadArr = []
					_this.mainimgArr.forEach((imgitem,index) => {
						// 如果是本地文件则会有path值
						if(imgitem.path) {
							needtoindexArr.push(index)
							needtouploadArr.push(imgitem)
						}
					})
					
					_this.ifshowloading = true // 开始提交加载动画
					
					_this.$basejs.uploadmultipleimgs(needtouploadArr).then(imgUrls => {
						
						_this.ifshowloading = false // 取消加载
						
						// 上传图片成功
						let copymainimgArr = [..._this.mainimgArr]
						imgUrls.forEach((imgUrl, index) => {
							copymainimgArr.splice(needtoindexArr[index], 1, imgUrl)
						})
						let imgs = copymainimgArr.join(',')
						
						// 最终值提交
						_this.finalconfirm(imgs)
					
					}).catch(error => {
						_this.ifshowloading = false // 取消加载
						
						// 上传图片失败
						uni.showToast({
							title: this.i18n.error.picuploaderror,
							icon: 'none'
						});
						
					})
					
					
				}
				
			},
			
			// 最终值提交  imgs有值代表有上传图片
			finalconfirm(imgs) {
				
				_this.ifshowloading = true // 开始提交加载动画
				
				// 如果是新增
				if(_this.type === 'add') {
					
					// 开始提交数据
					let data = {
						title: _this.goodstitle,
						productIntro: _this.goodsdes,
						firstTypeId: _this.firstTypeId,
						subTypeId: _this.secondTypeId,
						barCode: _this.goodsbarcode,
						imgs: imgs,
						attributeList: _this.attributeList,
						specs: _this.specs
					}
					
					_this.$api.goodsapi.addproduct(data).then(response => {
						// 上传商品成功
						_this.ifshowloading = false // 取消加载
						
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'success',
							duration: 1500
						});
						
						// 发送更新事件
						uni.$emit('updateprolist')
						
						setTimeout(function() {
							
							// 操作成功之后如果有上一个页面则返回上一个页面
							let pages = getCurrentPages()
							if(pages.length > 1) {
								uni.navigateBack()
							}
							// 没有重定向到首页
							else {
								uni.reLaunch({
									url: _this.$config.rootrouterpath()
								})
							}
							
						}, 1500);
						
					}).catch(error => {
						// 上传商品失败
						_this.ifshowloading = false // 取消加载
						
						uni.showToast({
							title: _this.i18n.error.uploaderror,
							icon: 'none'
						});
					})
					
				}
				else if(_this.type === 'edit') {
					// 开始提交编辑的数据
					let data = {
						pid: _this.pid,
						title: _this.goodstitle,
						imgs: imgs,
						productIntro: _this.goodsdes,
						firstTypeId: _this.firstTypeId,
						subTypeId: _this.secondTypeId,
						barCode: _this.goodsbarcode,
					}
					_this.$api.goodsapi.editproduct(data).then(response => {
						
						_this.ifshowloading = false // 取消加载
						// 修改成功
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none',
							duration: 1500
						});
						// 发送更新事件
						uni.$emit('updateprolist')
						uni.$emit('updateprodetail')
						
						setTimeout(function() {
							
							// 操作成功之后如果有上一个页面则返回上一个页面
							let pages = getCurrentPages()
							if(pages.length > 1) {
								uni.navigateBack()
							}
							// 没有重定向到首页
							else {
								uni.reLaunch({
									url: _this.$config.rootrouterpath()
								})
							}
							
						}, 1500);
						
					}).catch(error => {
						_this.ifshowloading = false // 取消加载
						// 修改失败
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
					})
					
				}
				
			},
			
			// 删除商品
			deleteproduct() {
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 确定删除
							_this.$api.goodsapi.deleteproduct({pid: _this.pid}).then(response => {
								// 删除成功
								// 发送更新事件
								uni.$emit('updateprolength', {deletepid: _this.pid})
								
								uni.showToast({
									title: _this.i18n.tip.deletesuccess,
									icon: 'none',
									duration: 1500
								});
								
								setTimeout(function() {
									
									// 直接返回前两页
									let pages = getCurrentPages()
									if(pages.length > 2) {
										uni.navigateBack({
											delta: 2
										});
									}
									else {
										uni.reLaunch({
											url: _this.$config.rootrouterpath()
										})
									}
									
								}, 1500);
								
							}).catch(error => {
								// 删除失败
								uni.showToast({
									title: _this.i18n.error.deleteerror,
									icon: 'none'
								});
							})
						}
					},
				})
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>
	page{
		padding-bottom: 130upx;
	}
	.handlegoodsview{
		
		.contentview{
			.cu-form-group .title {
				font-size: 16px;
				font-weight: bold;
			}
			
			/deep/.goodsspecview{
				.uni-collapse-cell__title-text{
					font-size: 16px;
					font-weight: bold;
				}
				
				.input-placeholder{
					color: #aaaaaa;
					padding: 5rpx;
					font-size: 5px;
				}
			}
			
			.mainpicview,.goodsdesview{
				.cu-bar .action{
					&:first-child{
						font-size: 16px;
						font-weight: bold;
					}
				}
			}
		}
		
		/deep/.cu-form-group+.cu-form-group{
			border-top: none;
		}
		/deep/.goodsspecview{
			.uni-collapse-cell__title{
				padding-left: 15px;
				background-color: #FFFFFF;
			}
			
			.addspecsview{
				.eachspecview{
					.specvaluesview{
						border-left: #cdcdcd 1upx solid;
					}
				}
			}
			
			.tableview{
				.firstCol{
					background-color: #cdcdcd;
				}
				.inputitem{
					width: 120upx;
					height: 40upx;
				}
			}
		}
		
		.bottombtnsview{
			position: fixed;
			height: 130upx;
			bottom: 0;
			left: 0;
			right: 0;
			background-color: #f1f1f1;
		}
	}
</style>
