<template>
    <section class="search-conversation-message-container">
        <input class="input" type="text" v-model="query" :placeholder="$t('common.search')" @input="search">
        <label class="category"> {{$t('chat.chat_history')}} </label>
        <ul>
            <li v-for="(msg, index) in messages" :key="index">
                <div class="search-result-item" @click="onClickMessage(msg)">
                    <img :src="conversationInfo.conversation._target.portrait" alt="">
                    <div class="title-desc">
                        <span>{{ msg._from._displayName }}</span>
                        <span class="desc">{{ msg.messageContent.digest(msg) }}</span>
                    </div>
                </div>
            </li>
        </ul>
    </section>
</template>

<script>
import store from "@/store";

export default {
    name: "SearchResultView",
    data() {
        return {
            query: store.state.search.query,
            conversationInfo: store.getConversationInfo(store.state.search.conversation),
            messages: [],
        }
    },

    mounted() {
        this.search();
    },

    beforeUnmount() {
        store.state.search.conversation = null;
    },

    methods: {
        search() {
            //store.setSearchQuery(this.keyword)
            if (this.query && this.query.trim()) {
                this.messages = store.searchMessage(this.conversationInfo.conversation, this.query);
            } else {
                this.messages = [];
            }
        },

        onClickMessage(msg) {
            // fixme 跳转到具体的消息处
            // TODO 跳转到具体的消息处
            store.setCurrentConversation(msg.conversation);
            this.$go2ConversationPage();
        },
    },

    directives: {},

}
</script>

<style lang="scss" scoped>

.search-conversation-message-container {
    z-index: 100;
    position: relative;
    overflow: auto;
	color: $cm-text-color;
    background-color: $cm-bg-color;
}

.search-conversation-message-container .input {
    height: 35px;
    width: 100%;
    padding: 5px 10px;
    margin-bottom: 5px;
	color: $cm-text-color;
    background-color: $cm-bg-color;
    border-bottom: 1px solid $cm-split-line-color;
    position: fixed;
    left: 0;
    top: 0;
}

.search-conversation-message-container .category {
    display: block;
    margin-top: 40px;
    margin-left: 10px;
    color: $cm-text-color;
    border-bottom: 1px solid $cm-split-line-color;
}

.search-conversation-message-container ul {
    list-style: none;
    background-color: $cm-bg-color;
    overflow: auto;
}

.category-item label {
    color: $cm-text-color;
    display: block;
    padding-top: 10px;
    padding-bottom: 2px;
    margin-left: 12px;
    border-bottom: 1px solid $cm-split-line-color;
}

.search-result-item {
    background-color: $cm-bg-color;
    padding: 10px 12px;
    display: flex;
    align-items: center;
}

.search-result-item:active {
    background-color: $cm-bg-color;
}

.search-result-item img {
    width: 34px;
    height: 34px;
    border-radius: 2px;
}

.search-result-item span {
    font-size: 14px;
    padding-left: 10px;
}

.search-result-item .title-desc {
    display: flex;
    flex-direction: column;
}

.search-result-item .title-desc .desc {
    font-size: 12px;
    color: grey;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}


</style>
