<template>
    <section class="chatroom-info">
        <ul>
            <li>
                <div @click="showNewFriends" class="category-item-container">
                    <div class="category-item">
                        <span class="title">{{ $t('chatroom.icon') }}</span>
                        <img class="avatar" :src="chatroom.portrait ? chatroom.portrait : defaultPortraitUrl">
                    </div>
                </div>
            </li>
            <li>
                <div @click="showNewFriends" class="category-item-container">
                    <div class="category-item">
                        <span class="title">{{ $t('chatroom.chatroom') }}</span>
                        <span class="desc">{{ chatroom.title }}</span>
                    </div>
                </div>
            </li>
            <li>
                <div @click="showNewFriends" class="category-item-container">
                    <div class="category-item">
                        <span class="title">{{ $t('chatroom.chatroom_desc') }}</span>
                        <span class="desc">{{ chatroom.desc }}</span>
                    </div>
                </div>
            </li>
            <li>
                <div @click="showNewFriends" class="category-item-container">
                    <div class="category-item">
                        <span class="title">{{ $t('chatroom.chatroom_num') }}</span>
                        <span class="desc">{{ chatroom.memberCount }}</span>
                    </div>
                </div>
            </li>
            <li>
                <div @click="showNewFriends" class="category-item-container" >
                    <div class="category-item">
                        <span class="title">{{ $t('chatroom.mute_all_members') }}</span>
                        
                        <div class="switch-box">
                            <!-- <input id="switch" v-if="isManager" type="checkbox" v-model="check" @change="setMuteAll(conversationInfo.conversation.target, $event.target.checked)"> -->
                            <input id="switch"  type="checkbox" v-model="check" disabled>
                            <label></label>
                        </div>
                    </div>
                </div>
                
            </li>
        </ul>
    </section>
</template>

<script>
import ConversationInfo from "../../wfc/model/conversationInfo";
import store from "@/store";
import wfc from "../../wfc/client/wfc";
import appServerApi from "../../api/appServerApi";
export default {
    name: "ChatroomInfoView",
    props:{},
    data() {
        return {
			sharedContactState: store.state.contact,
            defaultPortraitUrl: '/assets/images/portrait.png',
            chatroom: {},
            check: false,
			conversationInfo: null,
        }
    },
    components: {},
    created() {
        
    },
    mounted() {
        // this.chatroom=this.conversationInfo.conversation._target
        // console.log('this.chatroom',this.conversationInfo)
        
        
    },
	onLoad(option) {
	    console.log('ChatroomInfoView  onLoad')
	    // #ifdef APP-NVUE
	    const eventChannel = this.$scope.eventChannel; // 兼容APP-NVUE
	    // #endif
	    // #ifndef APP-NVUE
	    const eventChannel = this.getOpenerEventChannel();
	    // #endif
	    eventChannel.on('conversationInfo', (options) => {
	        this.conversationInfo = options.conversationInfo;
	        console.log('this.chatroom',this.conversationInfo)
	        uni.setNavigationBarTitle({
	            title: this.conversationInfo.conversation._target.title+'的聊天室详情',
	        });
			this.getCurrentChatroomInfo()
	    })
	},
    methods: {
        getCurrentChatroomInfo() {
			console.log('this.conversationInfo',this.conversationInfo)
            let chatroomId = this.conversationInfo.conversation.target;
            wfc.getChatroomInfo(chatroomId, 0, info => {
                this.chatroom = info;
                this.check= info.state===0?false:true
                console.log('getChatroomInfo success', info);
            }, err => {
                console.error('getChatroomInfo error', chatroomId, err)
            })
        },
        async getChatroomMuteAll(chatroomId,mute) {
            appServerApi.getChatroomMuteAll({ chatroomId:chatroomId , mute:mute })
                .then(response => {
                    this.check= mute===1?true:false
                    console.log('getChatroomMuteAll11', response)  
                    
                })
                .catch(err => {
                    console.log('getChatroomMuteAll22', err)
                    
                })
        },
        setMuteAll(chatroomId, mu) {
            let mute = mu?1:0
            this.getChatroomMuteAll(chatroomId,mute)
            
        },

        clearRemoteConversationHistory(){
            wfc.clearRemoteConversationMessages(this.conversationInfo.conversation);
        }
    },

    computed: {}
};
</script>
<style lang="scss" scoped>
// 添加页面背景色
:deep(page) {
    background: $cm-bg-color;
}

.chatroom-info {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: flex-start;
    height: 100%;
    overflow: hidden;
}


.chatroom-info li:last-child{
    margin-top:40px;
    border-bottom: 0px;
    font-size: 14px;
}
.chatroom-info li{
    margin: 0 15px;
    padding: 10px 0;
    border-bottom: 1px solid $cm-split-line-color;
    font-size: 12px;
}
.category-item-container {
    height: 40px;
    display: flex;
    align-items: center;
    /* padding-left: 15px; */
    color: #262626;
    /* font-size: 14px; */
    position: sticky;
    /* top: 0; */
}

.category-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    
}
.avatar {
    width: 40px;
    height: 40px;
    border-radius: 3px;
}

.category-item span:last-of-type {
    margin-right: 15px;
}

.category-item .tip {
   
    padding-left: 5px;
    color: #7f7f7f;
}
.title{
   width:100px;
}
.arrow {
    border: solid #b9b9b9;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 3px;
    margin-right: 10px;
}

.right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
}

.left {
    transform: rotate(135deg);
    -webkit-transform: rotate(135deg);
}



.switch-box {
    position: relative;
    height: 25px;
}

.switch-box label {
    width: 50px;
    height: 25px;
    background: #ccc;
    position: relative;
    display: inline-block;
    border-radius: 46px;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.switch-box label:after {
    content: '';
    position: absolute;
    width: 21px;
    height: 25px;
    border-radius: 100%;
    left: 0;
    top: -5px;
    z-index: 2;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.switch-box input {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    opacity: 0;
}

.switch-box label:after {
    top: 0;
    width: 23px;
    height: 23px;
    margin: 1px 0;
}

.switch-box input:checked+label {
    background: #eb8597;
}

.switch-box input:checked+label:after {
    left: 30px;
}
</style>

