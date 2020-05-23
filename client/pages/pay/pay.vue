<template>
	<view>
		<view class="payment">
			<view class="pay-btn" @click="pay">
				<a>去付款</a>
			</view>
			<view class="price">合计：<span style="color: red;">￥{{money}}</span></view>
		</view>

		<uni-card>
			<view style="font-weight: bold; font-size: 45rpx;">{{username}}</view>
			<view style="margin-top: 10rpx;">联系电话：{{phone}}</view>
		</uni-card>
		<uni-card>
			<view style="font-weight: bold;">付款须知</view>
			<view style="font-size: 35rpx;color: grey; margin-top: 20rpx;">
				<view style="margin-top: 20rpx;">1. 请使用支付宝进行支付</view>
				<view style="margin-top: 20rpx;">2. 请仔细核实订单信息，确认无误后付款</view>
				<view style="margin-top: 20rpx;">3. 下单后请在预约时间内到达自习室就学</view>
			</view>
		</uni-card>
		<uni-list>
			<uni-list-item :showArrow="false">
				<view class="list-item">
					<view class="item-left">自习楼</view>
					<view>{{buildInfo.name}}</view>
				</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="list-item">
					<view class="item-left">预定类型</view>
					<view>{{name}}</view>
				</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="list-item">
					<view class="item-left">地址</view>
					<view>{{buildInfo.address}}</view>
				</view>
			</uni-list-item>
			<uni-list-item>
				<view class="list-item">
					<view class="item-left">预定时间</view>
					<view>
						<picker mode="date" :value="start_date" :start="startDate" :end="endDate" @change="bindStartDateChange">
							<view class="uni-input">{{start_date}}</view>
						</picker>
					</view>
					<view class="item-right">
						<timeSelector showType="hour" @btnConfirm="bindStartTimeChange">{{start_time}}</timeSelector>
					</view>
				</view>
			</uni-list-item>
			<uni-list-item>
				<view class="list-item">
					<view class="item-left">离开时间</view>
					<view>
						<picker mode="date" :value="end_date" :start="startDate" :end="endDate" @change="bindEndDateChange">
							<view class="uni-input">{{end_date}}</view>
						</picker>
					</view>
					<view class="item-right">
						<timeSelector showType="hour" @btnConfirm="bindEndTimeChange">{{end_time}}</timeSelector>
					</view>
				</view>
			</uni-list-item>
			<uni-list-item :showArrow="false">
				<view class="list-item">
					<view class="item-left">客服电话</view>
					<view>{{buildInfo.phone}}</view>
				</view>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<style>
	page {
		background-color: #F1F2F2;
	}

	a {
		text-decoration: none;
		color: #FFFFFF;
		line-height: 50rpx;
		height: 50rpx;
	}

	.pay-btn {
		margin-right: 18rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		border-radius: 50rpx;
		background-color: red;
	}

	.list-item {
		display: flex;
		flex-direction: row;
	}

	.item-left {
		width: 180rpx;
		color: #7e7e7e;
	}

	.item-right {
		margin-left: 20rpx;
	}

	.price {
		height: 90rpx;
		line-height: 90rpx;
		margin-right: 30rpx;
	}

	.payment {
		z-index: 99;
		padding: 8rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row-reverse;
		width: 100%;
		position: fixed;
		bottom: 3rpx;
	}
</style>

