<template>
	<view class="content">
		<form @submit="formSubmit">
			<view class="rate rate-text">{{score|attitudeFilter}}</view>
			<view class="rate">
				<uni-rate v-model="score" size="30" margin="10" @change="setStarValue"></uni-rate>
			</view>
			<view class="comment" style="background-color: #EEE; min-height: 300rpx;">
				<textarea cols="30" rows="10" placeholder="随便说点什么吧..." name="views" v-model="points" @input="clearInfo()"></textarea>
			</view>
			<view v-if="empty" style="color: red; font-size: 25rpx;">评论内容不能为空</view>
			<view v-if="full" style="color: red; font-size: 25rpx;">最多只能评论200字哦</view>
			<checkbox value="匿名" :checked="flag" @click="flag=!flag" /><text>匿名</text>
			<view class="submit">
				<button form-type="submit" class="submit-btn">提交</button>
			</view>
		</form>
	</view>
</template>

<style>
	.content {
		padding: 20rpx;
		padding-top: 80rpx;
	}

	.submit-btn {
		background-color: #5FC754 !important;
		color: #FFFFFF !important;
	}

	.submit-btn:active {
		color: #EAEEF1 !important;
		background-color: #498733 !important;
	}

	.rate,
	.img-box,
	.comment,
	.submit {
		margin-top: 30rpx;
	}
	
	.rate-text {
		margin-top: 30rpx; 
		color: #d67200; 
		font-size: 60rpx; 
		font-weight: bold;
	}

	.rate {
		text-align: center;
		margin-left: 20%;
		margin-right: 20%;
		margin-bottom: 80rpx;
	}

	.comment {
		border-radius: 15rpx;
		margin-bottom: 10rpx;
	}

	textarea {
		padding: 15rpx;
	}
</style>
<script>
	export default {
		filters: {
			attitudeFilter: function(value) {
				switch(Number(value)) {
					case 1: return '差';
					case 2: return '较差';
					case 3: return '一般';
					case 4: return '好';
					case 5: return '非常好';
				}
			}
		},
		data() {
			return {
				id: '',
				points: '',
				flag: true,
				score: '5',
				empty: false,
				full: false
			}
		},
		onLoad(option) {
			console.log(option.id);
			this.id = option.id;
			console.log(this.id)
		},
		methods: {
			clearInfo() {
				this.empty = false;
				this.full = false;
			},
			setStarValue(obj) {
				this.score = obj.value;
			},
			formSubmit: function(e) {
				if (this.points.replace(/ /g, '') == "") {
					this.empty = true;
				} else if (this.points.length > 200) {
					this.full = true;
				} else {
					console.log(this.flag);
					console.log("this.score: ", this.score)
					console.log('携带的数据：' + JSON.stringify(e.detail.value));
					uni.request({
						url: 'http://120.27.208.220/comment',
						data: {
							id: this.id,
							value: e.detail.value,
							anonymous: this.flag,
							score: this.score
						},
						method: "POST",
						success: (res) => {
							console.log(res.data.code);
							if (res.data.code === 0) {
								uni.showModal({
									showCancel: false,
									content: '发布成功！'
								})
							} else {
								uni.showModal({
									showCancel: false,
									content: '发布失败，请稍后重试！'
								})
							}
						}
					});
				}
			}
		}
	}
</script>
