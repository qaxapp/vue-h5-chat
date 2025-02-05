<template>
	<view class="language-page"> <!-- 外部容器 -->
		<view class="language-container">
			<radio-group @change="radioChange">
				<template v-for="(language, index) in languages" :key="index">
					<!-- 单个语言项 -->
					<view class="language-item" @click="switchLanguage(language.code)">
						{{ language.name }}
						<radio :value="language.code" :checked="currentLanguage === language.code"
							class="checkbox" />
					</view>

					<!-- 分割线，放在语言项的外部 -->
					<view v-if="index < languages.length - 1" class="language-divider">
					</view>
				</template>
			</radio-group>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue';
	import {
		getCachedLanguage,
		setLanguage
	} from '../../common/language';
	import { useI18n } from 'vue-i18n'

	const languages = ref([{
			code: 'zh-CN',
			name: '中文简体'
		},
		{
			code: 'zh-TW',
			name: '中文繁体'
		},
		{
			code: 'en',
			name: 'English'
		}
	]);

	const currentLanguage = ref(getCachedLanguage()); // 默认语言

	const {  locale } = useI18n() // 获取 i18n 实例中的翻译函数和当前语言

	const switchLanguage = (code) => {
		console.log("switchLanguage");
		if (currentLanguage.value !== code) {
			currentLanguage.value = code;
			setLanguage(code);
			locale.value = code;
			uni.setLocale(code);
			console.log("switchLanguage");
		}
	};
	
	const radioChange = (e) => {
		const code = e.detail.value;
		console.log("radioChange");
		if (currentLanguage.value !== code) {
			currentLanguage.value = code;
			setLanguage(code);
			console.log("radioChange");
		}
	};
	
	
</script>

<style lang="scss" scoped>
	.language-page {
		padding: 16px;
		background-color: $uni-bg-color;
		height: var(--page-full-height-without-header);

	}

	.language-container {
		display: flex;
		flex-direction: column;
	}

	.language-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* 让内容两端对齐 */
		padding: 12px 16px;
		// background-color: #fff;
		border-radius: 8px;
		cursor: pointer;
		position: relative;
		color: white
			/* 相对定位，为 checkbox 提供布局支持 */
	}

	.language-name {
		flex: 1;
		/* 占据剩余空间，确保 name 和 checkbox 不重叠 */
		font-size: 16px;
		color: #333;
	}

	.checkbox {
		position: absolute;
		/* 绝对定位 */
		right: 16px;
		/* 距离右侧边缘的距离 */
	}

	.language-divider {
		height: 1px;
		background-color: $cm-split-line-color;
		margin: 8px 0;
	}
</style>