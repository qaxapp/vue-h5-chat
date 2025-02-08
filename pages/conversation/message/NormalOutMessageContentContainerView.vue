<template>
    <div>
        <div class="message-time-container" v-bind:class="{checked:sharedPickState.messages.indexOf(message) >= 0}">
            <p v-if="this.message._showTime" class="time">{{ message._timeStr }}</p>
            <div class="message-content-container"
                 v-bind:class="{checked:sharedPickState.messages.indexOf(message) >= 0}">
                <checkbox id="checkbox" v-if="sharedConversationState.enableMessageMultiSelection" type="checkbox"
                          class="checkbox"
                          :checked="isMessageChecked"
                          :value="message" placeholder=""/>

                <div class="message-avatar-content-container">
                    <LoadingView v-if="message.status === 0 || isDownloading"/>
                    <div class="flex-column flex-align-end">
                        <div class="message-content-wrapper">
                            <view class="receipt-status">
                                <i v-if="message.status === 2" class="icon-ion-close-circled" style="color: red" @click="resend"/>
                                <image v-else-if="shouldShowMessageReceipt" :src="receiptIcon" mode="aspectFit" class="receipt-icon" @click="showMessageReceiptDetail"/>
                            </view>
                            <MessageContentContainerView :message="message"
                                                     class="message-content-container-view"
                                                     @longpress.native.prevent="openMessageContextMenu($event, message)"/>
                        </div>
                        <QuoteMessageView v-if="quotedMessage"
                                          style="padding: 5px 0; max-width: 80%"
                                          :message="message"
                                          :quoted-message="quotedMessage"
                                          :message-digest="this.message.messageContent.quoteInfo.messageDigest"
                                          :show-close-button="false"/>
                    </div>

                    <img
                        class="avatar"
                        @click="onClickUserPortrait(message.from)"
                        draggable="false"
												@error="onImageError"
                        :src="message._from.portrait" alt="">
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import Message from "@/wfc/messages/message";
import MessageContentContainerView from "@/pages/conversation/message/MessageContentContainerView";
import store from "@/store";
import LoadingView from "@/pages/common/LoadingView";
import wfc from "@/wfc/client/wfc";
import ConversationType from "@/wfc/model/conversationType";
import {gte} from "@/wfc/util/longUtil";
import QuoteMessageView from "@/pages/conversation/message/QuoteMessageView";
import Config from "@/config";
import { getItem } from "../../util/storageHelper";
export default {
    name: "NormalOutMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },
    },
    data() {
        return {
			userInfo:null,
			wechat:false,
            sharedConversationState: store.state.conversation,
            sharedPickState: store.state.pick,
            highLight: false,
            quotedMessage: null,
        }
    },
    components: {
        QuoteMessageView,
        LoadingView,
        MessageContentContainerView,
        // TextMessageContentView,

    },
    mounted() {
		if(getItem('wechat')){
			
			this.userInfo=  wfc.getUserInfo(getItem('userId'), true);
			this.wechat = getItem('wechat')
		}
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
    methods: {
		onImageError(event) {
			// 图片加载失败时，设置为默认图片
			event.target.src = Config.DEFAULT_PORTRAIT_URL;
		},
        onClickUserPortrait(userId) {
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
        resend() {
            wfc.deleteMessage(this.message.messageId);
            wfc.sendMessage(this.message);
        },
        openMessageContextMenu(event, message) {
            this.$eventBus.$emit('openMessageContextMenu', [event, message])
            this.highLight = true;
        },

        showMessageReceiptDetail() {
            let conversation = this.message.conversation;
            if (conversation.type === ConversationType.Single) {
                return;
            }

            let timestamp = this.message.timestamp;
            let readEntries = this.sharedConversationState.currentConversationRead;

            if (conversation.type === ConversationType.Group) {
                let groupMembers = wfc.getGroupMemberIds(conversation.target, false);
                if (!groupMembers || groupMembers.length === 0) {
                    // do nothing
                } else {
                    let readUserIds = [];
                    let unreadUserIds = [];
                    groupMembers.forEach(memberId => {
                        let readDt = readEntries ? readEntries.get(memberId) : 0;
                        if (readDt && gte(readDt, timestamp)) {
                            readUserIds.push(memberId);
                        } else {
                            unreadUserIds.push(memberId)
                        }
                    });
                    let readUsers = store.getUserInfos(readUserIds, conversation.target)
                    let unreadUsers = store.getUserInfos(unreadUserIds, conversation.target)

                    // TODO 消息已读页面
                    // this.$modal.show(
                    //     MessageReceiptDetailView,
                    //     {
                    //         readUsers: readUsers,
                    //         unreceiveUsers: unreadUsers,
                    //     }, {
                    //         name: 'message-receipt-detail-modal',
                    //         width: 480,
                    //         height: 300,
                    //         clickToClose: true,
                    //     }, {})
                }
            }
        },
    },

    computed: {
        receiptIcon() {
            let conversation = this.message.conversation;
            let timestamp = this.message.timestamp;
            let readEntries = this.sharedConversationState.currentConversationRead;
			if (conversation.type == ConversationType.ChatRoom) {
				return '';
			} else if (conversation.type === ConversationType.Single) {
                let readDt = readEntries ? readEntries.get(conversation.target) : 0
                readDt = readDt ? readDt : 0;
                if (gte(readDt, timestamp)) {
                    return '/assets/images/read.png';
                } else {
                    return '/assets/images/unread.png';
                }
            } else {
                let groupMembers = wfc.getGroupMemberIds(conversation.target, false);
                if (!groupMembers || groupMembers.length === 0) {
                    return '/assets/images/unread.png';
                } else {
                    let memberCount = groupMembers.length;
                    let readCount = 0;

                    groupMembers.forEach(memberId => {
                        let readDt = readEntries ? readEntries.get(memberId) : 0;
                        if (readDt && gte(readDt, timestamp)) {
                            readCount++;
                        }
                    });
                    
                    if (readCount === 0) {
                        return '/assets/images/unread.png';
                    } else if (readCount === memberCount) {
                        return '/assets/images/read.png';
                    } else {
                        return '/assets/images/half-read.png';
                    }
                }
            }
        },

        isDownloading() {
            return store.isDownloadingMessage(this.message.messageId);
        },

        shouldShowMessageReceipt() {
            return this.sharedConversationState.isMessageReceiptEnable && ["FireRobot", Config.FILE_HELPER_ID].indexOf(this.message.conversation.target) < 0;
        },

        isMessageChecked() {
            return this.sharedPickState.messages.findIndex(m => m.messageId === this.message.messageId) >= 0;
        }
    },

}
</script>

<style lang="scss" scoped>

.message-time-container {
    width: 100%;
    display: flex;
    flex-direction: column;	
	
}

.message-time-container.checked {
    background-color: $cm-selected-message-bg-color;
}

.message-time-container .time {
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
    color: #b4b4b4;
    font-size: 10px;
    /* background-color: #f3f3f3; */
}

.message-time-container .receipt {
    margin-right: 70px;
    font-size: 12px;
    margin-top: -10px;
    color: #b4b4b4;
}

.message-content-container {
    width: 100%;
    display: flex;
	padding: 5px 12px;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.receipt-status {
    margin-right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.receipt-icon {
    width: 32rpx;
    height: 32rpx;
    opacity: 0.6;
}

.icon-ion-close-circled {
    font-size: 32rpx;
}

.message-avatar-content-container {
    display: flex;
    max-width: calc(100% - 60px);
    overflow: hidden;
    margin-left: auto;
    text-overflow: ellipsis;
    align-items: flex-start;
    position: relative;
}

.message-avatar-content-container .avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.message-avatar-content-container :deep(.loading-container) {
    align-self: center;
}

.message-content-container-view.highlight {
    background-color: $cm-split-line-color;
    opacity: 0.5;
    --out-arrow-color: $cm-split-line-color !important;
}

.message-content-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

</style>
