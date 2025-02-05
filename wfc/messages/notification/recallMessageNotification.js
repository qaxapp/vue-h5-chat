/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import NotificationMessageContent from './notificationMessageContent'
import wfc from '../../client/wfc'
import MessageContentType from '../messageContentType';
import Long from 'long';
import ConversationType from "../../model/conversationType";
import GroupMemberType from "../../model/groupMemberType";
import { i18n } from '../../../main.js'

export default class RecallMessageNotification extends NotificationMessageContent {
    operatorId = '';
    messageUid = new Long(0);

    originalSender;
    originalContentType;
    originalSearchableContent;
    originalContent;
    originalExtra;
    originalMessageTimestamp;

    constructor(operatorId, messageUid) {
        super(MessageContentType.RecallMessage_Notification);
        this.operatorId = operatorId;
        this.messageUid = messageUid;
    }

    formatNotification(message) {
        if (this.operatorId === wfc.getUserId()){
            return i18n.global.t('chat_im_i18n.you_recalled_a_message');
        }
        if (message.conversation.type === ConversationType.Group) {
            if (this.operatorId === this.originalSender) {
                return wfc.getGroupMemberDisplayName(message.conversation.target, this.operatorId) + i18n.global.t('chat_im_i18n.user_recalled_a_message');
            }
            const groupMember = wfc.getGroupMember(message.conversation.target, this.operatorId);
            if ([GroupMemberType.Manager, GroupMemberType.Owner].indexOf(groupMember.type) >= 0) {
                return i18n.global.t('chat_im_i18n.admin_recalled_a_message');
            }
            return wfc.getGroupMemberDisplayName(message.conversation.target, this.operatorId) + i18n.global.t('chat_im_i18n.user_recalled_a_message');
        } else {
            return wfc.getUserDisplayName(this.operatorId) + i18n.global.t('chat_im_i18n.user_recalled_a_message');
        }
    }

    encode() {
        let payload = super.encode();
        payload.content = this.operatorId;
        payload.binaryContent = wfc.utf8_to_b64(this.messageUid.toString());
        return payload;
    }

    decode(payload) {
        super.decode(payload);
        this.operatorId = payload.content;
        this.messageUid = Long.fromString(wfc.b64_to_utf8(payload.binaryContent));

        try {
            this.setExtra(payload.extra);
        } catch (e) {
            console.error('decode recallMessage extra error', e)
        }
    }

    setExtra(extra) {
        if (extra) {
            extra =extra.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
            let obj = JSON.parse(extra);
            this.originalSender = obj["s"];
            this.originalContentType = obj["t"];
            this.originalSearchableContent = obj["sc"];
            this.originalContent = obj["c"];
            this.originalExtra = obj["e"];
            this.originalMessageTimestamp = Long.fromValue(obj["ts"]);
        }
    }
}
