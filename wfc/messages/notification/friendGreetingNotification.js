/*
 * Copyright (c) 2022 WildFireChat. All rights reserved.
 */

import NotificationMessageContent from "./notificationMessageContent";
import MessageContentType from "../messageContentType";
import { i18n } from '../../../main.js'

export default class FriendGreetingNotification extends NotificationMessageContent {
    constructor() {
        super(MessageContentType.Friend_Greeting);
    }

    formatNotification(message) {
        return i18n.global.t('message.greeting_content');
    }
}
