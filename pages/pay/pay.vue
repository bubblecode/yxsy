<template>
	<view>
		<view class="payment">
			<view class="pay-btn" @click="pay">
				<a :href="'alipays://platformapi/startapp?appId=20000067&url='+qrurl">去付款</a>
			</view>
			<view class="price">合计：<span style="color: red;">￥{{param.money}}</span></view>
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
					<view>{{param.name}}</view>
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
	import config from '../../common/config.js'
	import qrCode from 'weapp-qrcode';
	import timeSelector from '@/components/wing-time-selector/wing-time-selector.vue';
	export default {
		components: {
			timeSelector
		},
		onShow() {
			if (this.ispay) {
				uni.showModal({
					title: "已支付"
				});
			}
		},
		onLoad(obj) {
			console.log(obj)
			this.param.name = obj.type;
			this.param.money = this.totalprice(obj.price)
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
					this.param.name = res.data.buildinfo[0].name + obj.type;
					console.log(res.data)
				}
			});

			let sings = config.a(this.param);
			this.param.sign = sings;
			uni.showLoading({
				title: '订单提交中',
				mask: true
			});
			uni.request({
				url: config.submitapi,
				data: this.param,
				header: {},
				success: (res) => {
					uni.hideLoading();
					this.qrurl = res.data.qrurl;
					this.trade_no = res.data.trade_no;
					uni.showToast({
						title: 订单创建成功
					});
				}
			});
		},

		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				start_date: currentDate,
				start_time: "0:00",
				end_date: currentDate,
				end_time: "23:00",


				username: "xxx",
				phone: uni.getStorageSync('loginPhone'),
				buildInfo: [],
				buildingID: 0,
				type: "",


				trade_no: "",
				timr: "",
				ispay: false,
				qrurl: "", 
				param: {
					pid: config.id,
					type: "alipay",
					out_trade_no: "123456",
					notify_url: "default",
					return_url: config.return_url,
					name: "订单获取失败",
					money: '0.00',
					sitename: "localhost",
					sign: "",
					sign_type: "MD6",
				}
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
					url: "http://120.27.208.220/creatorder",
					method: "POST",
					data: {
						startTime: this.start_date+' '+this.start_time,
						endTime: this.end_date+' '+this.end_time,
						price: this.param.money,
						phone: uni.getStorageSync('loginPhone'),
						buildingID: this.buildingID,
						type: this.type
					},
					success(res) {
						console.log('RES:')
						console.log(res.data);
					}
				})
			},
			totalprice: function(unitPrice) {
				console.log('单价是：',unitPrice)
				return '0.01'
			},
			bindStartTimeChange(e) {
				this.start_time = e.key + ":00"
			},
			bindEndTimeChange(e) {
				this.end_time = e.key + ":00"
			},
			bindEndDateChange(e) {
				this.end_date = e.target.value
			},
			bindStartDateChange(e) {
				this.start_date = e.target.value
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
		},
		onBackPress(options) {
			if (options.from === 'backbutton ') {
				clearInterval(this.timr)
			} else {
				clearInterval(this.timr)
			}
		},
		onReady() {
			var n = 0;
			var timr = setInterval(() => {
				uni.request({
					url: config.queryapi,
					data: {
						trade_no: this.trade_no
					},
					success: (res) => {
						if (res.data.ok == 1) {
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								success: () => {
									this.ispay = true;
									clearInterval(timr)
									uni.redirectTo({
										url: config.return_url
									})
								}
							});
						}
					}
				});
				n++;
				if (n > 60) {
					clearInterval(timr)
				}
			}, 5000)
			this.timr = timr;
		}
	}
</script>
