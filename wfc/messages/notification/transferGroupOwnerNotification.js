/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import { i18n } from '../../../main.js'
import MessageContentType from '../messageContentType';
import GroupNotificationContent from './groupNotification';

export default class TransferGroupOwnerNotification extends GroupNotificationContent {
    operator = '';
    newOwner = '';

    constructor(operator, newOwner) {
        super(MessageContentType.TransferGroupOwner_Notification);
        this.operator = operator;
        this.newOwner = newOwner;
    }

    formatNotification() {
        if (this.fromSelf) {
            return i18n.global.t('chat.you') + ' ' + i18n.global.t('chat.transferred_group_to') + ' ' + wfc.getGroupMemberDisplayName(this.groupId, this.newOwner);
        } else {
            return wfc.getGroupMemberDisplayName(this.groupId, this.operator) + ' ' + i18n.global.t('chat.transferred_group_to') + ' ' + wfc.getGroupMemberDisplayName(this.groupId, this.newOwner)
        }
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            o: this.operator,
            m: this.newOwner,
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
        this.newOwner = obj.m;
    }
}
