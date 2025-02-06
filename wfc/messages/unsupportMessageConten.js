/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import MessageContent from "./messageContent";
import { i18n } from '../../main.js'

export default class UnsupportMessageContent extends MessageContent {

    digest() {
        return i18n.global.t('message.chat_unknown_message_type') + ' ' + this.type;
    }
}