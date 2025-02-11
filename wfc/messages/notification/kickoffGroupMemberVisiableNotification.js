/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import wfc from '../../client/wfc'
import MessageContentType from "../messageContentType";
import { i18n } from '../../../main.js'
import GroupNotificationContent from "./groupNotification";

export default class KickoffGroupMemberVisiableNotification extends GroupNotificationContent {
    operator = '';
    kickedMembers = [];

    constructor(operator, kickedMembers) {
        super(MessageContentType.KickOffGroupMember_Visible_Notification);
        this.operator = operator;
        this.kickedMembers = kickedMembers;
    }

    formatNotification() {
			// 获取操作人名称
			const operatorName = this.fromSelf
				? i18n.global.t('chat.you')
				: wfc.getGroupMemberDisplayName(this.groupId, this.operator);

			// 获取被移除成员的名称列表
			const userInfos = wfc.getUserInfos(this.kickedMembers, this.groupId);
			const kickedMembersStr = userInfos.map(userInfo =>
				userInfo.uid === wfc.getUserId()
					? i18n.global.t('chat.you')
					: userInfo.displayName
			).join(', '); // 多个成员名之间用逗号分隔

			// 使用国际化文案格式化最终通知字符串
			return i18n.global.t('chat.remove_group_members', {
				operator: operatorName,
				members: kickedMembersStr
			});
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            ms: this.kickedMembers,
            o: this.operateUser,
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
        this.kickedMembers = obj.ms;
    }
}
