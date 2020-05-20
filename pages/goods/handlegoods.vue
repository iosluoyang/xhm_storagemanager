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
						<view v-if="specs && specs.length > 0" class="text-center text-df margin-bottom">
							<text class="text-df margin-bottom-sm block">{{i18n.goods.handlegoods.tabletip}}</text>
							<text class="text-blue">({{i18n.goods.handlegoods.clonetip}})</text>
						</view>
						<!-- 商品规格table -->
						<goodspectable v-if="specs && specs.length > 0" class="goodstable padding" type="default" :attributeList="attributeList" :specs="specs" @getnewspecs="getnewspecs"></goodspectable>
						
						
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
	import goodspectable from '@/components/base/goodspectable.vue'
	import goodstypepicker from '@/components/base/goodstypepicker.vue'
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import pTable from '@/components/portrait-table/portrait-table.vue'
	
	export default {
		
		components: {
			goodspectable,
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
				newspecs: [], // 最新的商品规格列表(提交数据时使用)
				ifloadingpreview: false, // 是否正在加载预览  默认为否
				
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
					
					// 获取属性数组
					_this.attributeList = product.attributeList
					
					// 获取规格数组
					_this.specs = product.specs
					
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
				
				function addeachattribute() {
					// 往属性数组中加入数据
					let attributeItem = {
						attributeName: '',
						attributeValues: [
							{
								attributeValue: ''
							}
						],
					}
					_this.attributeList.push(attributeItem)
				}
				
				// 如果已经有specs数据的话则新增时候需要进行二次确认
				if(_this.specs && _this.specs.length > 0) {
					uni.showModal({
						content: _this.i18n.tip.resetconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								// 首先删除当前的规格数据
								_this.specs = null
								addeachattribute() // 然后添加属性
							}
						}
					});
				}
				// 没有specs数据 直接添加属性
				else{
					addeachattribute() // 然后添加属性
				}

			},
			
			// 删除商品属性
			deleteAttribute(attributeIndex) {
				
				// 如果已经有specs数据的话则删除时候需要进行二次确认
				if(_this.specs && _this.specs.length > 0) {
					uni.showModal({
						content: _this.i18n.tip.resetconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								// 首先删除当前的规格数据
								_this.specs = null
								_this.newspecs = null
								// 然后删除属性
								_this.attributeList.splice(attributeIndex, 1)
							}
						}
					});
				}
				// 没有的话也进行一次二次删除提示
				else{
					uni.showModal({
						content: _this.i18n.tip.deleteconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								// 开始删除
								_this.attributeList.splice(attributeIndex, 1)
							}
						}
					});
				}
				
			},
			
			// 添加某个商品属性的值
			addAttributeValue(attributeIndex) {
				
				function addattributevalue() {
					// 找到对应的数组  添加属性值
					let attributeItem = {..._this.attributeList[attributeIndex]}
					let attributeValues = attributeItem.attributeValues  // 如: [红色,黄色,蓝色]
					// 即将添加的属性值
					let addattributevalueitem = {
						attributeValue: ''
					}
					attributeValues.push(addattributevalueitem)
					// 强制更新数组
					attributeItem.attributeValues = attributeValues
					_this.$set(_this.attributeList, attributeIndex, attributeItem)
				}
				
				// 如果已经有specs数据的话则删除时候需要进行二次确认
				if(_this.specs && _this.specs.length > 0) {
					uni.showModal({
						content: _this.i18n.tip.resetconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								// 首先删除当前的规格数据
								_this.specs = null
								_this.newspecs = null
								// 然后新增属性值
								addattributevalue()
							}
						}
					});
				}
				// 没有specs数据 直接添加属性值
				else{
					addattributevalue()
				}
				
			},
			
			// 删除某个商品属性的值
			deleteAttributeValue([attributeIndex,attributeValueIndex]) {
				
				function deleteattributevalue() {
					// 找到对应的属性
					let attributeItem = {..._this.attributeList[attributeIndex]}
					let attributeValues = attributeItem.attributeValues
					// 删除对应的属性值
					attributeValues.splice(attributeValueIndex, 1)
					// 强制更新
					_this.$set(_this.attributeList, attributeIndex, attributeItem)
				}
				
				// 如果已经有specs数据的话则删除时候需要进行二次确认
				if(_this.specs && _this.specs.length > 0) {
					uni.showModal({
						content: _this.i18n.tip.resetconfirm,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								// 首先删除当前的规格数据
								_this.specs = null
								_this.newspecs = null
								// 然后删除属性
								deleteattributevalue()
							}
						}
					});
				}
				
				// 如果没有specs 也要进行删除二次确认
				else{
					uni.showModal({
						content: this.i18n.tip.deleteconfirm,
						showCancel: true,
						cancelText: this.i18n.base.cancel,
						confirmText: this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								deleteattributevalue()
							}
						}
					});
				}

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
			
			// 编辑过程中获取最新的specs数据
			getnewspecs(newspecs) {
				this.newspecs = newspecs
			},
			
			// 预览规格数据
			previewspecdata() {
				
				function starttopreview() {
					// 开始预览
					_this.ifloadingpreview = true // 开始预览等待动画
					// 开始获取预览的规格table数据
					_this.getSpecListPromise().then((specList) => {
						// 获取specs数据成功
						_this.ifshowtable = true
						_this.ifloadingpreview = false // 结束预览等待动画
					}).catch(() => {
						_this.ifloadingpreview = false // 结束预览等待动画
					})
				}
				
				// 检查属性数据
				let ifdataready = this.checkAttributeData()
				
				// 数据通过校验
				if(ifdataready) {
					
					// 如果已经有了specs数据代表已经预览过了  则此时进行提示用户
					if(_this.specs && _this.specs.length > 0) {
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
					_this.ifshowtable = false // 隐藏table
					uni.showToast({
						title: _this.i18n.error.lackspec,
						icon: 'none'
					});
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
				
				// 检查商品描述
				if(_this.goodsdes === '') {
					uni.showToast({
						title: _this.i18n.error.lackgoodsdes,
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
					
					// 有商品属性数据  继续检查规格数据 即是否有newspecs数据
					if(_this.newspecs.length === 0) {
						
						// 还未进行预览获取specs数据 此时提示用户进行预览并填写价格等相关信息
						
						uni.showModal({
							content: _this.i18n.tip.lackstocktip,
							showCancel: false,
							confirmText: _this.i18n.base.confirm,
						});
						_this.ifopencollapse = true
						return
						
					}
					else{
						// 进行了预览 有specs数据
						
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
						specs: _this.newspecs
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
