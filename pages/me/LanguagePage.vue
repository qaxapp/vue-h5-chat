<template>
    <view class="language-page"> <!-- 外部容器 -->
        <view class="language-container">
            <template v-for="(language, index) in languages" :key="index">
                <!-- 单个语言项 -->
                <view class="language-item" @click="switchLanguage(language.code)">
                    {{ language.name }}
                    <checkbox 
                        :checked="currentLanguage === language.code" 
                        @change="switchLanguage(language.code)" 
                        class="checkbox" 
                    />
                </view>

                <!-- 分割线，放在语言项的外部 -->
                <view 
                    v-if="index < languages.length - 1" 
                    class="language-divider">
                </view>
            </template>
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getCachedLanguage, setLanguage } from '../../common/language';

const languages = ref([
    { code: 'zh-CN', name: '中文简体' },
    { code: 'zh-TW', name: '中文繁体' },
    { code: 'en', name: 'English' }
]);

const currentLanguage = ref(getCachedLanguage() ? getCachedLanguage() : "zh-CN"); // 默认语言


const switchLanguage = (code) => {
	currentLanguage.value = code;
	setLanguage(code);
};
</script>

<style  lang="scss" scoped>
.language-page {
    padding: 16px;
	background-color: $uni-bg-color;	
	height: 100vh; /* 占满整个视窗高度 */

}

.language-container {
    display: flex;
    flex-direction: column;
}

.language-item {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 让内容两端对齐 */
    padding: 12px 16px;
    // background-color: #fff;
    border-radius: 8px;
    cursor: pointer;
    position: relative; 
	color: white
	/* 相对定位，为 checkbox 提供布局支持 */
}

.language-name {
    flex: 1; /* 占据剩余空间，确保 name 和 checkbox 不重叠 */
    font-size: 16px;
    color: #333;
}

.checkbox {
    position: absolute; /* 绝对定位 */
    right: 16px; /* 距离右侧边缘的距离 */
}
.language-divider {
    height: 1px;
    background-color: $cm-split-line-color;
    margin: 8px 0;
}


</style>