<script>
	import myDate from '../../common/ComparableDate.js'
	import timeSelector from '@/components/wing-time-selector/wing-time-selector.vue';
	export default {
		components: {
			timeSelector
		},
		onLoad(obj) {
			console.log(obj)
			this.name = obj.type; 
			this.unitprice = obj.price
			this.money = this.totalprice(obj.price)
			this.buildingID = obj.buildingID;
			uni.request({
				url: "http://120.27.208.220/orderinfo",
				method: "POST",
				data: {
					id: obj.buildingID,
					phone: uni.getStorageSync("loginPhone")
				},
				success: res => {
					console.log(res.data)
					this.username = res.data.name;
					this.buildInfo = res.data.buildinfo[0];
					this.type = obj.type;
					this.name = res.data.buildinfo[0].name +' '+ obj.type;
					console.log(res.data)
				}
			});

		},
		onShow() {
			if(this.ispay) {
				uni.switchTab({
					url:"../my/my"
				});
			}
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				start_date: currentDate,
				start_time: (new Date()).getHours() + ":00",
				end_date: currentDate,
				end_time: (new Date()).getHours() + 1 + ":00",
				unitprice: 0.0,

				username: "加载中...",
				phone: uni.getStorageSync('loginPhone'),
				buildInfo: [],
				buildingID: 0,
				type: "",

				name: "",
				money: 0,
				ispay: false
			}
		},

		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			pay() {
				uni.request({
					url: "http://120.27.208.220/pay",
					method: "POST",
					data: {
						subject: this.buildInfo.name,
						body:  this.name,
						money: this.money
					},
					success: res => {
						const jyAliPay = uni.requireNativePlugin('JY-ALIPAY')
						jyAliPay.show({
							if_sanbox: true,
							auto_create_order_info: false,
							appid: '2016102400752734',
							order_info: res.data.orderInfo 
						}, result => { 
							console.log(result)
							if (result.resultStatus == '5002555') {
								uni.showToast({
									title: "支付sdk出错"
								});
							} else if (result.resultStatus == '9000') {
								uni.request({
									url: "http://120.27.208.220/creatorder",
									method: "POST",
									data: {
										startTime: this.start_date + ' ' + this.start_time,
										endTime: this.end_date + ' ' + this.end_time,
										price: this.money,
										phone: uni.getStorageSync('loginPhone'),
										buildingID: this.buildingID,
										type: this.type
									},
									success: res => {
										this.ispay = true;
										uni.showToast({
											title: "支付成功！",
											mask: true,
											success: () => {
											}
										});
									}
								});
								
								setTimeout(function() {
									uni.navigateTo({
										url: "../order_paid/order_paid"
									});
								}, 1100);
								
							} else {
								uni.showToast({
									title: result.memo
								});
							}
						});
					}
				})
			},
			totalprice(unitPrice) {
				console.log('单价是：', unitPrice)
				console.log('-----------------------------')
				var syear, smonth, sday, shour, eyear, emonth, eday, ehour

				syear = Number(this.start_date.split('-')[0])
				smonth = Number(this.start_date.split('-')[1])
				sday = Number(this.start_date.split('-')[2])
				shour = Number(this.start_time.split(':')[0])

				eyear = Number(this.end_date.split('-')[0])
				emonth = Number(this.end_date.split('-')[1])
				eday = Number(this.end_date.split('-')[2])
				ehour = Number(this.end_time.split(':')[0])

				var total = 24 * (30 * (12 * (eyear - syear) + (emonth - smonth)) + (eday - sday)) + (ehour - shour)

				return (total * unitPrice).toFixed(2)
			},
			normalizedTime() {
				var current = new Date()
				var sy = Number(this.start_date.split('-')[0]),
					sm = Number(this.start_date.split('-')[1]),
					sd = Number(this.start_date.split('-')[2]),
					ey = Number(this.end_date.split('-')[0]),
					em = Number(this.end_date.split('-')[1]),
					ed = Number(this.end_date.split('-')[2]),
					st = Number(this.start_time.split(':')[0]),
					et = Number(this.end_time.split(':')[0]);

				var eqYear = false,
					eqMonth = false,
					eqDay = false
				if (sy <= current.getFullYear()) {
					sy = current.getFullYear()
				}
				if (sm <= current.getMonth()) {
					sm = current.getMonth()
				}
				if (sd <= current.getDate()) {
					sd = current.getDate()
				}
				if (st <= current.getHours()) {
					st = current.getHours();
					this.start_time = current.getHours() + ":00";
				}
				if (ey <= sy) {
					ey = sy;
				}

				if (em <= sm && ey == sy) {
					em = sm;
				}

				if (ed <= sd && ey == sy && em == sm) {
					ed = sd;
				}

				if (et <= st && ey == sy && em == sm && ed == sd) { 
					et = st + 1;
					this.end_time = et + ":00";
				}

				this.start_date = sy + '-' + sm + '-' + sd;
				this.end_date = ey + '-' + em + '-' + ed;

			},
			bindStartTimeChange(e) {
				this.start_time = e.key + ":00";
				this.normalizedTime();
			},
			bindEndTimeChange(e) {
				this.end_time = e.key + ":00";
				this.normalizedTime();
				this.money = this.totalprice(this.unitprice); 
			},
			bindEndDateChange(e) {
				this.end_date = e.target.value;
				this.normalizedTime();
				this.money = this.totalprice(this.unitprice);
			},
			bindStartDateChange(e) {
				this.start_date = e.target.value;
				this.normalizedTime()
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>
