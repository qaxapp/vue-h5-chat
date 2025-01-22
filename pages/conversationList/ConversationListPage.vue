<template>
    <view class="conversation-list" @scroll="onScroll">
        <view v-if="connectionStatusDesc || unread === undefined" style="text-align: center; padding: 5px 0">{{ connectionStatusDesc }}</view>
        <uni-list :border="true" @scroll="onScroll">
            <view
                class="conversation-item"
                @click="showConversation(conversationInfo)"
                v-for="conversationInfo in sharedConversationState.conversationInfoList"
                :key="conversationInfoKey(conversationInfo)"
                v-bind:class="{top:conversationInfo.top }"
            >
                <ConversationItemView :conversation-info="conversationInfo" @longpress.native.prevent="showConversationContextMenu($event, conversationInfo)"/>
            </view>
        </uni-list>

        <chunLei-popups v-model="showContextMenu" :popData="contextMenuItems" @tapPopup="onContextMenuItemSelect" :x="contextMenuX" :y="contextMenuY" direction="column" theme="dark" :triangle="false" dynamic/>
        <main-action-menu ref="mainActionMenu"></main-action-menu>
    </view>
</template>

<script>

import ConversationItemView from "./ConversationItemView";
import store from "../../store";
import wfc from "../../wfc/client/wfc";
import ConnectionStatus from "../../wfc/client/connectionStatus";
import {getItem, removeItem} from "../util/storageHelper";
import organizationServerApi from "../../api/organizationServerApi";
import Conversation from "@/wfc/model/conversation";
import ConversationType from "@/wfc/model/conversationType";
export default {
    name: 'ConversationListPage',
    data() {
        return {
            sharedConversationState: store.state.conversation,
            sharedMiscState: store.state.misc,

            showContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
            contextMenuItems: [],
			sharedContactState: store.state.contact,
			type: 0,
			conversationInfo: null,
        };
    },

    onShow() {
  

        
        this.updateTabBarBadge();
    },
	created(){
		console.log('conversationList onShow', this.sharedConversationState.conversationInfoList.length)
		let userId = getItem('userId');
		let wechat = getItem('wechat');
		if (!userId) {
		    // 被踢等，需要退到登录页面
		    // 本来应当在启动应用，连接状态变化时处理，但可能会切换失败
		    // Waiting to navigate to: /pages/conversationList/ConversationListPage, do not operate continuously: /pages/login/LoginPage.
		    uni.reLaunch(
		        {
		            url: '/pages/login/LoginPage'
		        }
		    );
		}else{
			if(wechat===true){
		        wfc.connect(userId, getItem('token'));
				
				// console.log('77',this.sharedConversationState)
				uni.showLoading({
		            title:'loading'
		        })
				this.chat()
			}
		}
		
	},
    onReady() {
        
        // wfc.connect(getItem('userId'), getItem('token'));
		// this.chat()	
    },
    onLoad(){
       
    },
    onHide() {
        console.log('conversationList onHide');
        this.$refs.mainActionMenu.hide();
    },

    onNavigationBarButtonTap(e) {
        console.log('onNavigationBarButtonTap')
        switch (e.index) {
            case 0:
                this.$refs.mainActionMenu.toggle();
                break;
            case 1:
                this.$refs.mainActionMenu.hide();
                uni.navigateTo({
                    url: '/pages/search/SearchPortalPage'
                });
                break;
            default:
                break;
        }
    },
	mounted() {
		
        
	},
	
    methods: {
		chat() {
			let conversation = new Conversation(getItem('type')==0?ConversationType.Single:getItem('type')==1?ConversationType.Group:getItem('type')==2?ConversationType.ChatRoom:getItem('type')==3?ConversationType.Channel:ConversationType.SecretChat, getItem("chatId"), 0);
			// let conversation = new Conversation(ConversationType.Single, getItem("chatId"), 0);
            store.setCurrentConversation(conversation);
			// 不加延时的话，不能正常切换页面，会报莫名其妙的错误
			setTimeout(() => {
					uni.redirectTo({
						url:'/pages/conversation/Customer',
						success: () => {
						   
							console.log('to conversation list success');
						},
						fail: e => {
							console.log('to conversation list error', e);
						},
						complete: () => {
							console.log('switch tab complete')
						}
					})
				
			}, 50)
			
		
			
		},
        showConversation(conversationInfo) {
            store.setCurrentConversationInfo(conversationInfo);
            this.$go2ConversationPage();
        },

        removeConversation(conversationInfo) {
            store.removeConversation(conversationInfo.conversation);
        },

        conversationInfoKey(conversationInfo) {
            let conv = conversationInfo.conversation;
            return conv.target + '-' + conv.type + '-' + conv.line;
        },
        scrollActiveElementCenter() {
            let el = this.$el.getElementsByClassName("active")[0];
            el && el.scrollIntoView({behavior: "instant", block: "center"});
        },

        onScroll() {
            // TODO
        },

        showConversationContextMenu(e, conversationInfo) {
            this.contextMenuX = e.touches[0].clientX;
            this.contextMenuY = e.touches[0].clientY;
            this.contextMenuItems = [];

            this.contextMenuItems.push({
                title: conversationInfo.top ? '取消置顶' : '置顶',
                tag: 'top',
                conversationInfo: conversationInfo,
            })

            this.contextMenuItems.push({
                title: conversationInfo.isSilent ? '取消静音' : '静音',
                tag: 'silent',
                conversationInfo: conversationInfo,
            })

            this.contextMenuItems.push({
                title: '删除会话',
                tag: 'delete',
                conversationInfo: conversationInfo,
            })

            this.contextMenuItems.push({
                title: conversationInfo._unread === 0 ? '标记为未读' : '标记为已读',
                tag: 'mark',
                conversationInfo: conversationInfo,
            })
            this.showContextMenu = true;

        },

        onContextMenuItemSelect(t) {
            switch (t.tag) {
                case 'delete':
                    store.removeConversation(t.conversationInfo.conversation);
                    break;
                case 'top':
                    store.setConversationTop(t.conversationInfo.conversation, t.conversationInfo.top > 0 ? 0 : 1);
                    break;
                case 'silent':
                    store.setConversationSilent(t.conversationInfo.conversation, !t.conversationInfo.isSilent);
                    break;
                case 'mark':
                    let conversation = t.conversationInfo.conversation;
                    if (t.conversationInfo._unread === 0) {
                        wfc.markConversationAsUnread(conversation, true);
                    } else {
                        wfc.clearConversationUnreadStatus(conversation);
                    }
                    break;
                default:
                    uni.showToast({
                        title: 'TODO ' + t.title,
                        icon: 'none'
                    })
                    break;

            }
        },

        updateTabBarBadge() {
            let newValue = this.unread;
            if (newValue > 0) {
                uni.setTabBarBadge({
                    index: 0,
                    text: '' + newValue
                })
            } else {
                uni.removeTabBarBadge({
                    index: 0
                })
            }
        }
    },
    activated() {
        this.scrollActiveElementCenter();
    },

    computed: {
        connectionStatusDesc() {
            let desc = '';
            switch (this.sharedMiscState.connectionStatus) {
                case ConnectionStatus.ConnectionStatusConnecting:
                    desc = '正在连接...';
                    break;
                case ConnectionStatus.ConnectionStatusReceiveing:
                    desc = '正在同步...';
                    break;
                case ConnectionStatus.ConnectionStatusConnected:
                    organizationServerApi.login().then(r => console.log('org login result', r)).catch(reason => console.log('org login fail ', reason));
                    desc = '';
                   
                    break;
                case ConnectionStatus.ConnectionStatusUnconnected:
                    desc = '连接失败';
                    break;
            }
            return desc;
        },
        unread() {
            let count = 0;
            this.sharedConversationState.conversationInfoList.forEach(info => {
                if (info.isSilent) {
                    return;
                }
                let unreadCount = info.unreadCount;
                count += unreadCount.unread;
            });
            return count;
        }
    },
    updated() {
        console.log('updated xxx')
    },

    components: {
        ConversationItemView,
    },
};
</script>

<style lang="css" scoped>

.conversation-list {
    height: var(--page-full-height-without-header-and-tabbar);
    overflow: auto;
    background: #212332;
}

.conversation-list .top {
    background-color: #212332;
}

.conversation-item {
    position: relative;
}

.conversation-item::after {
    content: ""; /* 使伪元素可见 */
    position: absolute;
    left: 65px; /* 偏移量 */
    right: 0;
    bottom: 0;
    border-bottom: 1px solid #909AB6; /* 定义边框样式 */
}

</style>
