<template>
    <div class="chatroom-container">
        <div class="item" @click="go2Chatroom(item)" v-for="(item,index) in chatroomList">
			<image :src="item.portrait!='' ? item.portrait:'/assets/images/portrait.png'"/>
			<text>{{item.title}}</text>
        </div>
    </div>

</template>

<script>
import store from "../../store";
import Conversation from "../../wfc/model/conversation";
import ConversationType from "../../wfc/model/conversationType";
import appServerApi from "../../api/appServerApi";
export default {
    name: "ChatroomListPage",
    data() {
        return {
            user: store.state.contact.selfUserInfo,
            chatroomList:[]
        }
    },
	created() {
		this.getChatroomList();
		
	},
    methods: {
        go2Chatroom(chatroom) {
					let conversation = new Conversation(ConversationType.ChatRoom, chatroom.cid, 0);
					store.setCurrentConversation(conversation);
					this.$go2ConversationPage();
        },
		async getChatroomList() {
			appServerApi.getChatroomList({status:0})
				.then(response => {
					this.chatroomList = response;
				})
				.catch(err => {
					console.log('getChatroomList', err)
				})
		},
    }
}
</script>

<style lang="scss" lscoped>

.chatroom-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: $cm-bg-color; 
}

.item {
    width: 100%;
    height: 50px;
    padding: 30px 10px;
    display: flex;
    align-items: center;
	color: $cm-text-color;
    background: $cm-bg-color; 
	
	/* margin: 10px 0px; */
}
.item image {
    max-width: 40px;
    max-height: 40px;
    margin-right:30px;
	border-radius: 4px;
	
}
.item text {
    flex: 1;
}

.item i {
    color: $cm-bg-color; 
}

.item:active {
    background: $cm-bg-color; 
}


</style>