/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import NotificationMessageContent from "./notificationMessageContent";
import MessageContentType from "../messageContentType";
import { i18n } from '../../../main.js'

export default class FriendAddedNotification extends NotificationMessageContent {

    constructor() {
        super(MessageContentType.Friend_Added);
    }

    formatNotification() {
        return i18n.global.t('message.already_friends');
    }
}
