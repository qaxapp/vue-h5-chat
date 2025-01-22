<template>
    <div class="text-message-container"
         v-bind:class="{out:message.direction === 0}">
        <p class="text" v-html="this.textContent" ></p>
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import {parser as emojiParse} from "@/emoji/emoji";

export default {
    name: "TextMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        }
    },
    data() {
        return {
            textSelected: false,
        }
    },
    mounted() {
    },

    methods: {
        escapeHtml(text) {
            return text.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/ /g, '&nbsp;')
                .replace(/<script/gi, "&lt;script")
                .replace(/<iframe/gi, "&lt;iframe");
        }
    },

    computed: {
        textContent() {
            let content = this.message.messageContent.digest(this.message);
            let lines = content.split('\n');
            if (lines.length > 1) {
                content = lines.map(line => `<span>${this.escapeHtml(line)}</span>\n`).reduce((total, cv, ci, arr) => total + cv, '');
            } else {
               content = this.escapeHtml(content)
                }

            content = emojiParse(content);
            // tmp = marked.parse(tmp);
            if (content.indexOf('<img') >= 0) {
                content = content.replace(/<img/g, '<img style="max-width:400px;"')
                return content;
            }
            return content;
        }
    }
}
</script>

<style lang="scss" scoped>
.text-message-container {
    margin: 0 10px;
    padding: 10px;
    // background-color: white;
    position: relative;
    border-radius: 0 8px 8px 8px; /* 设置圆角 */
    display: flex;
    align-items: center;
    background-color: $cm-received-message-bg-color;

}

.text-message-container p {
    user-select: text;
    white-space: pre-line;
}

.text-message-container.out {
    background-color: $cm-sent-message-bg-color;
	
    border-radius: 8px 0 8px 8px; /* 设置圆角 */


}

.text-message-container .text {
    font-size: 12px;
    font-weight:500;
    line-height: 25px;
    /*max-width: 600px;*/
    max-height: 1000px;
    word-break: break-word;
    overflow: hidden;
    display: inline-block;
    user-select: none;
    text-overflow: ellipsis;
    color: white;

}

/*style for v-html */
.text-message-container .text >>> img {
    max-width: 200px !important;
    display: inline-block;
}

.text-message-container .text >>> a{
    white-space: normal;
}

</style>
