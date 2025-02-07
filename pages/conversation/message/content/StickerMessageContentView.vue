<template>
    <div class="sticker-content-container">
        <img v-show="imageLoaded === false" @click="preview(message)"
             v-bind:src="thumbnailUri()"
			 @error="onImageThumbnailError">
        <img v-show="imageLoaded" @click="preview(message)" @load="onImageLoaded"
             v-bind:src="message.messageContent.remotePath">
    </div>
</template>

<script>
import Message from "@/wfc/messages/message";
import Config from "../../../../config";
import MessageStatus from "../../../../wfc/messages/messageStatus";

export default {
    name: "StickerMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        }
    },
    data() {
        return {
            imageLoaded: false,
        }
    },
    methods: {
			thumbnailUri(){
				if (this.message.status === MessageStatus.Sending){
					return Config.DEFAULT_THUMBNAIL_URL;
				} else if (this.message.messageContent.thumbnail) {
					return 'data:video/jpeg;base64,' + this.message.messageContent.thumbnail;
				} else {
					return Config.DEFAULT_THUMBNAIL_URL;
				}
			},
			onImageThumbnailError(event) {
				// 图片加载失败时，设置为默认图片
				event.target.src = Config.DEFAULT_THUMBNAIL_URL;
			},
        preview(message) {
            // TODO
            console.log('TODO, preview sticker collection');
        },
        onImageLoaded() {
            this.imageLoaded = true
        }
    }
}
</script>

<style lang="scss" scoped>
.sticker-content-container {
    margin: 0 10px;
    position: relative;
    border: 1px solid $cm-split-line-color;
    border-radius: 5px;
}

.sticker-content-container img {
    width: 100px;
    height: 100px;
    max-height: 100px;
    max-width: 100px;
    border-radius: 5px;
    overflow: hidden;
}

.right-arrow:before {
    border-left-color: $cm-border-gray-color;
}

.left-arrow:before {
    border-left-color: $cm-border-gray-color;
}

</style>
