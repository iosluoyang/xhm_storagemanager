<template>
	<view class="goodstypeview">
		
		<!-- 自定义导航栏 -->
		<view class="customnav" :style="[{height:customBarHeight + 'px'}]">
			
			<view class="fixed cu-bar search bg-gradual-red" :style="[{height: customBarHeight + 'px',paddingTop: statusBarHeight + 'px', minHeight: customBarHeight + 'px'}]">
				
				<view class="action" @tap.stop="pageBack">
					<text class="cuIcon-back"></text>
				</view>
				
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" type="text" :placeholder="i18n.tip.searchtype" v-model="searchTypeText" confirm-type="search"></input>
				</view>
				<view class="action">
					
				</view>
			</view>
			
		</view>
		
		<!-- 分类数量统计 -->
		<view class="cu-bar bg-white padding">
			<view class="action">
				<text class="cuIcon-titles text-red"></text>
				<text class="text-xl text-bold">{{`There are ${firsttypenum} Classifications and ${secondtypenum} Subclassifications`}}</text>
			</view>
		</view>
		
		<!-- 商品分类区域 -->
		<ly-tree class="treeview radius"
				:style="{top: customBarHeight + 100 + 'px' }"
				ref="typelisttree"
				:ready="treeisReady"
				:treeStatus="ifedittree?'edit': 'normal'"
				:tree-data="typelist"
				:props="treeprops"
				node-key="typeId"
				:currentNodeKey="currentNodeKey"
				:defaultExpandedKeys="expandedNodekeys"
				:childVisibleForFilterNode="false"
				:filter-node-method="treefiltermethod"
				autoExpandParent
				:showCheckbox="false"
				:showRadio="false"
				highlightCurrent
				accordion
				
				@node-expand="handleNodeExpand" 
				@node-click="handleNodeClick"
				@add-node="handleAddNode"
				@edit-node="handleEditNode"
				@delete-node="handleDeleteNode"
				
		></ly-tree>
		
		<view class="optionview cu-bar btn-group">
			<button class="cu-btn bg-grey shadow-blur lg round" @tap.stop="ifedittree = !ifedittree">{{ifedittree ? i18n.base.confirm : i18n.base.edit}}</button>
			<button class="cu-btn bg-gradual-red shadow-blur lg round" @tap.stop="handleAddNode(null)">{{i18n.base.add}}</button>
		</view>
		
		<!-- 增加或者编辑分类弹出框 -->
		<view class="cu-modal" :class="ifshowmodal?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<!-- 新增时才显示头部 -->
					<view v-if="optiontype === 'add'" class="content">{{ i18n.goodstype.addtypetitle }}</view>
					<view class="action" @tap="cancelModal">
						<text class="cuIcon-close text-blue"></text>
					</view>
				</view>
				<view class="padding-xl text-left">
					<view class="cu-form-group">
						<view class="title">{{i18n.goodstype.addtypenametitle}}</view>
						<input :placeholder="i18n.goodstype.addtypenameplaceholder" maxlength="20" v-model="addedtypeName"></input>
					</view>
					
					<view class="cu-form-group margin-top">
						<textarea maxlength="140" :placeholder="i18n.goodstype.addtypedesplaceholder" v-model="addedtypeRemark"></textarea>
					</view>
					
				</view>
				<view class="cu-bar bg-white flex justify-around">
					<button class="cu-btn round bg-gray text-grey" @tap="cancelModal">{{i18n.base.cancel}}</button>
					<button class="cu-btn round bg-gradual-red" @tap="confirmModal">{{i18n.base.confirm}}</button>
				</view>
			</view>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifshowloading"></loading>
		
	</view>
</template>

