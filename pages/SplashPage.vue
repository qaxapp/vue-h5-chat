<template>
	<section class="uni-page-head"></section>
</template>

<script>
// import {getItem} from "./util/storageHelper";
import wfc from "../wfc/client/wfc";
import store from "@/store";
import {getItem, setItem} from "./util/storageHelper";
import Conversation from "@/wfc/model/conversation";
import ConversationType from "@/wfc/model/conversationType";
export default {
    name: "SplashPage",
	data() {
	    return {
			sharedContactState: store.state.contact,
	        type: 0,
			conversationInfo: null,
	    }
	},
	onShow: function () {
	    console.log("App Show");
	    
	},
    onLoad(option) {
		
		if(option.wechat === 'true'){
			setItem("wechat", true);
				
			setItem("userId", option.userId);
			setItem("clientId", option.clientId);
			setItem("token", option.token);
			setItem("authToken-app",option.authTokenapp)  
			
			setItem("chatId", option.chatId);
			this.type=option.type
			setItem("type", option.type);
			
		}else{
			let userId = getItem('userId');
			let token = getItem('token')
			if (token) {
			    wfc.connect(userId, token);
			    this.go2ConversationList();
			} else {
			    uni.redirectTo({
			        url: '/pages/login/LoginPage',
			    })
			}
		}
       
    },
	// onReady() {
    //     wfc.connect(getItem('userId'), getItem('token'));
	// 	this.chat()	
    // },
    methods: {
		go2ConversationList() {
            uni.switchTab({
                url: '/pages/conversationList/ConversationListPage',
                success: () => {
                    console.log('to conversation list success');
                },
                fail: e => {
                    console.log('to conversation list error', e);
                },
                complete: () => {
                    console.log('switch tab complete')
                }
            });
        }
    }
}
</script>

<style scoped>

</style>