/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import MessageContentType from "../messageContentType";
import { i18n } from '../../../main.js'
import GroupNotificationContent from "./groupNotification";

export default class ChangeGroupPortraitNotification extends GroupNotificationContent {
    operator = '';

    constructor(operator) {
        super(MessageContentType.ChangeGroupPortrait_Notification);
        this.operator = operator;
    }

    formatNotification() {
        if (this.fromSelf) {
            return i18n.global.t('chat.you') + ' ' + i18n.global.t('chat.modified_group_avatar');
        } else {
            return wfc.getGroupMemberDisplayName(this.groupId, this.operator) + ' ' + i18n.global.t('chat.modified_group_avatar');
        }
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            n: this.name,
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let json = wfc.b64_to_utf8(payload.binaryContent)
        let obj = JSON.parse(json);
        this.groupId = obj.g;
        this.operator = obj.o;
    }

}
