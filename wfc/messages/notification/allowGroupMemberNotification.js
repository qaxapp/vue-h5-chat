/*
 * Copyright (c) 2020 WildFireChat. All rights reserved.
 */

import GroupNotificationContent from './groupNotification'
import MessageContentType from '../messageContentType'
import wfc from '../../client/wfc'
import { i18n } from '../../../main.js'

export default class AllowGroupMemberNotification extends GroupNotificationContent {
    groupId
    operator
    // 操作类型，1允许发言，0禁止发言
    type
    memberIds

    constructor(operator, type, memberIds) {
        super(MessageContentType.MuteGroupMember_Notification)
        this.operator = operator
        this.type = type
        this.memberIds = memberIds
    }

    formatNotification(message) {
        let notifyStr = ''
        if (this.fromSelf) {
            notifyStr += i18n.global.t('chat.you')
        } else {
            notifyStr += wfc.getGroupMemberDisplayName(this.groupId,
                this.operator)
        }
				notifyStr += ' '
				if (this.type === 0) {
					notifyStr += i18n.global.t('chat.revoke_speaking_permission')
				} else {
					notifyStr += i18n.global.t('chat.grant_speaking_permission')
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
            n: this.type + '',
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
        this.type = parseInt(obj.n)
        this.memberIds = obj.ms
    }
}
