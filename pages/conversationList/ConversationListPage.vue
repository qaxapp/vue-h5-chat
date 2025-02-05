<template>
	
    <view class="conversation-list" @scroll="onScroll" >
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
			wechat: false,
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
		console.log('conversationList onShow', this.sharedConversationState.conversationInfoList.length)
		let userId = getItem('userId');
		this.wechat = getItem('wechat');
		
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
			if(this.wechat){
				uni.showLoading({
					title:'loading'
					
				})
			}
		}
        
	},
	
    methods: {
		chat() {
			let conversation = new Conversation(getItem('type')==0?ConversationType.Single:getItem('type')==1?ConversationType.Group:getItem('type')==2?ConversationType.ChatRoom:getItem('type')==3?ConversationType.Channel:ConversationType.SecretChat, getItem("chatId"), 0);
			store.setCurrentConversation(conversation);
            // uni.hideLoading()
			
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
					},100)
						
					
				
			
			
		
			
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
                title: this.$t('chat_im_i18n.delete_conversation'),
                tag: 'delete',
                conversationInfo: conversationInfo,
            })
            this.showContextMenu = true;

        },

        onContextMenuItemSelect(t) {
            switch (t.tag) {
                case 'delete':
                    store.removeConversation(t.conversationInfo.conversation);
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
                    desc = this.$t('chat_im_i18n.connecting');
                    break;
                case ConnectionStatus.ConnectionStatusReceiveing:
                    desc = this.$t('chat_im_i18n.syncing');
                    break;
                case ConnectionStatus.ConnectionStatusConnected:
                    //organizationServerApi.login().then(r => console.log('org login result', r)).catch(reason => console.log('org login fail ', reason));
                    desc = '';
					if(this.wechat===true){
					   
						this.chat()
					}
                    break;
                case ConnectionStatus.ConnectionStatusUnconnected:
                    desc = this.$t('chat_im_i18n.connection_failed');
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

<style lang="scss" scoped>

.conversation-list {
    height: var(--page-full-height-without-header-and-tabbar);
    overflow: auto;
    background: $cm-bg-color;
	color: $cm-text-color;
}

.conversation-list .top {
    background-color: $cm-bg-color;
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
    border-bottom: 1px solid $cm-split-line-color; /* 定义边框样式 */
}

</style>
