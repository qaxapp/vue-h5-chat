/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import MediaMessageContent from './mediaMessageContent'
import MessageContentMediaType from './messageContentMediaType';
import MessageContentType from './messageContentType';
import { i18n } from '../../main.js'

export default class SoundMessageContent extends MediaMessageContent {
    duration;

    constructor(fileOrLocalPath, remotePath, duration) {
        super(MessageContentType.Voice, MessageContentMediaType.Voice, fileOrLocalPath, remotePath);
        this.duration = duration;
    }

    digest() {
        return i18n.global.t('message.chat_voice');
    }

    encode() {
        let payload = super.encode();
        payload.mediaType = MessageContentMediaType.Voice;
        let obj = {
            duration: this.duration,
        };
        payload.content = JSON.stringify(obj);
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let obj = JSON.parse(payload.content);
        this.duration = obj.duration;
    }
}
