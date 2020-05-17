<template>
	<view>
		<view style="text-align: center;width: 100%; color: gray; margin-top: 50%;" v-if="nodata">没有记录</view>
		<uni-card v-else v-for="(item, i) in order" :key="i" :title="item.name" extra="已处理">
			<span class="text">类型：{{ item.type }}</span>
			<span style="color: #f00;float: right;">￥{{ item.price }}</span>
			<br>
			<span class="text">地址：{{ item.address }}</span>
			<br>
			<span style="color: grey; font-size: 30rpx;">预定时间：{{ item['start-time'] }}</span>


			<view class="footer-box-item" @click="refund">退款</view>
		</uni-card>
	</view>
</template>
<style>
	.text {
		font-size: 30rpx;
	}

	.footer-box-item {
		padding: 15rpx;
		color: #000000;
		border: 1px solid #EEE;
		background-color: #f8f8f8;
		border-radius: 15rpx;
 
		float: right;
		font-size: 35rpx;
		margin-left: 30rpx;
	}

	.footer-box-item:active {
		color: #FFFFFF;
		background-color: #ff5d00;
	}
</style>
<script>
	export default {
		onShow() {
			this.loaddata()
		},

		data() {
			return {
				order: [],
				nodata: false
			}
		},
		methods: {
			loaddata() {
				this.order = [];
				const telphone = uni.getStorageSync('loginPhone');
				uni.request({
					url: 'http://120.27.208.220/order',
					data: {
						telphone
					},
					method: "POST",
					success: (res) => {
						const result = res.data;
						if(result.length == 0) {
							this.nodata = true;
						} else {
							this.nodata = false;
							for (var i = 0; i < result.length; i++) {
								if (result[i].handle === '已处理') {
									this.order.push(result[i]);
								}
							}
						}
					},
				})
			},
			refund(order_id) {
				uni.showModal({
					confirmColor: "#FF0000",
					content: "确认退款？",
					success: (res) => {
						if (res.confirm) {
							// 点击确定
							uni.showLoading()
							uni.request({
								url: "http://120.27.208.220/refund",
								method: "POST",
								data: {
									id: order_id
								},
								success(res) {
									uni.hideLoading()
									uni.showModal({
										title: res.data.msg,
										showCancel: false
									});
								},
								complete: () => {
									this.loaddata()
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style>

</style>
