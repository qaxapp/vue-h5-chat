/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import NotificationMessageContent from './notificationMessageContent'
import MessageContentType from "../messageContentType";
import wfc from "../../client/wfc";
import { i18n } from '../../../main.js'
import SecretChatState from "../../model/secretChatState";

export default class StartSecretChatNotification extends NotificationMessageContent {

    constructor() {
        super(MessageContentType.StartSecretChat_Notification);
    }

    formatNotification(message) {
        let state = wfc.getSecretChatInfo(message.conversation.target).state;
        if (state === SecretChatState.Starting) {
            return i18n.global.t('chat.waiting_for_response');
        } else if (state === SecretChatState.Accepting) {
            return i18n.global.t('chat.establishing_private_chat');
        } else if (state === SecretChatState.Established) {
            return i18n.global.t('chat.private_chat_established');
        } else if (state === SecretChatState.Canceled) {
            return i18n.global.t('chat.private_chat_cancelled');
        } else {
            return i18n.global.t('chat.private_chat_unavailable');
        }
    }

    encode() {
        return super.encode();
    }

    decode(payload) {
        super.decode(payload);
    }
}