<script>
	
	import LyTree from '@/components/ly-tree/ly-tree.vue'
	import _ from 'lodash'
	var _this;
	
	
	export default {
		
		components: {
			LyTree,
		},
		
		data() {
			return {
				
				ifshowloading: false, // 是否显示加载条
				
				statusBarHeight: this.StatusBar,
				customBarHeight: this.CustomBar,
				
				firsttypenum: '', // 一级分类数量
				secondtypenum: '', // 二级分类数量
				
				ifedittree: false, // 是否正在编辑分类树  默认为否
				searchTypeText: '', // 分类的搜索文本
				treeisReady: false, //为了确保页面加载完成后才去调用load方法，this指向正确
				typelist: null, // 当前分类数据
				currentNodeKey: null, // 当前选中的节点key
				expandedNodekeys: new Array(1), // 当前展开的节点的key数组
				treeprops: {
					label: 'typeName',
					children: 'childList',
				}, // 分类数据数组属性名对象
				ifshowmodal: false, // 是否显示添加弹出框  默认为否
				optiontype: 'add', // 默认的弹框操作类型  为新增  edit为编辑
				tempnodeobj: null, // 临时节点数据  即将增加的节点或者删除的节点
				addedtypeName: '', // 当前新增分类的名称
				addedtypeRemark: '', // 当前新增分类的描述
				
			};
		},
		
		onLoad() {
			
			_this = this
			
			// 加载分类数据
			this.loadgoodstypelist()
			
		},
		
		watch: {
			
			// 监听搜索文字的变更
			searchTypeText(searchtext) {
				this.filtertree(searchtext)
			},
			
			// 监听分类数据  计算分类数量
			typelist: {
				handler(newValue, oldValue) {
					
					if(newValue && newValue.length > 0) {
						// 遍历分类 获取对应数量
						let firsttypenum = 0
						let secondtypenum = 0
						
						newValue.forEach((firsttypeinfo, firstindex) => {
							// 全部分类不计入总数
							if(firsttypeinfo.typeId !== -1) {
								firsttypenum += 1
								if(firsttypeinfo.childList && firsttypeinfo.childList.length > 0) {
									firsttypeinfo.childList.forEach((secondtypeinfo, secondindex) => {
										secondtypenum +=1
									})
								}
							}
						})
						
						this.firsttypenum = firsttypenum
						this.secondtypenum = secondtypenum
					}
					
				},
				deep: true,
				immediate: true
			}
		},
		
		methods: {
			
			// 导航栏返回
			pageBack() {
				uni.navigateBack({
					delta:1
				})
			},
			
			/****************商品分类相关***************/
			
			// 加载商品分类数据
			loadgoodstypelist() {
				
				this.ifshowloading = true // 显示加载条
				
				// 加载分类数据
				this.$api.goodsapi.gettypelist().then(response => {
					
					this.ifshowloading = false // 隐藏加载条
					
					// 获取分类列表成功
					let typelist = response.data.list
					
					let newtypelist = []
					
					// 将系统添加的分类名称找到对应的国际化名称
					typelist.forEach((firsttypeinfo, firstindex) => {
						firsttypeinfo.typeName = firsttypeinfo.sysFlag === 1 ? _this.i18n.base[firsttypeinfo.typeName] : firsttypeinfo.typeName
						if(firsttypeinfo.childList && firsttypeinfo.childList.length > 0) {
							firsttypeinfo.childList.forEach((secondtypeinfo, secondindex) => {
								secondtypeinfo.typeName = secondtypeinfo.sysFlag === 1 ? _this.i18n.base[secondtypeinfo.typeName] : secondtypeinfo.typeName
							})
						}
						newtypelist.push(firsttypeinfo)
					})
					
					_this.typelist = newtypelist
					
					_this.treeisReady = true
					
				}).catch(error => {
					
					this.ifshowloading = false // 隐藏加载条
					
					// 获取分类失败
					uni.showToast({
						title: this.i18n.error.getgoodstypeerror,
						icon: 'none'
					});
				})
				
			},
			
			// 开始过滤节点树 带有函数防抖
			filtertree: _.debounce(function(searchtext){
				_this.$refs.typelisttree.filter(searchtext)
			}, 300),
			
			// 过滤商品分类数据
			treefiltermethod(searchtext, data) {
				if (!searchtext) return true;
				return data.typeName.indexOf(searchtext) !== -1;
			},		
			
			// uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
			handleNodeClick(obj) {
				// console.log(`当前点击的节点数据为:${JSON.stringify(obj)}`);
			},
			handleNodeExpand(obj) {
				// console.log(`当前展开的节点数据为:${JSON.stringify(obj)}`);
			},
			
			// 新增节点树
			handleAddNode(obj) {
				// 有obj说明是添加已有节点的子节点  没有obj说明是添加根节点root的一级分类节点
				this.tempnodeobj = obj
				this.optiontype = 'add' // 操作类型为新增
				this.ifshowmodal = true // 显示弹出框
			},
			
			// 编辑节点树
			handleEditNode(obj) {
				this.tempnodeobj = obj
				console.log(`当前即将编辑的节点数据为:${JSON.stringify(this.tempnodeobj)}`);
				this.optiontype = 'edit' // 操作类型为编辑
				this.ifshowmodal = true // 显示弹出框
				
				// 设置当前的数据
				this.addedtypeName = obj.data.typeName
				this.addedtypeRemark = obj.data.remark || ''
				
			},
			
			// 点击弹出框取消
			cancelModal() {
				// 隐藏弹出框  重置当前树节点
				this.ifshowmodal = false
				this.tempnodeobj = null
				// 如果是编辑状态下则清空原先的数据
				if(this.optiontype === 'edit') {
					this.addedtypeName = ''
					this.addedtypeRemark = ''
				}
				
			},
			
			// 点击弹出框确认
			confirmModal() {
				
				// 校验数据
				let addtypename = this.addedtypeName
				let addtyperemark = this.addedtypeRemark
				if(!addtypename || addtypename === '') {
					uni.showToast({
						title: this.i18n.error.lacktypenameerror,
						icon: 'none',
						duration:1500
					});
					return
				}
				
				// 目前不做分类描述的校验
				// else if(!addtyperemark || addtyperemark === '') {
				// 	uni.showToast({
				// 		title: this.i18n.error.lacktyperemarkerror,
				// 		icon: 'none',
				// 		duration:1500
				// 	});
				// 	return
				// }
				
				// 新增操作
				if(this.optiontype === 'add') {
					let addparentId = this.tempnodeobj && this.tempnodeobj.data.typeId && this.tempnodeobj.data.typeId !== '' ? parseInt(this.tempnodeobj.data.typeId) : 0
					// 开始创建
					_this.starttoAddNode(addtypename, addtyperemark, addparentId)
				}
				// 编辑操作
				else if(this.optiontype === 'edit') {
					// 开始编辑
					_this.starttoEditNode(addtypename, addtyperemark, this.tempnodeobj)
				}
				
				
			},
			
			// 开始创建节点
			starttoAddNode(addtypename, addtyperemark, addparentId) {
				
				// 开始上送数据
				let data = {
					typeName: addtypename,
					remark: addtyperemark,
					parentId: addparentId
				}
				
				this.$api.goodsapi.addtype(data).then(response => {
					// 添加成功
					uni.$emit('updategoodstype') // 发送更新事件
					
					// 隐藏弹出框  清空输入内容
					this.addedtypeName = ''
					this.addedtypeRemark = ''
					this.tempnodeobj = null
					this.ifshowmodal = false
					
					// 获取添加的分类id
					let addtypeid = response.data.typeId
					
					// 获取添加分类下的默认分类(只有添加一级分类后才有值)
					let subtypeinfo = response.data.subTypeInfo
					// 将默认添加的二级分类的名称更换为国际化的名称
					if(subtypeinfo) {
						subtypeinfo.typeName = _this.i18n.base[subtypeinfo.typeName]
					}
					
					// 新增树节点数据
					let treedata = {
						typeId: addtypeid,
						typeName: addtypename,
						sysFlag: 0,
						childList: subtypeinfo ? [subtypeinfo] : [] // 有返回的subtypeinfo的说明后面需要增加他的子分类
					}
					
					// 代表添加的是一级分类 添加到最后一个分类(其他分类的前面) 然后再自动帮用户创建一个该一级分类下面的子分类
					if(data.parentId === 0) {
						this.typelist.splice(-1, 0, treedata)
						this.expandedNodekeys = [treedata.typeId]
					}
					// 添加的是二级分类 直接添加到父节点的最后面
					else{
						this.$refs.typelisttree.append(treedata, data.parentId)
						// 展开当前添加的节点
						this.expandedNodekeys = [data.parentId]
						// this.$set(this.expandedNodekeys, 0, data.parentId)
					}
					
					
				}).catch(error => {
					// 添加失败
					uni.showToast({
						title: this.i18n.error.adderror,
						icon: 'none',
					});
				})
			
			},
			
			// 开始编辑节点
			starttoEditNode(edittypename, edittyperemark, editobj) {
				
				
				let data = {
					typeName: edittypename,
					remark: edittyperemark,
					typeId: editobj.data.typeId
				}
				
				this.$api.goodsapi.updatetype(data).then(response => {
					// 编辑成功
					uni.$emit('updategoodstype') // 发送更新事件
					
					// 隐藏弹出框  清空输入内容
					_this.addedtypeName = ''
					_this.addedtypeRemark = ''
					_this.tempnodeobj = null
					_this.ifshowmodal = false
					
					// 修改之前的数据
					editobj.data.typeName = data.typeName
					editobj.label = data.typeName // 重要！！！ tree组件是要靠lable显示的 所以也要修改label的值
					editobj.data.remark = data.remark
					
				}).catch(error => {
					// 编辑失败
					uni.showToast({
						title: this.i18n.error.fixerror,
						icon: 'none',
					});
				})
			},
			
			// 删除节点树
			handleDeleteNode(obj) {
				
				// 二次确认
				uni.showModal({
					title: this.i18n.tip.deleteconfirm,
					content: this.i18n.tip.deletetypecontent,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 确定删除
			
							this.$api.goodsapi.deletetype({typeId: obj.data.typeId}).then(response => {
								// 删除成功
								uni.$emit('updategoodstype') // 发送更新事件
								
								// 如果是一级节点则直接删除数据源
								if(obj.level === 1) {
									let selectindex = _this.typelist.findIndex((typedic, index) => {
										return typedic.typeId === obj.data.typeId
									})
									if(selectindex > -1) {
										let temptypelist = [..._this.typelist]
										temptypelist.splice(selectindex, 1)
										_this.typelist = temptypelist
										// _this.typelist.splice(selectindex, 1)
									}
								}
								else if(obj.level !== 1) {
									// 使用删除节点方式
									_this.$refs.typelisttree.remove(obj.data)
								}
								
							}).catch(error => {
								// 删除失败
								uni.showToast({
									title: _this.i18n.error.deleteerror,
									icon: 'none'
								});
							})
						}
					}
				});
				
			},
			
		},
		
	}
</script>

<style lang="scss" scoped>
	
	.goodstypeview{
		
		/deep/.treeview{
			position: fixed;
			left: 0;
			right: 0;
			overflow: scroll;
			bottom: 150upx;
			
			.lytree{
				width: 100%;
				height: 100%;
				overflow: scroll;
			}
		}
		
		.optionview{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 30upx;
			
		}
		
		.cu-modal{
			z-index: 66; // 修改modal的z-index  比toast要小
		}
		
	}

</style>
