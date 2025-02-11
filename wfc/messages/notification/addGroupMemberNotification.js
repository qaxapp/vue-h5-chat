/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import MessageContentType from '../messageContentType';
import GroupNotificationContent from './groupNotification';
import { i18n } from '../../../main.js'

export default class AddGroupMemberNotification extends GroupNotificationContent {
    invitor = '';
    invitees = [];

    constructor(invitor, invitees) {
        super(MessageContentType.AddGroupMember_Notification);
        this.invitor = invitor;
        this.invitees = invitees;
    }

    formatNotification() {
        let notifyStr;
        if (this.invitees.length === 1 && this.invitees[0] === this.invitor) {
            if (this.fromSelf) {
                return i18n.global.t('chat.you') + ' ' +  i18n.global.t('chat.joined_group');
            } else {
                return wfc.getGroupMemberDisplayName(this.groupId, this.invitor) + ' ' + i18n.global.t('chat.joined_group');
            }
        }

        if (this.fromSelf) {
            notifyStr = i18n.global.t('chat.you') + ' ' +  i18n.global.t('chat.invited');
        } else {
            notifyStr = wfc.getGroupMemberDisplayName(this.groupId, this.invitor)  + ' ' +  i18n.global.t('chat.invited');
        }

        let membersStr = '';
        let userInfos = wfc.getUserInfos(this.invitees, this.groupId);
        userInfos.forEach(m => {
            membersStr += ' ' + m.displayName;
        });

        return notifyStr + membersStr + ' ' + i18n.global.t('chat.joined_group');
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            o: this.invitor,
            ms: this.invitees,
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let json = wfc.b64_to_utf8(payload.binaryContent);
        let obj = JSON.parse(json);
        this.groupId = obj.g;
        this.invitor = obj.o;
        this.invitees = obj.ms;
    }
}
