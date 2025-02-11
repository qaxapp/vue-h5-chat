/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import MessageContentType from '../messageContentType';
import { i18n } from '../../../main.js'
import GroupNotificationContent from './groupNotification';

export default class ModifyGroupMemberExtraNotification extends GroupNotificationContent {
    operator = '';
    groupMemberExtra = '';
    memberId = '';

    constructor(creator, groupMemberExtra) {
        super(MessageContentType.ModifyGroupMemberExtra_Notification);
        this.operator = creator;
        this.groupMemberExtra = groupMemberExtra;
    }

    formatNotification() {
				let operatorName = ''
				if (this.fromSelf) {
					operatorName = i18n.global.t('chat.you')
				} else {
					let userInfo = wfc.getUserInfo(this.operator, false, this.groupId)
					if (userInfo.friendAlias) {
						operatorName = userInfo.friendAlias;
					} else if (userInfo.displayName) {
						operatorName = userInfo.displayName;
					} else {
						operatorName = this.operator;
					}
				}

				let memberName = '';
				if (this.memberId) {
					let userInfo = wfc.getUserInfo(this.memberId, false);
					if (userInfo.friendAlias) {
						memberName = userInfo.friendAlias;
					} else if (userInfo.displayName) {
						memberName = userInfo.displayName;
					} else {
						memberName = this.memberId;
					}
					return i18n.global.t('chat.modify_group_member_info_for', {
						operator: operatorName,
						member: memberName,
						alias: this.alias
					});
				} else {
					return i18n.global.t('chat.modify_group_member_info', {
						operator: operatorName,
						alias: this.alias
					});
				}
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            n: this.groupMemberExtra,
            o: this.operator,
            m: this.memberId,
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
        this.groupMemberExtra = obj.n;
        this.memberId = obj.m;
    }
}
