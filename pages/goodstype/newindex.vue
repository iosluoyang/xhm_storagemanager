<template>
	<view class="goodstypeview">
		
		<!-- 自定义导航栏 -->
		<view class="customnav" :style="[{height:CustomBar + 'px'}]">
			
			<view class="fixed cu-bar search bg-gradual-red" :style="[{height: CustomBar + 'px',paddingTop: StatusBar + 'px', minHeight: CustomBar + 'px'}]">
				
				<view class="action" @tap.stop="pageBack">
					<text class="cuIcon-back"></text>
				</view>
				
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input :adjust-position="false" type="text" :placeholder="i18n.tip.searchtype" v-model="searchText" confirm-type="search"></input>
				</view>
			</view>
			
		</view>
		
		<!-- 左右两侧垂直滚动区域 -->
		<view class="VerticalBox flex" :style="{height: `calc(100vh - ${CustomBar}px - 10px` }">
			
			<!-- 左侧滚动区域 -->
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="NavScrollTop" style="height: 100%;">
				
				<!-- 正常的一级分类 -->
				<view v-for="(typeinfo,index) in typelist" :key="index" 
					:class="[ index === navCurIndex ?'text-red cur':'', 'cu-item' ]" 
					@tap.stop="navTap"
					:data-index="index">
					<view class="text-cut text-sm">{{ typeinfo.typeName }}</view>
				 </view>
				
				<!-- 添加分类的按钮 -->
				<view class="cu-item">
					<view class="addbtn text-xxl">
						<text class="cuIcon cuIcon-add text-bold" @tap.stop="startaddgoodstype()"></text>
					</view>
				</view>
			</scroll-view>
			
			<!-- 右侧滚动区域 -->
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height: 100%;"
				:scroll-into-view="'main-'+mainCurIndex"
				@scroll="ScrollMainView">
				
				<view class="padding-top padding-lr" v-for="(typeinfo,index) in typelist" :key="index" :id=" 'main-' + index ">
					
					<!-- 标题头 -->
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-red"></text>
							<text>{{ typeinfo.typeName }}</text>
						</view>
						<view class="action" v-if="typeinfo.sysFlag === 0">
							<button class="cu-btn bg-grey round cuIcon cuIcon-edit margin-right-sm" @tap.stop="starteditgoodstype(index, null)"></button>
							<button class="cu-btn bg-red round cuIcon cuIcon-delete" @tap.stop="delgoodstype(index, null)"></button>
						</view>
					</view>
					
					<!-- 附属的二级分类 -->
					<view class="cu-list menu-avatar">
						
						<view class="cu-item" :class="modalName=='move-box-'+ secondtypeinfo.typeId.toString() && secondtypeinfo.sysFlag === 0?'move-cur':''" 
								v-for="(secondtypeinfo, secondindex) in typeinfo.childList" :key="secondindex"
								@touchstart="ListTouchStart" 
								@touchmove="ListTouchMove" 
								@touchend="ListTouchEnd"
								@tap.stop="jumptogoodslist(typeinfo.typeId, secondtypeinfo.typeId)"
								:data-target="'move-box-' + secondtypeinfo.typeId.toString()">
								
							<view class="cu-avatar round lg secondtypeimgview"></view>
							
							<view class="content text-cut" style="width: calc(100% - 48px - 30px - 10px)">
								
								<view class="text-black text-light">{{ secondtypeinfo.typeName }}</view>
								<view class="text-cut text-grey padding-left-sm padding-right-sm bg-gray radius" @longpress="showtypedes(secondtypeinfo)">{{ secondtypeinfo.remark }}</view>
							
							</view>
							
							<view class="move">
								<view class="bg-grey" @tap.stop="starteditgoodstype(index, secondindex)">{{ i18n.base.edit }}</view>
								<view class="bg-red" @tap.stop="delgoodstype(index, secondindex)">{{ i18n.base.del }}</view>
							</view>
							
						</view>
						
						<!-- 给最后增加一个添加的按钮 -->
						<view class="cu-item text-black text-xxl" style="justify-content: center;" @tap.stop="startaddgoodstype(typeinfo)">
							<text class="cuIcon cuIcon-add text-bold"></text>
						</view>
					
					</view>
				
				</view>
			</scroll-view>
		
		</view>
		
		<!-- 增加或者编辑分类弹出框 -->
		<view class="cu-modal" :class="ifshowmodal?'show':''">
			<view class="cu-dialog">
				
				<view class="cu-bar bg-white">
					<view class="content">{{ optiontype === 'add' ? i18n.goodstype.addtype : i18n.goodstype.edittype }}</view>
				</view>
				<view class="padding-xl text-left">
					<view class="cu-form-group">
						<view class="title">{{i18n.goodstype.addtypenametitle}}</view>
						<input :placeholder="i18n.goodstype.addtypenameplaceholder" maxlength="50" v-model="addedtypeName"></input>
					</view>
					
					<view class="cu-form-group margin-top">
						<textarea maxlength="140" :placeholder="i18n.goodstype.addtypedesplaceholder" v-model="addedtypeRemark"></textarea>
					</view>
					
				</view>
				<view class="cu-bar bg-white flex justify-around">
					<button class="cu-btn round bg-gray text-grey" @tap.stop="ifshowmodal=false">{{i18n.base.cancel}}</button>
					<button class="cu-btn round bg-gradual-red" @tap.stop="confirmModal">{{i18n.base.confirm}}</button>
				</view>
			</view>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifshowloading"></loading>
	</view>
