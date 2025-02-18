<template>
    <div class="notification-container">
        <p class="notification">{{ message.messageContent.digest(message) }}</p>
<!--        <a v-if="isReeditable(message)" href="#" @click="reedit">{{ $t('chat_im_i18n.re_edit') }}</a>-->
    </div>
</template>

<script>

import Message from "@/wfc/messages/message";
import wfc from "@/wfc/client/wfc";
import MessageContentType from "@/wfc/messages/messageContentType";
import {numberValue} from "@/wfc/util/longUtil";
import Config from "@/config";

export default {
    name: "RecallNotificationMessageContentView",
    props: {
        message: {
            type: Message,
            required: true
        }
    },
    methods: {
        isReeditable() {
            let delta = wfc.getServerDeltaTime();
            let now = new Date().getTime();
            let recallMessageContent = this.message.messageContent;
            if (recallMessageContent.originalContentType === MessageContentType.Text
                && recallMessageContent.fromSelf
                && now - (numberValue(this.message.timestamp) - delta) < Config.RECALL_REEDIT_TIME_LIMIT * 1000) {
                return true;
            }
            return false;
        },
        reedit() {
            this.$parent.reedit(this.message);
        }
    },
    components: {}
}
</script>

<style lang="css" scoped>
.notification-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.notification-container .notification {
    margin: 16px 10px 0 10px;
    color: #90A4B6;
    font-size: 11px;
}

.notification-container a {
    color: #1EFFE4;
    text-decoration: none;
    margin-right: 10px;
    font-size: 14px;
}

</style>
