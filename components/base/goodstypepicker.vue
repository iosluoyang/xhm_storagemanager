<template>
	<picker mode="multiSelector"
			:range="typemultiArray" 
			range-key="typeName" 
			:value="selecttypeIndexArr"
			@columnchange="MultiColumnChange"
			@change="selectType" 
			>
		<view class="picker">
			<view class="pickercontentview flex flex-direction align-end">
				<text class="text-df padding-bottom-sm">{{showtypestr}}</text>
				<text class="text-sm">{{i18n.base.click}}<text class="text-blue text-light margin-lr-sm" @tap.stop="editgoodstype">{{i18n.base.here}}</text>{{i18n.base.toaddmore}}</text>
			</view>
		</view>
	</picker>
</template>

<script>
	var _this
	
	export default {
		name: "goodstypepicker",
		props: {
			
			// 默认选中的一级分类id
			defaultfirstTypeId: {
				type: [String,Number],
			},
			
			// 默认选中的二级分类id
			defaultsecondTypeId: {
				type: [String,Number],
			},
			
			
		},
		
		data() {
			return {
				
				typelist: [], // 商品分类数据
				firstTypeId: this.defaultfirstTypeId, // 默认的一级分类id
				secondTypeId: this.defaultsecondTypeId, // 默认的二级分类id
				typemultiArray: [], // 商品分类多项选择数据源
				selecttypeIndexArr: [0,0], // 选中的商品分类多项选择的索引数组
				showtypestr: '', // 选择的分类名称字符串
				
			}
		},
		
		watch: {
			
			// 当参数的firstTypeId变更的时候重新进行一次数据的计算
			defaultfirstTypeId(newValue, oldValue) {
				this.firstTypeId = newValue
				// 监控数据变更
				_this.watchselecttype()
			},
			
			// 当参数的secondTypeId变更的时候重新进行一次数据的计算
			defaultsecondTypeId(newValue, oldValue) {
				this.secondTypeId = newValue
				// 监控数据变更
				_this.watchselecttype()
			}
			
		},
		
		created() {
			
			_this = this
			
			// 加载分类数据并初始化
			_this.loadtypedata()
			
			// 监控分类数据变更
			uni.$on('updategoodstype',function() {
				// 重新加载数据
				_this.loadtypedata()
			})
			
		},
		
		methods: {
			
			// 加载分类数据并初始化
			loadtypedata() {
				
				// 加载分类数据
				_this.$api.goodsapi.gettypelist().then(response => {
					
					// 获取分类列表成功
					let typelist = response.data.list
					let newtypelist = []
					
					// 过滤掉全部分类 并且将系统添加的分类名称找到对应的国际化名称
					typelist.forEach((firsttypeinfo, firstindex) => {
						firsttypeinfo.typeName = firsttypeinfo.sysFlag === 1 ? _this.i18n.base[firsttypeinfo.typeName] : firsttypeinfo.typeName
						if(firsttypeinfo.childList && firsttypeinfo.childList.length > 0) {
							firsttypeinfo.childList.forEach((secondtypeinfo, secondindex) => {
								secondtypeinfo.typeName = secondtypeinfo.sysFlag === 1 ? _this.i18n.base[secondtypeinfo.typeName] : secondtypeinfo.typeName
							})
						}
						// 过滤掉一级的全部分类
						if(firsttypeinfo.typeId !== -1) {
							newtypelist.push(firsttypeinfo)
						}
						
					})
					
					_this.typelist = newtypelist
					
					// 组装分类选择器的数据源
					_this.settypeselectordata()
					
					
				}).catch(error => {
					// 获取分类失败
					uni.showToast({
						title: _this.i18n.error.getgoodstypeerror,
						icon: 'none'
					});
				})
			
			},
			
			// 循环监控变更所选分类
			watchselecttype() {
				
				// 如果此时还没有分类数据的话那么循环等待有分类数据了之后再进行组装数据的操作
				if(!this.typelist || !this.typelist.length === 0) {
					
					let time = setInterval(function(){
						if(_this.typelist.length > 0) {
							// 组装分类选择器的数据源
							_this.settypeselectordata()
							clearInterval(time)
						}
					}, 1000)
					
				}
				// 直接进行重组数据
				else{
					_this.settypeselectordata()
				}
				
			},
			
			// 组装分类选择器的数据源
			settypeselectordata(){
				
				let firstcolumnArr = []
				let secondcolumnArr = []
				let selecttypeIndexArr = [..._this.selecttypeIndexArr]
				
				// 初始化一级分类的数据源
				_this.typelist.forEach((firsttypeinfo, firstindex) => {
					// 将该一级分类加入到第一列数据源
					firstcolumnArr.push(firsttypeinfo)
				})
				
				// 找到对应的一级分类默认选中项
				let firsttypeinfo =  _this.typelist.find((firsttypeinfo, firstindex) => {
					if(firsttypeinfo.typeId === _this.firstTypeId) {
						selecttypeIndexArr[0] = firstindex
					}
					return firsttypeinfo.typeId === _this.firstTypeId
				})
				
				// 找到对应的一级分类数据源
				if(firsttypeinfo) {
					// 设置二级分类数据源
					secondcolumnArr = firsttypeinfo.childList || []
					let secondinfo =  secondcolumnArr.find((secondtypeinfo, secondindex) => {
						// 找到有对应的索引
						if(secondtypeinfo.typeId === _this.secondTypeId) {
							selecttypeIndexArr[1] = secondindex
						}
						return secondtypeinfo.typeId === _this.secondTypeId
					})
			
					// 找不到有对应的索引  按照原先的默认0
				}
				// 没有找到对应的一级分类数据源  默认选中对应的一级分类下的二级分类数据源
				else{
					let defaultfirstindex = selecttypeIndexArr[0]
					secondcolumnArr = _this.typelist && _this.typelist.length > 0 && _this.typelist[defaultfirstindex] && _this.typelist[defaultfirstindex].childList ? _this.typelist[defaultfirstindex].childList : []
				}
				
				// 组装其二维数组
				let typemultiArray = [firstcolumnArr, secondcolumnArr]
				this.typemultiArray = typemultiArray
				// 设置其默认值
				this.selecttypeIndexArr = selecttypeIndexArr
				// console.log(`默认的二维数组为:${JSON.stringify(typemultiArray)}\n\n\n 默认的选中数组值为:${JSON.stringify(selecttypeIndexArr)}`);
				
				// 根据当前的数据源设置选择分类展示的字样
				this.setchoosetypestr()
				
				// 设置当前的选中分类
				// this.setselectTypeId()
				
			},
			
			// 选择分类的列的值发生变化
			MultiColumnChange(e){
				let column = e.detail.column
				let index = e.detail.value
				// 第一列 代表变更一级分类的数值  找到对应二级分类的数值进行赋值
				if(column === 0) {
					let childList = _this.typelist[index].childList || []
					// 变更当前range的数据源  更换当前的二级分类数据源
					_this.typemultiArray.splice(1, 1, childList)
				}
				// 变更的是第二列二级分类数据源
				else if(column === 1) {
				}
				
				// 变更当前选中的索引数据源
				_this.selecttypeIndexArr.splice(column, 1, index)
			},
			
			// 商品分类选择完成
			selectType(e) {
				
				let selecttypeIndexArr = e.detail.value
				this.selecttypeIndexArr = selecttypeIndexArr
				
				// 设置当前的选中分类  注意这里不能将顺序弄混 否则展示字样会有问题
				this.setselectTypeId()
				
				// 根据当前的数据源设置选择分类展示的字样
				this.setchoosetypestr()
				
			},
			
			// 设置当前的选中分类
			setselectTypeId() {
				
				// 选择完分类之后设置数据
				let selecttypeIndexArr = _this.selecttypeIndexArr
				let firstindex = selecttypeIndexArr[0]
				let firsttypeinfo = _this.typelist[firstindex]
				let firstTypeId = firsttypeinfo.typeId
				_this.firstTypeId = firstTypeId
				
				// 下属存在二级分类
				if(selecttypeIndexArr.length > 1 && selecttypeIndexArr[1] !== null){
					let secondindex = selecttypeIndexArr[1]
					let secondtypeinfo = firsttypeinfo.childList && firsttypeinfo.childList.length > 0 ? firsttypeinfo.childList[secondindex] : null
					_this.secondTypeId = secondtypeinfo ? secondtypeinfo.typeId : ''
				}
				
				let selecttypeIdinfo = {
					firstTypeId: _this.firstTypeId,
					secondTypeId: _this.secondTypeId
				}
				_this.$emit('selectConfirm', selecttypeIdinfo)
				
				// console.log(`当前选择的一级分类id为${this.firstTypeId}----二级分类id为:${this.secondTypeId}`);
			},
			
			// 根据当前的数据源设置选择分类展示的字样
			setchoosetypestr() {
				if(!_this.firstTypeId) {
					_this.showtypestr = _this.i18n.tip.pleaseselectgoodstype
					return
				}
				let firsttypeinfo = _this.typemultiArray[0][_this.selecttypeIndexArr[0]]
				let secondtypeinfo = firsttypeinfo.childList ? firsttypeinfo.childList[_this.selecttypeIndexArr[1]] : null
				let showtypestr = firsttypeinfo.typeName + '/' + (secondtypeinfo ? secondtypeinfo.typeName : '')
				_this.showtypestr = showtypestr
				
				_this.$emit('gettypename', _this.showtypestr)
				
			},
			
			// 点击去编辑商品分类
			editgoodstype() {
				uni.navigateTo({
					url: '/pages/goodstype/newindex'
				});
			},
			
		},
		
	}
</script>

<style scoped lang="scss">
	
	.picker{
		line-height: 30upx !important;
	}
	
</style>
