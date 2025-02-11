/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import GroupNotificationContent from "./groupNotification";
import MessageContentType from "../messageContentType";
import wfc from "../../client/wfc";
import { i18n } from '../../../main.js'

export default class GroupPrivateChatNotificationContent extends GroupNotificationContent {
    operator;

    //是否运行群中普通成员私聊。0 允许，1不允许
    privateChatType;

    constructor(operator, privateChatType) {
        super(MessageContentType.ChangePrivateChat_Notification);
        this.operator = operator;
        this.privateChatType = privateChatType;
    }

    formatNotification(message) {
        // return sb.toString();
        let notifyStr = this.fromSelf ? i18n.global.t('chat.you') + ' ' : wfc.getGroupMemberDisplayName(this.groupId, this.operator) + ' ';
        notifyStr += this.privateChatType === 0 ? i18n.global.t('chat.enabled_member_private_chat') : i18n.global.t('chat.disabled_member_private_chat');

        return notifyStr;
    }

    encode() {
        let payload = super.encode();
        let obj = {
            g: this.groupId,
            o: this.operator,
            n: this.privateChatType + ''
        };
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj));
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        let obj = JSON.parse(wfc.b64_to_utf8(payload.binaryContent));
        this.groupId = obj.g;
        this.operator = obj.o;
        this.privateChatType = parseInt(obj.n);
    }
}
