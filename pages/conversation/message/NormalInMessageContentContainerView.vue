<template>
    <div class="container">
        <div class="message-time-container"
             v-bind:class="{checked:sharedPickState.messages.indexOf(message) >= 0}":style="{paddingTop: message.showAvatar ? '20px': '8px'}">
			<p v-if="this.message._showTime && isSingle" class="time">{{ message._timeStr }}</p>
            <div class="message-avatar-content-container" >
                <div class="avatar-container">
                    <checkbox id="checkbox" v-if="sharedConversationState.enableMessageMultiSelection" type="checkbox"
                              :value="message"
                              :checked="isMessageChecked"/>
                    <img
						v-if="visibilityAvatar"
                        :style="{ visibility: message.showAvatar ? 'visible' : 'hidden', height: message.showAvatar ? '40px': '0px' }"
                        @click="onClickUserPortrait(message.from)"
						@longpress.prevent="altUser($event, message)"
                        class="avatar"
                        draggable="false"
                        :src="message._from.portrait" alt=""
												@error="onImageAvatarError">
                </div>
                <!--消息内容 根据情况，if-else-->
                <div class="message-name-content-container">
                    <div class="name-time-container" v-if="message.showAvatar && !isSingle">
                        <p class="name">{{ message._from._displayName }}</p>
                        <p class="time">{{ message._timeStr }}</p>
                    </div>
                    <div class="flex-column flex-align-start">
                        <div class="flex-row">
                            <MessageContentContainerView class="message-content-container"
                                                         :message="message"
                                                         @longpress.prevent="openMessageContextMenu($event, message)"
                                                         @contextmenu.prevent.native="openMessageContextMenu($event, message)"/>
                            <!--                            <LoadingView v-if="isDownloading"/>-->
                        </div>
                        <QuoteMessageView style="padding: 5px 0; max-width: 80%"
                                          v-if="quotedMessage"
                                          :message="message"
                                          :quoted-message="quotedMessage"
                                          :message-digest="this.message.messageContent.quoteInfo.messageDigest"
                                          :show-close-button="false"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import MessageContentContainerView from "@/pages/conversation/message/MessageContentContainerView";
import QuoteMessageView from "@/pages/conversation/message/QuoteMessageView";
import LoadingView from "@/pages/common/LoadingView";
import store from "@/store";
import wfc from "@/wfc/client/wfc";
import { getItem } from "../../util/storageHelper";
import Config from "../../../config";
import ConversationType from "../../../wfc/model/conversationType";

export default {
    name: "NormalInMessageContentView",
    props: {
        message: null,
    },
    data() {
        return {
            sharedConversationState: store.state.conversation,
            sharedPickState: store.state.pick,
            highLight: false,
            quotedMessage: null,
        }
    },
    methods: {
		onImageAvatarError(event) {
			// 图片加载失败时，设置为默认图片
			event.target.src = Config.DEFAULT_PORTRAIT_URL;
		},

		onClickUserPortrait(userId) {
            store.setCurrentFriend(this.message._from);
            store.setCurrentFriend(this.message._from);
			// TODO 点击头像事件
			uni.showToast({
				title: 'TODO 点击头像事件',
				icon: 'none'
			})

			// uni.navigateTo({
			// 	url: '/pages/contact/UserDetailPage',
			// 	success: () => {
			// 		console.log('nav to UserDetailPage success');

			// 	},
			// 	fail: (err) => {
			// 		console.log('nav to UserDetailPage err', err);
			// 	}
			// })
        },
        openMessageContextMenu(event, message) {
            this.$eventBus.$emit('openMessageContextMenu', [event, message])
            this.highLight = true;
        },
		
		altUser(event, message) {
			this.$eventBus.$emit('altUser', [event, message])
			
		}
    },
    mounted() {
        if (this.message.messageContent.quoteInfo) {
            let messageUid = this.message.messageContent.quoteInfo.messageUid;
            let msg = store.getMessageByUid(messageUid);
            if (!msg) {
                wfc.loadRemoteMessage(messageUid, (ms) => {
                    msg = store._patchMessage(ms[0]);
                    this.quotedMessage = msg;
                }, err => {
                    console.log('load remote message error', messageUid, err)
                })
            } else {
                this.quotedMessage = msg;
            }
        }
    },
    computed: {
		visibilityAvatar() {
			if (this.message.conversation.type === ConversationType.Single) {
				return false;
			}
			return true;
		},
        isDownloading() {
            return store.isDownloadingMessage(this.message.messageId);
        },

        isMessageChecked() {
            return this.sharedPickState.messages.findIndex(m => m.messageId === this.message.messageId) >= 0;
        },
		isSingle () {
			return this.message.conversation.type === ConversationType.Single;
		}
    },
    components: {
        MessageContentContainerView,
        QuoteMessageView,
        LoadingView
    },
}
</script>

<style lang="scss" scoped>

.container {
    display: flex;
    align-items: flex-start;
}
.message-time-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 4px 12px;
    align-items: flex-start;
}

.message-time-container .time {
    align-self: center;
    color: #b4b4b4;
    margin-top: 10px;
    margin-bottom: 18px;
    font-size: 11px;
}

.message-time-container.checked {
    background-color: $cm-selected-message-bg-color;
}

.message-avatar-content-container {
    display: flex;
    max-width: calc(100% - 60px);
    align-items: flex-start;
    overflow: hidden;
    /*max-height: 800px;*/
    text-overflow: ellipsis;
}

.avatar-container .avatar {
    width: 40px;
    height: 40px;
    border-radius: 20px;
}

.avatar-container {
    display: flex;
    padding-left: 2px;
    align-items: center;
}

.avatar-container input {
    margin-right: 20px;
    flex: 1;
}

.message-name-content-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.message-name-content-container .name {
    margin-left: 10px;
    color: #bdbdbd;
    font-size: 12px;
    margin-bottom: 2px;
}

.name-time-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    margin-left: 10px;
    margin-bottom: 2px;
    white-space: nowrap; /* 不换行 */
}

.name-time-container .name {
	color: #C5DDF0;
    font-size: 12px;
    margin: 0;
    height: 16px;
    line-height: 16px;
}

.name-time-container .time {
    color: #90A4B6;
    font-size: 11px;
    margin: 0;
    height: 16px;
    line-height: 16px;
}

.message-content-container.highlight {
    background-color: $cm-split-line-color;
    opacity: 0.5;
    --in-arrow-color: $cm-split-line-color !important;
}

</style>
