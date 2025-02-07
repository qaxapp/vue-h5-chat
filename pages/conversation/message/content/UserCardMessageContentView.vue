<template>
    <div ref="userCardTippy"
         :name="'userCardInfoTrigger' + message.messageId"
				 @click="showUserDetail"
         class="user-card-content-container">
        <div class="portrait-name-container">
            <img :src="message.messageContent.portrait" @error="onImageError" >
            <p>{{ message.messageContent.displayName }}</p>
        </div>
        <p class="desc single-line">{{ $t('chat_im_i18n.contact_card') }}</p>
   <!--     <tippy
            :to="'userCardInfoTrigger' + message.messageId"
            interactive
            :animate-fill="false"
            placement="left"
            distant="7"
            theme="dark"
            animation="fade"
            trigger="click"
        >
            <UserCardView v-on:close="closeUserCard" :user-info="userInfo()"/>
        </tippy> -->
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import UserCardView from "@/pages/user/UserCardView";
import wfc from "@/wfc/client/wfc";
import store from "../../../../store";
import Config from "../../../../config";

export default {
    name: "UserCardMessageContentView",
    props: {
        message: {
            required: true,
            type: Message,
        }
    },
    components: {
        UserCardView,
    },

    methods: {
			onImageError(event) {
				// 图片加载失败时，设置为默认图片
				event.target.src = Config.DEFAULT_PORTRAIT_URL;
			},

			closeUserCard() {
            console.log('closeUserCard')
            this.$refs["userCardTippy"]._tippy.hide();
        },
        userInfo() {
            let userCard = this.message.messageContent;
            if (userCard.cardType === 0) {
                return wfc.getUserInfo(userCard.target)
            }
        },
		
		showUserDetail() {
			let userCard = this.message.messageContent;
			let userInfo = wfc.getUserInfo(userCard.target);
			store.setCurrentFriend(userInfo);
			uni.navigateTo({
			    url: '/pages/contact/UserDetailPage',
			    success: () => {
			        console.log('nav to UserDetailPage success');
			    },
			    fail: (err) => {
			        console.log('nav to UserDetailPage err', err);
			    }
			})
		}
    }
}
</script>

<style scoped lang="scss">
.user-card-content-container {
    width: 230px;
    height: 100px;
    margin: 0 10px;
    padding: 10px;
    background-color:$cm-received-message-bg-color;
    position: relative;
    border-radius: 5px;
	  color: $cm-text-color;
}

.portrait-name-container {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid $cm-split-line-color;
}

.portrait-name-container img {
    width: 45px;
    height: 45px;
    border-radius: 3px;
}

.portrait-name-container p {
    padding-left: 10px;
    padding-right: 10px;
}

.desc {
    padding-top: 8px;
    font-size: 13px;
    color: #b8b8b8;
}

</style>