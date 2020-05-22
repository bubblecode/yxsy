<template>
	<view>
		<uni-search-bar :radius="100"
			clearButton="auto"
			cancelButton="none"
			@confirm="search">
		</uni-search-bar>
		<view class="title">热门搜索</view>
		<view class="recommand">
			<view class="tag"  v-for="(item,i) in top" :key="i"> 
				<uni-tag :text="item" :circle="true" size="small" @click="research(item)"></uni-tag>
			</view>
		</view>
		
		<view class="title">搜索历史</view>
		<view class="recommand">
			<view class="tag"  v-for="(item,i) in history" :key="i">
				<uni-tag :circle="true" size="small" :text="item" @click="research(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>
<style>
	.title {
		margin: 20rpx;
		font-weight: bold;
	}
	.tag {
		margin-left: 30rpx;
		margin-bottom: 30rpx;
	}
	.recommand {
		display: flex;
		padding: 25rpx;
		flex-wrap: wrap; 
	}
</style>
<script>
	export default {
		onLoad: function() {
			this.top = [];
			uni.getLocation({
				type: "wgs84",
				geocode: true,
				success: (res) => { 
					this.top.unshift(res.address.city,  res.address.district);
					this.top.push("蓝海自习楼","安瑞自习楼","星火自习楼","光谷自习楼","天行自习楼");
				}
			});
		},
		onShow: function() {
			const res = uni.getStorageSync("record");
			console.log(typeof res,res);
			if(res === "") {
				this.history = [];
			}else {
				this.history = res;
			}
		},
		
		data() {
			return {
				top: [],
				history: [],
				search_content: ''
			}
		},
		methods: {
			search(obj) {
				if(obj.value == "") {
					return;
				}
				if(this.history.includes(obj.value) == false) { 
					if(this.history.length == 5) {
						this.history.pop();
						this.history.unshift(obj.value);
					} else { 
						this.history.unshift(obj.value);
						console.log(obj.value);
					}
				}
				uni.navigateTo({
				   url: '../search/search?district=' + obj.value
				});
				
				uni.setStorageSync("record",this.history);
			},
			
			research(item) {
				var obj = {};
				obj.value = item;
				this.search(obj);
			}
		},
	}
</script>

<style>

</style>
