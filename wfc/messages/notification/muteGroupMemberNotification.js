/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import GroupNotificationContent from './groupNotification'
import MessageContentType from '../messageContentType'
import wfc from '../../client/wfc'
import { i18n } from '../../../main.js'

export default class MuteGroupMemberNotification extends GroupNotificationContent {
    groupId
    operator
    // 操作类型，1禁言，0取消禁言
    muteType
    memberIds

    constructor(operator, muteType, memberIds) {
        super(MessageContentType.MuteGroupMember_Notification)
        this.operator = operator
        this.muteType = muteType
        this.memberIds = memberIds
    }

    formatNotification(message) {
        let notifyStr = ''
        if (this.fromSelf) {
            notifyStr += i18n.global.t('chat.you');
        } else {
            notifyStr += wfc.getGroupMemberDisplayName(this.groupId,
                this.operator)
        }
        notifyStr += ' '
        if (this.muteType === 1) {
            notifyStr += i18n.global.t('chat.muted_member');
        } else {
            notifyStr += i18n.global.t('chat.unmuted_member');
        }
        if (this.memberIds) {
            this.memberIds.forEach((memberId) => {
                notifyStr += ' '
                notifyStr += wfc.getGroupMemberDisplayName(this.groupId,
                    memberId)
            })
        }
        return notifyStr
    }

    encode() {
        let payload = super.encode()
        let obj = {
            g: this.groupId,
            o: this.operator,
            n: this.muteType + '',
            ms: this.memberIds,
        }
        payload.binaryContent = wfc.utf8_to_b64(JSON.stringify(obj))
        return payload
    }

    decode(payload) {
        super.decode(payload)

        let json = wfc.b64_to_utf8(payload.binaryContent)
        let obj = JSON.parse(json)
        this.groupId = obj.g
        this.operator = obj.o
        this.muteType = parseInt(obj.n)
        this.memberIds = obj.ms
    }
}
