<template>
	<view class="workingtimeview">
		
		<cu-custom bgColor="bg-gradual-orange" isBack>
			<block slot="content">{{ i18n.me.panel.workingtime }}</block>
		</cu-custom>
		
		<!-- 开始时间 -->
		<view class="cu-form-group">
			<view class="title">{{ i18n.me.workingtime.starttime }}</view>
			<picker mode="time" :value="starttime" @change="startTimeChange">
				<view class="picker">
					{{starttime}}
				</view>
			</picker>
		</view>
		
		<!-- 结束时间 -->
		<view class="cu-form-group">
			<view class="title">{{i18n.me.workingtime.endtime}}</view>
			<picker mode="time" :value="endtime" @change="endTimeChange">
				<view class="picker">
					{{endtime}}
				</view>
			</picker>
		</view>
		
		<view class="cu-form-group padding arrow flex align-center justify-between" @tap.stop="ifshowmodal=!ifshowmodal">
			<view class="title flex-sub">周期选择</view>
			<view class="text-df text-right flex-sub">
				{{ showrepeatstr }}
			</view>
		</view>
		
		<view class="btn-group margin">
			<button class="cu-btn lg round block bg-gradual-orange shadow-blur" @tap.stop="confirm">{{ i18n.base.confirm }}</button>
		</view>

		<!-- 底部弹出框 -->
		<view class="cu-modal bottom-modal" @tap.stop="ifshowmodal=false" :class="ifshowmodal?'show':''">
			<view class="cu-dialog radius" @tap.stop="">
				
				<scroll-view class="padding bg-white" scroll-y="true">
					
					<checkbox-group class="padding" @change="CheckboxChange">
						
						<view class="cu-form-group borderbottom" v-for="(repeatitem,index) in repeatitems" :key="index">
							<view class="title">{{repeatitem.name}}</view>
							<checkbox :class=" selectrepeatIds.includes(repeatitem.value) ? 'checked' : '' " :checked=" selectrepeatIds.includes(repeatitem.value) " :value="repeatitem.value"></checkbox>
						</view>
						
					</checkbox-group>
					
				</scroll-view>
				
			</view>
		</view>
		
		
	</view>
</template>

<script>
	
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
		data() {
			return {
				ifshowmodal: false, // 是否显示底部弹框  默认为否
				repeatitems: [], // 周期数组
				selectrepeatIds: [], // 已经选中的周期id数组
				starttime: "",
				endtime: ""
			};
		},
		
		computed: {
			
			// 根据当前选中的周期性来计算要展示的周期性字符串
			showrepeatstr() {
				let selectrepeatIds = this.selectrepeatIds
				// 如果有七个则展示每一天
				if(selectrepeatIds.length === this.repeatitems.length) {
					return this.i18n.base.time.everyday
				}
				else if(selectrepeatIds.length === 5 && selectrepeatIds.includes("1") && selectrepeatIds.includes("2") && selectrepeatIds.includes("3") && selectrepeatIds.includes("4") && selectrepeatIds.includes("5")) {
					return this.i18n.base.time.workingday
				}
				else{
					let showstrArr = []
					this.repeatitems.forEach((repeatitem) => {
						if(selectrepeatIds.includes(repeatitem.value)) {
							showstrArr.push(repeatitem.name)
						}
					})
					if(showstrArr.length === 0){
						return this.i18n.base.select
					}
					return showstrArr.join('、')
				}
				
			}
		},
		
		onLoad() {
			
			// 设置重复周期数据
			let i18n = this.i18n
			let repeatitems = [
				{
					name: i18n.base.week.Monday,
					value: "1"
				},
				{
					name: i18n.base.week.Tuesday,
					value: "2"
				},
				{
					name: i18n.base.week.Wednesday,
					value: "3"
				},
				{
					name: i18n.base.week.Thursday,
					value: "4"
				},
				{
					name: i18n.base.week.Friday,
					value: "5"
				},
				{
					name: i18n.base.week.Saturday,
					value: "6"
				},
				{
					name: i18n.base.week.Sunday,
					value: "7"
				}
			]
			
			this.repeatitems = repeatitems
			
			// 获取用户工作时间
			this.$api.baseapi.getworkingtime().then(response => {
				// 获取工作时间
				let starttime = response.data.beginTime
				this.starttime = starttime
				
				let endtime = response.data.endTime
				this.endtime = endtime
				
				let list = response.data.list
				let selectrepeatIds = []
				list.forEach((eachdayitem) => {
					selectrepeatIds.push(eachdayitem.weekDay.toString())
				})
				this.selectrepeatIds = selectrepeatIds
				
			}).catch(error => {
				// 获取数据失败
				uni.showToast({
					title: this.i18n.error.loaderror,
					icon: 'none'
				});
			})
			
		},
		
		methods: {
			
			// 开始时间变更节点
			startTimeChange(e) {
				this.starttime = e.detail.value
				// 判断结束时间是否早于开始时间
				if(this.starttime > this.endtime) {
					this.starttime = this.endtime
					uni.showToast({
						title: this.i18n.error.overtimeerror,
						icon: 'none'
					});
				}
			},
			
			// 结束时间变更节点
			endTimeChange(e) {
				let endtime = e.detail.value
				this.endtime = e.detail.value
				
				// 判断结束时间是否早于开始时间
				if(this.starttime > this.endtime) {
					this.endtime = this.starttime
					uni.showToast({
						title: this.i18n.error.overtimeerror,
						icon: 'none'
					});
				}
				
			},
			
			// 变更选中的重复周期
			CheckboxChange(e) {
				let selectrepeatIds = e.detail.value
				this.selectrepeatIds = selectrepeatIds
			},
			
			// 确定
			confirm() {
				// 获取开始时间和结束时间和周期
				let starttime = this.starttime
				let endtime = this.endtime
				let selectrepeatIds = this.selectrepeatIds
				if(selectrepeatIds.length === 0) {
					uni.showToast({
						title: this.i18n.base.select,
						icon: 'none'
					});
					return
				}
				else {
					let list = []
					selectrepeatIds.forEach((repeatid) => {
						let weekDay = parseInt(repeatid)
						let weekdaydata = {
							weekDay
						}
						list.push(weekdaydata)
					})
					
					// 开始上传
					let data = {
						beginTime: this.starttime,
						endTime: this.endtime,
						list: list
						
					}
					this.$api.baseapi.setworkingtime(data).then(response => {
						// 修改成功
						uni.showToast({
							title: this.i18n.tip.fixsuccess,
							icon: 'none',
							duration: 1500
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
						
					}).catch(error => {
						uni.showToast({
							title: this.i18n.error.fixerror,
							icon: 'none'
						});
					})
					
				}
				
				
			},
		},
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #FFFFFF;
	}
	
	.workingtimeview{
		.cu-modal.bottom-modal .cu-dialog{
			border-top-left-radius: 30px;
			border-top-right-radius: 30px;
		}
	}
</style>
