/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import MessageContent from "./messageContent";
import MessageContentType from "./messageContentType";
import { i18n } from '../../main.js'

export default class UnknownMessageContent extends MessageContent {
    originalPayload;

    constructor(originalPayload) {
        super(MessageContentType.Unknown);
        this.originalPayload = originalPayload;
    }

    encode() {
        return this.originalPayload;
    }

    decode(paylaod) {
        this.originalPayload = paylaod;
    }

    digest() {
        return i18n.global.t('message.chat_unknown_message_type');
    }
}