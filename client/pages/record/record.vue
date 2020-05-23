<template>
	<view>
		<uni-card  v-for="(item, i) in refundlist" :key="i" :title="item.name" :extra="item.state|refundState">
			<span>{{item.type}}</span>
			<span style="color: #f00;float: right;">￥{{item.price}}</span>
			<br>
			<span class="order-id">订单号：{{item.id}}</span>
			<span style="float: right; color: grey; font-size: 30rpx;">{{item.applytime}}</span>
		</uni-card>
	</view>
</template>
<style>
	.order-id {
		font-size: 30rpx;
		color: #BBBBBB;
	}

	.footer-box-item {
		float: right;
		font-size: 40rpx;
		margin-left: 30rpx;
	}

	.footer-box-item:active {
		color: red;
	}
</style>
<script>
	export default {
		filters: {
			refundState: function(value) {
				return value=='0'?"退款受理中":"已退款";
			}
		},
		data() {
			return {
				refundlist: []
			}
		},
		methods: {

		},
		onShow() {
			uni.request({
				url: "http://120.27.208.220/getrefundorder",
				data: {
					phone: uni.getStorageSync('loginPhone')
				},
				method: "POST",
				success: (res) => {
					console.log(res.data)
					uni.showToast({
						title: "找到" + res.data.length + "条记录"
					});
					this.refundlist = res.data.value;
					console.log(this.refundlist)
				}
			})
		}
	}
</script>

<style>

</style>