</template>

<script>
	
	import _ from 'lodash'
	var _this
	var distanceNum = 50 // 滑动cell的判断距离
	
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				searchText: '', // 搜索文本
				
				typelist: [], // 分类数据列表
				navCurIndex: 0,
				mainCurIndex: 0,
				NavScrollTop: 0, // 左侧导航区域滑动距离
				calculatescrollview: true, // 是否计算右侧滑动内容区域的数值
				
				optiontype: '', // 操作类型 add为新增分类  edit为编辑分类
				ifshowmodal: false, // 是否显示新增或者编辑的弹出框
				temptypeinfo: null, // 当前临时的分类数据
				addedtypeName: '', // 临时分类名称
				addedtypeRemark: '', // 临时分类描述
				
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,

				
			};
		},
		
		watch: {
			// 监听搜索文字的变更
			searchText(searchText) {
				this.searchgoodstype(searchText)
			},
		},
		
		onLoad() {
			
			_this = this

			// 加载分类数据
			this.loadgoodstypelist()
			
		},
		methods: {
			
			// 导航栏返回
			pageBack() {
				uni.navigateBack({
					delta:1
				})
			},
			
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
					
					
				}).catch(error => {
					
					this.ifshowloading = false // 隐藏加载条
					
					// 获取分类失败
					uni.showToast({
						title: this.i18n.error.getgoodstypeerror,
						icon: 'none'
					});
				})
				
			},
			
			// 开始搜索

			searchgoodstype: _.debounce(function(searchtext){
				
				console.log(`当前搜索文本是:${searchtext}`);
				
				let firstindex, secondindex
				
				// 开始搜索 由于考虑到一级分类不多 故搜索文本参考依据为二级分类的内容筛选
				let findfirst = _this.typelist.some((firsttypeinfo, firsttypeindex) => {
					if(firsttypeinfo.typeName.indexOf(searchtext) > -1) firstindex = firsttypeindex
					return firsttypeinfo.typeName.indexOf(searchtext) > -1
				})
				// 找到了匹配的一级分类
				
				if(findfirst) {
					_this.NavScrollTop = (firstindex - 1) * 50
					_this.navCurIndex = firstindex
					_this.mainCurIndex = firstindex
				}
				// 找不到一级分类的名称匹配 则开始匹配二级分类名称
				else {
					let findsecond = _this.typelist.some((firsttypeinfo, firsttypeindex) => {
						if(firsttypeinfo.childList && firsttypeinfo.childList.length > -1) {
							return firsttypeinfo.childList.some((secondtypeinfo, secondtypeindex) => {
								// 找到有匹配的
								if(secondtypeinfo.typeName.indexOf(searchtext) > -1) {
									firstindex = firsttypeindex
									secondindex = secondtypeindex
								}
								return secondtypeinfo.typeName.indexOf(searchtext) > -1
							})
						}
						else {
							return false
						}
					})
					
					// 找到了匹配的二级分类
					if(findsecond) {
						// 将该二级分类对应的一级分类赋值
						_this.NavScrollTop = (firstindex - 1) * 50
						_this.navCurIndex = firstindex
						_this.mainCurIndex = firstindex
					}
					// 找不到匹配的二级分类
					else{
						// 不做任何操作
					}
				}
				
			}, 300),
			
			// 点击左侧导航区域
			navTap(e) {
				
				let navindex = e.currentTarget.dataset.index
				
				this.NavScrollTop = (navindex - 1) * 50
				this.navCurIndex = navindex
				this.mainCurIndex = navindex
			},
			
			// 滑动右侧内容区域
			ScrollMainView(e) {
				// #ifdef MP-ALIPAY
				   return false  //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				
				if (this.calculatescrollview) {
					// 计算内容区域每一个view的top和bottom
					this.calculateeachmainviewposition()
					this.calculatescrollview = false // 计算完一次之后就不再进行计算 否则影响性能
				}
				
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.typelist.length; i++) {
					if (scrollTop > this.typelist[i].top && scrollTop < this.typelist[i].bottom) {
						
						this.NavScrollTop = (i-1) * 50
						this.navCurIndex = i
						return false
					}
				}
			},
			
			// 计算内容区域每一个view的top和bottom
			calculateeachmainviewposition() {
				
				let tabHeight = 0;
				// 给内容区域每一个view增加top和bottom
				for (let i = 0; i < this.typelist.length; i++) {
					let view = uni.createSelectorQuery().select("#main-" + i);
					view.fields({
						size: true
					}, data => {
						this.typelist[i].top = tabHeight;
						tabHeight = tabHeight + data.height;
						this.typelist[i].bottom = tabHeight;
					}).exec();
				}
								
			},
			
			// 点击添加商品分类
			startaddgoodstype(firsttypeinfo) {
				
				this.addedtypeName = ''
				this.addedtypeRemark = ''
				this.temptypeinfo = firsttypeinfo
				
				this.optiontype = 'add'
				this.ifshowmodal = true
				
			},
			
			// 点击编辑商品分类
			starteditgoodstype(firstindex, secondindex) {
				
				console.log(`当前编辑的一级分类索引为:${firstindex}----二级分类索引为:${secondindex}`);
				let temptypeinfo = null // 临时变量
				
				// 有二级索引 代表编辑的是二级分类
				if(secondindex !== null) {
					temptypeinfo = this.typelist[firstindex].childList[secondindex]
					temptypeinfo.selectfirstIndex = firstindex
					temptypeinfo.selectsecondIndex = secondindex
					this.temptypeinfo = temptypeinfo
				}
				// 没有二级索引 代表编辑的是一级分类
				else {
					temptypeinfo = this.typelist[firstindex]
					temptypeinfo.selectfirstIndex = firstindex
					this.temptypeinfo = temptypeinfo
				}
				this.addedtypeName = this.temptypeinfo.typeName
				this.addedtypeRemark = this.temptypeinfo.remark
				
				// 显示弹框
				this.optiontype = 'edit'
				this.ifshowmodal = true
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
					let parentId = this.temptypeinfo ? this.temptypeinfo.typeId : 0 // 有临时分类变量则为增加二级分类 取当前所属一级分类的id 否则为0 代表新增一级分类
					this.addgoodstype(parentId)
				}
				// 编辑操作
				else if(this.optiontype === 'edit') {
					let selfinfo = this.temptypeinfo
					this.editgoodstype(selfinfo)
				}
				
			},
			
			// 添加分类
			addgoodstype(parentId) {
				
				// 开始上送数据
				let data = {
					typeName: this.addedtypeName,
					remark: this.addedtypeRemark,
					parentId: parentId
				}
				
				this.$api.goodsapi.addtype(data).then(response => {
					// 添加成功
					uni.$emit('updategoodstype') // 发送更新事件
					
					// 获取添加的分类id
					let addtypeid = response.data.typeId
					
					// 获取添加分类下的默认分类(只有添加一级分类后才有值)
					let subtypeinfo = response.data.subTypeInfo
					// 将默认添加的二级分类的名称更换为国际化的名称
					if(subtypeinfo) {
						subtypeinfo.typeName = _this.i18n.base[subtypeinfo.typeName]
					}
					
					// 新增分类的数据
					let newtypedata = {
						typeId: addtypeid,
						typeName: data.typeName,
						remark: data.remark,
						sysFlag: 0, // 是否是系统分类 默认为否
						childList: subtypeinfo ? [subtypeinfo] : [] // 有返回的subtypeinfo的说明后面需要增加他的子分类
					}
					
					// 代表添加的是一级分类 添加到最后一个分类(其他分类的前面) 然后再自动帮用户创建一个该一级分类下面的子分类
					if(data.parentId === 0) {
						this.typelist.splice(-1, 0, newtypedata)
					}
					// 添加的是二级分类 直接添加到父节点的最后面
					else{
						// 找到当前的一级分类
						let firsttypeinfo = this.temptypeinfo
						if(firsttypeinfo) {
							let secondtypelist = firsttypeinfo.childList
							secondtypelist.splice(-1, 0, newtypedata)
						}
					}
					
					// 隐藏弹出框  清空临时变量
					this.addedtypeName = ''
					this.addedtypeRemark = ''
					this.temptypeinfo = null
					this.ifshowmodal = false
					
					// 渲染完之后重新计算右侧内容区域的滑动高度
					this.$nextTick(function(){
						this.calculateeachmainviewposition()
					})
					
				}).catch(error => {
					// 添加失败
					uni.showToast({
						title: this.i18n.error.adderror,
						icon: 'none',
					});
				})
				
			},
			
			// 编辑分类
			editgoodstype(selfinfo) {
				
				// 开始上送数据
				let data = {
					typeName: this.addedtypeName,
					remark: this.addedtypeRemark,
					typeId: selfinfo.typeId
				}
				
				this.$api.goodsapi.updatetype(data).then(response => {
					// 添加成功
					uni.$emit('updategoodstype') // 发送更新事件
				
					let firsttypeindex = selfinfo.selectfirstIndex
					let secondtypeindex = selfinfo.selectsecondIndex
					
					// 编辑的是二级分类
					if(secondtypeindex === 0 || secondtypeindex) {
						// 找到对应的一级分类
						let firsttypeinfo = this.typelist[firsttypeindex]
						// 找到对应的二级分类
						let secondtypeinfo = firsttypeinfo.childList[secondtypeindex]
						secondtypeinfo = {...secondtypeinfo, ...data}
						// 更新数据(注意此处数据的强制更新)
						this.$set(firsttypeinfo.childList, secondtypeindex, secondtypeinfo)
						this.$set(this.typelist, firsttypeindex, firsttypeinfo)
					}
					// 编辑的是一级分类
					else{
						// 找到对应的一级分类
						let firsttypeinfo = this.typelist[firsttypeindex]
						// 更新数据
						firsttypeinfo = {...firsttypeinfo, ...data}
						this.$set(this.typelist, firsttypeindex, firsttypeinfo)
					}
					
					// 隐藏弹出框  清空临时变量
					this.addedtypeName = ''
					this.addedtypeRemark = ''
					this.temptypeinfo = null
					this.ifshowmodal = false
					
				}).catch(error => {
					// 添加失败
					uni.showToast({
						title: this.i18n.error.fixerror,
						icon: 'none',
					});
				})
				
			},
			
			// 删除分类
			delgoodstype(firstindex, secondindex) {
				
				console.log(`当前删除的一级分类索引为:${firstindex}----二级分类索引为:${secondindex}`);
				
				let deltypeinfo = null
				// 有二级索引 代表删除的是二级分类
				if(secondindex === 0 || secondindex) {
					deltypeinfo = this.typelist[firstindex].childList[secondindex]
				}
				// 没有二级索引 代表删除的是一级分类
				else {
					deltypeinfo = this.typelist[firstindex]
				}
				
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
							
							this.$api.goodsapi.deletetype({typeId: deltypeinfo.typeId}).then(response => {
								// 删除成功
								uni.$emit('updategoodstype') // 发送更新事件
								
								// 删除的是二级分类
								if(secondindex === 0 || secondindex) {
									// 找到对应的一级分类
									let firsttypeinfo = this.typelist[firstindex]
									// 更新数据(注意此处数据的强制更新)
									firsttypeinfo.childList.splice(secondindex, 1)
									// this.$set(this.typelist, firstindex, firsttypeinfo)
								}
								// 删除的是一级分类
								else{
									this.typelist.splice(firstindex, 1)
								}
								
								// 渲染完之后重新计算右侧内容区域的滑动高度
								this.$nextTick(function(){
									this.calculateeachmainviewposition()
								})
								
								
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
			
			// 查看分类描述
			showtypedes(typeinfo) {
				uni.showModal({
					title: typeinfo.typeName,
					content: typeinfo.remark,
					showCancel: false,
					cancelText: '',
					confirmText: this.i18n.base.confirm
				});
			},
			
			// 点击跳转特定的商品列表页
			jumptogoodslist(firstTypeId, secondTypeId) {
				uni.navigateTo({
					url: `/pages/goods/goodslist?firstTypeId=${firstTypeId}&secondTypeId=${secondTypeId}`
				})
			},
			
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				let curmovepointX = e.touches[0].pageX
				let earlymovepointX = this.listTouchStart
				let distance = Math.abs(curmovepointX - earlymovepointX)
				
				// 根据滑动的距离判断滑动方向
				let listTouchDirection = 'not move'
				if(curmovepointX < earlymovepointX && distance > distanceNum) {
					listTouchDirection = 'left'
				}
				else if(curmovepointX > earlymovepointX && distance > distanceNum) {
					listTouchDirection = 'right'
				}
				
				this.listTouchDirection = listTouchDirection
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} 
				else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>
	
	page{
		padding-top: 5px;
	}
	
	.VerticalBox{
		
		.VerticalNav {
			
			width: 200upx;
			white-space: initial;
			
			.cu-item{
				width: 100%;
				text-align: center;
				background-color: #fff;
				margin: 0;
				border: none;
				height: 50px;
				position: relative;
				
				&.cur{
						
					&::after{
						
						content: "";
						width: 8upx;
						height: 30upx;
						border-radius: 10upx 0 0 10upx;
						position: absolute;
						background-color: currentColor;
						top: 0;
						right: 0upx;
						bottom: 0;
						margin: auto;
						
					}
				}
			}
		
		}
		
		.VerticalMain {
			background-color: #F1F1F1;
			flex: 1;
			
			.secondtypeimgview{
				background-image: url('~@/static/publicicon/logo.png');
			}
			
		}
		
	}
	
	
</style>
