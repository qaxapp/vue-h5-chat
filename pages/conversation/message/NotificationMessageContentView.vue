<template>
    <div class="notification-container">
        <p class="notification">{{ message.messageContent.digest(message) }}</p>
    </div>
</template>

<script>

import Message from "@/wfc/messages/message";

export default {
    name: "NotificationMessageContentView",
    props: {
        message: {
            type: Message,
            required: true
        }
    },
    components: {}
}
</script>

<style lang="css" scoped>
.notification-container {
    display: flex;
    justify-content: center;
}

.notification-container .notification {
    margin: 20px 10px;
    color: #90A4B6;
    font-size: 11px;
}

</style>
