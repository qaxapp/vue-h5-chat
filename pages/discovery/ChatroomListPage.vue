<template>
    <div class="chatroom-container">
        <div class="item" @click="go2Chatroom(item.cid)" v-for="(item,index) in chatroomList">
			<image :src="item.portrait ? item.portrait:'/assets/images/portrait.png'"/>
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
        go2Chatroom(index) {
            let conversation = new Conversation(ConversationType.ChatRoom,index , 0);
            store.setCurrentConversation(conversation);
            this.$go2ConversationPage();
        },
		async getChatroomList() {
			appServerApi.getChatroomList({status:0})
				.then(response => {
					console.log('sss',response)
					// response.map(item=>{
					// 	item.chatRoomId=item.cid
					// })
					this.chatroomList = response;
					
				})
				.catch(err => {
					console.log('getChatroomList', err)
					
				})
		},
    }
}
</script>

<style scoped>

.chatroom-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: #fafafa;
}

.item {
    width: 100%;
    height: 50px;
    padding: 30px 10px;
    background: white;
    display: flex;
    align-items: center;
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
    color: #d6d6d6;
}

.item:active {
    background: #d6d6d6;
}


</style>