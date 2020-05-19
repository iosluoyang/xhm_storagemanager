<template>
	<view class="workingtimeview">
		
		<cu-custom bgColor="bg-yellow" isBack>
			<block slot="content">{{ i18n.me.panel.workingtime }}</block>
		</cu-custom>
		
		<!-- 开始时间 -->
		<view class="cu-form-group">
			<view class="title">开始时间</view>
			<picker mode="time" :value="starttime" @change="startTimeChange">
				<view class="picker">
					{{starttime}}
				</view>
			</picker>
		</view>
		
		<view class="cu-form-group">
			<view class="title">结束时间</view>
			<picker mode="time" :value="endtime" @change="endTimeChange">
				<view class="picker">
					{{endtime}}
				</view>
			</picker>
		</view>
		
		<view class="cu-form-group arrow" @tap.stop="ifshowmodal=!ifshowmodal">
			<view class="title">周期选择</view>
			<view class="text-df">
				每周一至周五
			</view>
		</view>

		<!-- 底部弹出框 -->
		<view class="cu-modal bottom-modal" @tap.stop="ifshowmodal=false" :class="ifshowmodal?'show':''">
			<view class="cu-dialog" @tap.stop="">
				
				<view class="cu-bar bg-white">
					<view class="action text-xl text-grey" @tap.stop="ifshowmodal=false">{{i18n.base.cancel}}</view>
					<view class="action text-xl text-yellow">{{i18n.base.confirm}}</view>
				</view>
				
				<scroll-view class="padding bg-white" scroll-y="true">
					
					<checkbox-group class="padding" @change="CheckboxChange">
						
						<view class="cu-form-group borderbottom" v-for="(repeatitem,index) in repeatitems" :key="index">
							<view class="title">{{repeatitem.name}}</view>
							<checkbox :class=" selectrepeatIds.includes(repeatitem.value.toString()) ? 'checked' : '' " :checked=" selectrepeatIds.includes(repeatitem.value.toString()) " :value="repeatitem.value.toString()"></checkbox>
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
				ifshowmodal: true, // 是否显示底部弹框  默认为否
				repeatitems: [], // 周期数组
				selectrepeatIds: [], // 已经选中的周期id数组
				starttime: "08:00",
				endtime: "18:00"
			};
		},
		
		onLoad() {
			
			// 设置重复周期数据
			let i18n = this.i18n
			let repeatitems = [
				{
					name: i18n.base.week.Monday,
					value: 1
				},
				{
					name: i18n.base.week.Tuesday,
					value: 2
				},
				{
					name: i18n.base.week.Wednesday,
					value: 3
				},
				{
					name: i18n.base.week.Thursday,
					value: 4
				},
				{
					name: i18n.base.week.Friday,
					value: 5
				},
				{
					name: i18n.base.week.Saturday,
					value: 6
				},
				{
					name: i18n.base.week.Sunday,
					value: 7
				}
			]
			
			this.repeatitems = repeatitems
			
		},
		
		methods: {
			
			// 开始时间变更节点
			startTimeChange(e) {
				this.starttime = e.detail.value
			},
			
			// 结束时间变更节点
			endTimeChange(e) {
				this.endtime = e.detail.value
			},
			
			// 变更选中的重复周期
			CheckboxChange(e) {
				let selectrepeatIds = e.detail.value
				this.selectrepeatIds = selectrepeatIds
				console.log(`当前选中的重复性周期为:${selectrepeatIds}`);
			},
		},
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #FFFFFF;
	}
</style>
