/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import MessageContentType from '../messageContentType';
import { i18n } from '../../../main.js'
import GroupNotificationContent from './groupNotification';

export default class CreateGroupNotification extends GroupNotificationContent {
    creator = '';
    groupName = '';

    constructor(creator, groupName) {
        super(MessageContentType.CreateGroup_Notification);
        this.creator = creator;
        this.groupName = groupName;
    }

    formatNotification() {
        if (this.fromSelf) {
            return i18n.global.t('chat.you') + ' ' + i18n.global.t('chat.created_group') + ' ' + this.groupName;
        } else {
            return wfc.getUserDisplayName(this.creator) + ' ' + i18n.global.t('chat.created_group') + ' ' + this.groupName;
        }
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            n: this.groupName,
            o: this.creator,
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let json = wfc.b64_to_utf8(payload.binaryContent)
        let obj = JSON.parse(json);
        this.groupId = obj.g;
        this.creator = obj.o;
        this.groupName = obj.n;
    }
}
