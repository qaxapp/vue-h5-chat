<template>
    <div class="image-content-container">
        <img ref="thumbnail" v-show="imageLoaded === false" @click="preview(message)"
             v-bind:src="thumbnailUri()"
			  		@error="onImageThumbnailError">
        <img ref="img" v-show="imageLoaded" @click="preview(message)" @load="onImageLoaded"
             draggable="true"
             v-bind:src="message.messageContent.remotePath">
    </div>
</template>

<script>
import Message from "../../../../wfc/messages/message";
import {scaleDown} from "../../../util/imageUtil";
import Config from "../../../../config";
import MessageStatus from "../../../../wfc/messages/messageStatus";

export default {
    name: "ImageMessageContentView",
    props: {
        message: {
            type: Message,
            required: true,
        },
        isInCompositeView: {
            default: false,
            type: Boolean,
            required: false,
        }
    },
    data() {
        return {
            imageLoaded: false,
        }
    },
    mounted() {
        let iw = this.message.messageContent.imageWidth;
        let ih = this.message.messageContent.imageHeight;
        if (iw && ih) {
            let size = scaleDown(iw, ih, 300, 300);
            if (size) {
                this.$refs.img.style.height = size.height + 'px';
                this.$refs.img.style.width = size.width + 'px';
                this.$refs.thumbnail.style.height = size.height + 'px';
                this.$refs.thumbnail.style.width = size.width + 'px';
            }
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
            if (this.isInCompositeView) {
                this.$parent.previewCompositeMessage(message.messageUid);
            } else {
                console.log('preview', message);
                //store.previewMessage(message, true);
                uni.previewImage({
                    current: 1,
                    urls: [this.message.messageContent.remotePath]
                });
            }
        },
        onImageLoaded() {
            this.imageLoaded = true
        }
    }
}
</script>

<style lang="scss" scoped>
.image-content-container {
    margin: 0 10px;
    position: relative;
    border: 1px solid $cm-split-line-color;
    border-radius: 5px;
}

.image-content-container img {
    max-height: 300px;
    max-width: 200px;
    border-radius: 5px;
    overflow: hidden;
    object-fit: scale-down;
}

.right-arrow:before {
    border-left-color: $cm-border-gray-color;
}

.left-arrow:before {
    border-left-color: $cm-border-gray-color;
}

</style>
