<template>
	<view>
		<view class="content" >
			<form @submit="formSubmit">
				<view class="password-item">
					<text>原密码：</text>
					<input type="text" password="true" class="input" v-model="old_pass"/>
				</view>
				
				<view class="password-item">
					<text>新密码：</text>
					<input type="text" password="true" class="input" v-model="new_pass"/>
				</view>
				
				<view class="password-item">
					<text>确认密码：</text>
					<input  type="text" password="true" class="input" v-model="new_sure" @tap="second"/>
				</view>
				<view class="tips">密码需为8~20位，数字、英文和符号的组合，不含空格。</view>
				<button form-type="submit" class="submit">完成</button>
			</form> 
		</view>
	</view>
</template>
<style>
	.password-item>input {
		font-size: 40rpx;
	}
	.password-item {
		display: flex; 
		border-bottom: 1px solid gray;
		margin-top: 50rpx;
	}
	.submit {
		color: #FFFFFF;
		background-color: #78b2e9;
	}
	.submit:active {
		background-color: #3a8fe9;
	}
	.tips {
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		font-size: 25rpx;
		color: #BCBCBC;
	}
	.title {
		font-size: 50rpx;
	}
	.content {
		padding: 40rpx;
	}
</style>
<script>
	import md5 from '../../common/md5-node/index.js'; 
	
	export default {
		data() {
			return {
				old_pass: '',
				new_pass: '',
				new_sure: ''
			}
		},
		methods: {
			 second() {
				 if(this.new_pass === '') {
					 uni.showModal({
					 	showCancel: false,
					 	content: '请先输入新密码'
					 })
				 }
			 },
			 
			 formSubmit(e) {
				 const phone = uni.getStorageSync('loginPhone');
				 if(this.new_pass === this.new_sure) {
					 uni.request({
					 	url: 'http://120.27.208.220/changepassword',
						data: {
							telphone: phone, 
							old: md5(this.old_pass),
							new: md5(this.new_pass)
						},
						method: "POST",
						success: (res) => {
							if(res.data.code === 0) {
								uni.showModal({
									showCancel: false,
									content: '修改成功！'
								})
							}else if(res.data.code === 1) {
								uni.showModal({
									showCancel: false,
									content: '原密码错误'
								})
							}else {
								uni.showModal({
									showCancel: false,
									content: '修改失败，请稍后重试！'
								})
							}
						}
					 })
				 }
			 }
			 
		}
	}
</script>