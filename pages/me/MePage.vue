<template>
    <div class="me-container">
        <div v-if="user" class="user-info" @click="showUserInfo">
            <image class="portrait" :src="user.portrait"></image>
            <text class="name">{{ user.displayName }}</text>
        </div>
        <div class="item" @click="showAbout">
            <text>{{ $t('chat_im_i18n.about') }}</text>
        </div>
		
		<div class="item" @click="showLanguage">
		    <text>{{ $t('chat_im_i18n.language') }}</text>
		</div>
		
		
        <button class="logout-button" @click="logout">{{ $t('chat_im_i18n.user_logout') }}</button>
		
		<uni-popup ref="alertDialog" type="dialog">
		        <uni-popup-dialog 
		        :cancelText="alertDialogOptions.cancelText" 
		        :confirmText="alertDialogOptions.confirmText" 
		        :title="alertDialogOptions.title"
		        :content="alertDialogOptions.content"
		        @confirm="alertDialogOptions.onConfirm"               
		        @close="alertDialogOptions.onClose">
				</uni-popup-dialog>
		</uni-popup>
    </div>

</template>

<script>
import wfc from "../../wfc/client/wfc";
import {clear} from "../util/storageHelper";
import store from "../../store";
import avengineKit from "../../wfc/av/internal/engine.min";
import Config from "../../config";

export default {
    name: "MePage",
    data() {
        return {
            user: null,
            info: '',
			alertDialogOptions: {},
        }
    },
    mounted() {
        if (avengineKit.startConference) {
            this.info += '高级版音视频\n'
        } else {
            this.info += '多人版音视频\n'
            Config.ICE_SERVERS.forEach(obj => {
                this.info += obj[0] + ' ' + obj[1] + ' ' + obj[2];
            })
        }
    },
    onShow() {
        this.user = store.state.contact.selfUserInfo;
    },
    methods: {
        showUserInfo() {
            store.setCurrentFriend(this.user)
            uni.navigateTo({
                url: '/pages/contact/UserDetailPage',
                success: () => {
                    console.log('nav to UserDetailPage success');

                },
                fail: (err) => {
                    console.log('nav to UserDetailPage err', err);
                }
            })

        },
        logout() {
			
			this.alertDialogOptions = {
			  cancelText: "取消",
			  confirmText: "确认",
			  title: "提示",
			  content: "退出登录？",
			  onConfirm: () => {
			    wfc.disconnect(true, false);
			    clear();
			    try {
			            uni.reLaunch({
			                url: '/pages/login/LoginPage'
			            });
			        } catch (error) {    
			    }
			  },
			  onClose: () => {
			    this.alertDialogOptions = {};
			  },
			};
			this.$refs.alertDialog.open();
            
        },
        showAbout() {
            uni.navigateTo({
                url: '/pages/misc/WebViewPage?url=https://chat.com/',
                fail: (e) => {
                    console.log(e)
                }
            });
        },
        showLanguage() {
           uni.navigateTo({
               url: '/pages/me/LanguagePage',
               fail: (e) => {
                   console.log(e)
               }
           });
        },
    }
}
</script>

<style lang="scss" scoped>

.me-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: var(--page-full-height-without-header-and-tabbar);
	background-color: $uni-bg-color;
    color: $cm-text-color;
}

.user-info {
    width: 100%;
    padding: 10px;
    height: 80px;
    display: flex;
    align-items: center;
    flex-direction: row;
    position: relative; // 添加此行
    background: $cm-bg-bar-color;
}

.user-info:active {
    background: $cm-bg-bar-color;
}

.user-info::after {
    content: ""; /* 使伪元素可见 */
    position: absolute;
    left: 0; /* 偏移量 */
    right: 0;
    bottom: 0;
    border-bottom: 1px solid $cm-split-line-color; /* 定义边框样式 */
}

.user-info .portrait {
    width: 60px;
    height: 60px;
    border-radius: 5px;
}

.user-info .name {
    margin-left: 10px;
}

.item {
    width: 100%;
    padding: 15px 10px;
    position: relative; // 添加此行
    background: $cm-bg-bar-color;
}

.item:active {
    background: $cm-bg-bar-color;}

.item::after {
    content: ""; /* 使伪元素可见 */
    position: absolute;
    left: 0; /* 偏移量 */
    right: 0;
    bottom: 0;
    border-bottom: 1px solid $cm-split-line-color; /* 定义边框样式 */
}


.info {
    width: 100%;
    padding: 15px 10px;
}

.logout-button {
    margin-top: 440rpx;
    width: 80%;
    background:#373949;
	margin-left: 24rpx;
	margin-right: 24rpx;
    color: white;
}

</style>
