<template>
	<view>
		<view style="text-align: center;width: 100%; color: gray; margin-top: 50%;" v-if="favoriteList.length==0">没有记录</view>
		<uni-swipe-action>
			<uni-swipe-action-item v-for="(item, i) in favoriteList" :options="options" @click="del(item.id)" :key="i">
				<view class="favorite-item" @click="detail(item.id)">
					<view><image :src="item.imgPath" class="img"></image></view>
					<view class="info">
						<view class="name">{{item.name}}</view>
						<view class="time">{{item['open-time']}}</view>
						<view class="size">{{item.address}}</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>
<style>
	.size {
		margin-top: 20rpx;
		font-size: 30rpx;
	}

	.name {
		font-size: 35rpx;
	}

	.time {
		font-size: 30rpx;
		color: #BCBCBC;
	}

	.info {
		margin-left: 30rpx;
	}

	.favorite-item {
		margin: 20rpx;
		display: flex;
		flex-direction: row;
	}

	.img {
		width: 150rpx;
		height: 150rpx;
		background-color: #EEEEEE;
	}
</style>
<script>
	export default {
		data() {
			return {
				favoriteList: [],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}]
			}
		},
		methods: {
			del(buildingID) {
				var arr = uni.getStorageSync('myFavorite');
				this.favoriteList.forEach(function(item,index,arr) {
					if(item.id == buildingID) {
						arr.splice(index,1);
						return;
					}
				});
				arr.splice(arr.indexOf(buildingID), 1)
				uni.setStorageSync('myFavorite', arr);
			},
			detail(id) {
				uni.navigateTo({
					url: `../detail/detail?id=${id}`
				});
			}
		},
		onShow() {
			if (uni.getStorageSync("myFavorite").length > 0) {
				uni.request({
					url: "http://120.27.208.220/getfavorite",
					method:"POST",
					data: {
						idlist: uni.getStorageSync("myFavorite")
					},
					success: (res) => {
						this.favoriteList = res.data;
					}
				});
			}
		}
	}
</script>

<style>

</style>
