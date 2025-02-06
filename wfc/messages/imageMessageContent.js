/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import MediaMessageContent from './mediaMessageContent';
import MessageContentMediaType from './messageContentMediaType';
import MessageContentType from './messageContentType';
import { i18n } from '../../main.js'

export default class ImageMessageContent extends MediaMessageContent {
    // base64 encoded, 不包含头部:data:image/png;base64,
    thumbnail;
    imageWidth;
    imageHeight;


    constructor(fileOrLocalPath, remotePath, thumbnail) {
        super(MessageContentType.Image, MessageContentMediaType.Image, fileOrLocalPath, remotePath);
        this.thumbnail = thumbnail;
    }

    digest() {
        return i18n.global.t('message.chat_picture');
    }

    encode() {
        let payload = super.encode();
        payload.mediaType = MessageContentMediaType.Image;
        payload.binaryContent = this.thumbnail;
        if (this.imageWidth) {
            let obj = {
                w: this.imageWidth,
                h: this.imageHeight
            }
            payload.content = JSON.stringify(obj)
        }
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        this.thumbnail = payload.binaryContent;
        if (payload.content) {
            let obj = JSON.parse(payload.content)
            this.imageWidth = obj['w'];
            this.imageHeight = obj['h'];
        }
    }
}
