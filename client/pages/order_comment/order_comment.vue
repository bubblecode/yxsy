<template>
	<view>
		<view style="text-align: center;width: 100%; color: gray; margin-top: 50%;" v-if="nodata">没有记录</view>
		<uni-card v-else v-for="(item, i) in order" :key="i" :title="item.name" extra="待评价">
			<span class="text">类型：{{ item.type }}</span>
			<span style="color: #f00;float: right;">￥{{ item.price }}</span>
			<br>
			<span class="text">地址：{{ item.address }}</span>
			<br>
			<span style="color: grey; font-size: 30rpx;">预定时间：{{ item['start-time'] }}</span>
			<view class="footer-box-item" @tap="rate_order(item.id)">评价</view>
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
		background-color: #3a8fe9;
	}
</style>
<script>
	export default {
		onShow() {
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
							if (result[i].handle === '待评价') {
								this.order.push(result[i]);
							}
						} 
					}
				},
			})
		},

		data() {
			return {
				order: [],
				nodata: false
			}
		},
		methods: {
			rate_order(id) {
				console.log(id);
				uni.navigateTo({
					url: '../write_comment/write_comment?id=' + id
				})
			}
		}
	}
</script>

<style>

</style>
