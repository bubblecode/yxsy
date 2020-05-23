<template>
	<view class="container">
		<HMfilterDropdown @confirm="HMfilter" :filterData="filterData" :defaultSelected="filterDropdownValue" :updateMenuName="true"></HMfilterDropdown>
		<input type="text" v-model="searchStr" placeholder="搜索自习楼或区县" class="searchbar" @confirm="search()" />
		<view class="search-result">
			<uni-card v-for="(item,i) in searchResult" :key="i" :title="item.name" mode="style" :is-shadow="true" :thumbnail="item.imgPath"
			  @click="showDetail(item.id)">
				<view style="font-size: 28rpx;">{{item.address}}</view>
				<view style="font-size: 28rpx;">
					评分：  <span style="margin-right: 20rpx; font-weight: bolder; color: #FF5D00;"> {{item.score.toFixed(1)}} </span>
					评论数：<span> {{ item.comment_acc }}</span>
				</view>
				<view class="footer-box" @click.stop>
					<view style="font-size: 28rpx; color: #888888; margin-top: 15rpx;">
						<span>营业时间： {{item['open-time']}} </span>
					</view>
					<view class="footer-box-item favorite" @click="addFavorite(item, i)" v-if="!item.isfavorite">
						<image src="../../static/icon/love.png" style="width: 45rpx; height: 45rpx;"></image>
					</view>
					<view class="footer-box-item favorited" @click="subFavorite(item, i)" v-else>
						<image src="../../static/icon/loved.png" style="width: 45rpx; height: 45rpx;"></image>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>
<style>
	.favorited {
		color: grey;
	}

	.searchbar {
		background-color: #F5F5F5;
		height: 80rpx;
		border-radius: 20rpx;
		margin: 18rpx;
		margin-top: 110rpx;
		padding-left: 20rpx;
	}

	.footer-box {
		display: flex;
		justify-content: space-between; 
	}

	.footer-box-item {
		float: right;
		font-size: 40rpx;
		margin-left: 30rpx;
	}

	.favorite:active {
		color: red;
	}
</style>
<script>
	import HMfilterDropDown from '../../components/HMfilterDropdown/HMfilterDropdown.vue'
	export default {
		components: {
			HMfilterDropDown: HMfilterDropDown
		},
		data() {
			return {
				originStr: "",
				searchStr: "",
				filterDropdownValue: [],
				filterData: [],
				searchResult: []
			}
		},
		methods: {
			HMfilter(e) {
				console.log(e.value[1])
				var extra = {
					sort: e.value[0][0],
					buildingName: e.value[1][0],
					facility: e.value[1][1],
					openTime: e.value[1][2]
				}
				this.originStr = this.searchStr;
				this.update(extra);
			},
			favorited(id) {

				return uni.getStorageSync('myFavorite').includes(id) ? true : false;
			},
			addFavorite(item, index) {
				console.log(item)
				var fav = uni.getStorageSync('myFavorite');
				if (fav == "") {
					fav = []
				}
				fav.unshift(item.id);
				console.log(fav)
				uni.setStorageSync('myFavorite', fav);
				this.update()
			},
			subFavorite(item, index) {
				var fav = uni.getStorageSync('myFavorite');
				for (let j in fav) {
					if (fav[j] == item.id) {
						fav.splice(j, 1);
						uni.setStorageSync('myFavorite', fav);
					}
				}
				this.update()
			},
			showDetail(id) {
				uni.navigateTo({
					url: `../detail/detail?id=${id}`
				})
			},
			search() {
				this.originStr = this.searchStr;
				this.update()
			},
			update(extra) {
				if (this.originStr.replace(/ /, '') == '') {
					return;
				}
				uni.request({
					url: "http://120.27.208.220/search",
					method: "POST",
					data: {
						query: this.originStr,
						extra: extra
					},
					success: res => {
						if (res.data.size == 0) {
							this.searchResult = [];
							return;
						}
						this.searchResult = res.data.data;
						for (let i in this.searchResult) {
							this.searchResult[i].isfavorite = this.favorited(this.searchResult[i].id);
						}
					}
				})
			}
		},
		onLoad: function(option) {
			console.log(option)
			this.searchStr = option.district;
			this.originStr = this.searchStr;
			this.update();
			setTimeout(() => {
				this.filterDropdownValue = [
					[null, null],
					[],
				];
				this.filterData = [{
						"type": 'hierarchy',
						"submenu": [{
								"name": "无",
								"value": ""
							},
							{
								"name": "评分由高到低",
								"value": "score"
							},
							{
								"name": "评论数由多到少",
								"value": "comment_acc"
							}
						]
					},
					{
						"type": 'filter',
						"submenu": [{
								"name": "热门品牌",
								"submenu": [{
										"name": "光谷",
										"value": "'光谷自习楼'"
									},
									{
										"name": "百盛",
										"value": "'百盛自习楼'"
									},
									{
										"name": "安瑞",
										"value": "'安瑞自习楼'"
									}
								]
							},
							{
								"name": "设施服务",
								"submenu": [{
										"name": "空调",
										"value": "'%空调%'"
									},
									{
										"name": "沙发",
										"value": "'%沙发%'"
									},
									{
										"name": "有线宽带",
										"value": "'%宽带%'"
									},
									{
										"name": "免费WIFI",
										"value": "'%WIFI%'"
									}
								]
							},
							{
								"name": "营业时间",
								"submenu": [{
									"name": "24小时营业",
									"value": "'24小时营业'"
								}]
							}
						]
					},
				];
			}, 100); // setTimeOut()
		},
	}
</script>
